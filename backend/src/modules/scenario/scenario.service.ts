// src/modules/scenario/scenario.service.ts

import { ScenarioRepository } from "./scenario.repository.js";
import type { Scenario, CreateScenarioDto, UpdateScenarioDto } from "./scenario.model.js";
import type { NormalizedUser } from '../../types/index.js';
import { NotificationService } from '../notification/notification.service.js';
import { AuditService } from '../audit/audit.service.js';

// Helper untuk peran admin (sesuaikan 'role_name' jika perlu)
const isAdmin = (user: NormalizedUser) => 
  user.role_name === 'admin_diskominfo' || user.role_name === 'auditor';

export class ScenarioService {

  /**
   * Helper internal terpusat untuk cek izin GET, UPDATE, DELETE.
   * Memastikan pengguna berasal dari departemen yang sama dengan skenario.
   */
  private static async checkPermission(user: NormalizedUser, scenarioId: string): Promise<void> {
    if (isAdmin(user)) return; // Admin boleh melakukan apa saja

    // 1. Dapatkan ID departemen user (dari nama di JWT)
    if (!user.department_name) {
      throw new Error("Token tidak memiliki department_name");
    }
    const userDeptId = await ScenarioRepository.findDepartmentIdByName(user.department_name);
    if (!userDeptId) {
      throw new Error(`Departemen '${user.department_name}' tidak ditemukan di database`);
    }

    // 2. Dapatkan ID departemen skenario (dari aset pertamanya)
    const scenarioDeptId = await ScenarioRepository.getScenarioDepartmentId(scenarioId);
    if (!scenarioDeptId) {
      // Ini bisa berarti skenario tidak ditemukan, atau tidak punya aset
      throw new Error("Skenario tidak ditemukan atau tidak memiliki aset tertaut.");
    }
    
    // 3. Bandingkan ID vs ID
    if (userDeptId !== scenarioDeptId) {
      throw new Error("Anda tidak memiliki izin untuk mengakses skenario ini.");
    }
  }

  /**
   * Mengambil satu skenario berdasarkan ID
   */
  static async findById(id: string, user: NormalizedUser): Promise<Scenario | null> {
    // 1. ❗️ Cek izin
    await this.checkPermission(user, id);
    
    // 2. Ambil data
    return ScenarioRepository.findById(id);
  }

  /**
   * Mengambil semua skenario (dengan filter departemen)
   */
  static async findAll(user: NormalizedUser): Promise<Scenario[]> {
    if (isAdmin(user)) {
      return ScenarioRepository.findAll(); // Admin lihat semua
    }
    
    // 1. Dapatkan ID departemen user
    if (!user.department_name) throw new Error("Token tidak memiliki department_name");
    const userDeptId = await ScenarioRepository.findDepartmentIdByName(user.department_name);
    if (!userDeptId) return []; // Tidak ada departemen, kembalikan array kosong

    return ScenarioRepository.findAllByDepartmentId(userDeptId);
  }

  /**
   * Membuat skenario baru
   */
  static async create(payload: CreateScenarioDto, user: NormalizedUser): Promise<Scenario> {
    // Validasi DTO dasar
    if (!payload.name) {
      throw new Error("Nama skenario wajib diisi.");
    }
    if (!payload.asset_ids || payload.asset_ids.length === 0) {
      throw new Error("Minimal satu aset harus ditautkan.");
    }

    if (!isAdmin(user)) {
      // 1. Dapatkan ID departemen user
      if (!user.department_name) throw new Error("Token tidak memiliki department_name");
      const userDeptId = await ScenarioRepository.findDepartmentIdByName(user.department_name);
      if (!userDeptId) throw new Error(`Departemen '${user.department_name}' tidak ditemukan`);
      
      // 2. ❗️ Validasi Aturan Bisnis:
      // Pastikan semua aset yang ditautkan berasal dari departemen user
      const allAssetsValid = await ScenarioRepository.areAllAssetsInDepartment(
        payload.asset_ids,
        userDeptId
      );
      
      if (!allAssetsValid) {
        throw new Error("Gagal membuat skenario: Semua aset yang ditautkan harus berasal dari departemen Anda.");
      }
    }
    
    const newScenario = await ScenarioRepository.create(payload, user);

    // 3. 🚀 NOTIFIKASI (Info ke Verifikator/Admin)
    void NotificationService.notifyRoles({
        roles: ["verifikator", "admin_diskominfo"], // Info ke atasan
        senderId: user.user_id,
        category: 'Scenario',
        title: 'Skenario Baru Dibuat',
        message: `Skenario "${newScenario.name}" telah dibuat oleh ${user.name || user.email}.`,
        link: `/scenarios/${newScenario.id}`,
        type: 'info'
    });

    // 4. 🚀 AUDIT TRAIL
    void AuditService.log({
        user_id: user.user_id,
        user_name: user.name || user.email,
        user_email: user.email,
        action: "CREATE",
        table_name: "scenario",
        record_id: newScenario.id,
        data_before: null,
        data_after: newScenario,
        ip_address: user.ip_address || null
    });

    return newScenario;
  }

  /**
   * Mengupdate skenario yang ada
   */
  static async update(id: string, payload: UpdateScenarioDto, user: NormalizedUser): Promise<Scenario> {
    const oldScenario = await ScenarioRepository.findById(id);
    if (!oldScenario) throw new Error("Skenario tidak ditemukan.");

    // 2. Cek Izin & Validasi Departemen
    if (!isAdmin(user)) {
        if (!user.department_name) throw new Error("Token tidak memiliki department_name");
        const userDeptId = await ScenarioRepository.findDepartmentIdByName(user.department_name);
        if (!userDeptId) throw new Error(`Departemen '${user.department_name}' tidak ditemukan`);
  
        // Cek departemen skenario yang ada
        const scenarioDeptId = await ScenarioRepository.getScenarioDepartmentId(id);
  
        if (scenarioDeptId) {
          // KASUS 1: SKENARIO SUDAH PUNYA PEMILIK
          // Pastikan user berasal dari departemen yang sama
          if (scenarioDeptId !== userDeptId) {
            throw new Error("Anda tidak memiliki izin untuk mengakses skenario ini.");
          }
        } else {
          // KASUS 2: SKENARIO "YATIM" (BELUM ADA PEMILIK)
          // Wajibkan user untuk menautkan aset agar skenario ini jadi milik departemennya
          if (!payload.asset_ids || payload.asset_ids.length === 0) {
            throw new Error("Skenario ini belum memiliki departemen. Tautkan aset untuk mengklaimnya.");
          }
        }
  
        // VALIDASI ASET BARU (Berlaku untuk kedua kasus di atas)
        // Jika user mengubah daftar aset, pastikan semua aset itu milik departemen user
        if (payload.asset_ids) {
          const allAssetsValid = await ScenarioRepository.areAllAssetsInDepartment(payload.asset_ids, userDeptId);
          if (!allAssetsValid) throw new Error("Semua aset yang ditautkan harus berasal dari departemen Anda.");
        }
    }
    
    // 3. Panggil Repository (Update)
    const updatedScenario = await ScenarioRepository.update(id, payload);

    // 4. 🚀 NOTIFIKASI
    void NotificationService.notifyRoles({
        roles: ["verifikator"],
        senderId: user.user_id,
        category: 'Scenario',
        title: 'Skenario Diperbarui',
        message: `Skenario "${oldScenario.name}" telah diperbarui oleh ${user.name || user.email}.`,
        link: `/scenarios/${id}`,
        type: 'warning'
    });

    // 5. 🚀 AUDIT TRAIL
    void AuditService.log({
        user_id: user.user_id,
        user_name: user.name || user.email,
        user_email: user.email,
        action: "UPDATE",
        table_name: "scenario",
        record_id: id,
        data_before: oldScenario,
        data_after: updatedScenario,
        ip_address: user.ip_address || null
    });

    return updatedScenario;
  }

  /**
   * Menghapus skenario
   */
  static async delete(id: string, user: NormalizedUser): Promise<void> {
    const oldScenario = await ScenarioRepository.findById(id); // Snapshot sebelum hapus

    // ✅ Gunakan checkPermission ketat
    await this.checkPermission(user, id);
    
    await ScenarioRepository.delete(id);

    // 🚀 Audit Delete
    if (oldScenario) {
        void AuditService.log({
            user_id: user.user_id,
            user_name: user.name || user.email,
            user_email: user.email,
            action: "DELETE",
            table_name: "scenario",
            record_id: id,
            data_before: oldScenario,
            data_after: null,
            ip_address: user.ip_address || null
        });
    }
  }
}