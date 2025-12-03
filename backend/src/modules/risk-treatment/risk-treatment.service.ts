// src/modules/risk-treatment/risk-treatment.service.ts
import { RiskTreatmentRepository } from "./risk-treatment.repository.js";
import type { CreateTreatmentDto, UpdateTreatmentDto, RiskTreatment } from "./risk-treatment.model.js";
import type { NormalizedUser } from "../../types/index.js";

// Helper
const isAdmin = (user: NormalizedUser) => user.role_name === 'admin_diskominfo';

export class RiskTreatmentService {

  /** ✅ Create Treatment */
  static async createTreatment(
    payload: CreateTreatmentDto, 
    user: NormalizedUser
  ): Promise<RiskTreatment> {
    
    // 1. Ambil data untuk validasi (dari Repo)
    const riskDeptId = await RiskTreatmentRepository.findRiskDepartment(payload.risk_id);
    if (!riskDeptId) throw new Error("Risk tidak ditemukan.");

    // 2. Logika Bisnis: Cek Izin
    if (!isAdmin(user)) {
      if (!user.department_name) {
        throw new Error("Data departemen pengguna tidak tersedia di token SSO.");
      }

      // Panggil helper yang sudah Anda buat
      const userDeptId = await RiskTreatmentRepository.findDepartmentIdByName(user.department_name);

      if (!userDeptId) {
        throw new Error(`Departemen '${user.department_name}' tidak ditemukan di sistem.`);
      }

      // Bandingkan ID vs ID
      if (riskDeptId !== userDeptId) {
        throw new Error("Anda tidak memiliki akses untuk menambah treatment pada risiko dinas lain.");
      }
    }

    // 3. Siapkan data & Panggil Repo
    const dataToCreate: Partial<RiskTreatment> = {
      ...payload,
    };

    return RiskTreatmentRepository.create(dataToCreate);
  }

  /** ✅ Update Treatment */
  static async updateTreatment(
    id: string, 
    payload: UpdateTreatmentDto, 
    user: NormalizedUser
  ): Promise<RiskTreatment> {
    
    // 1. Ambil data untuk validasi (dari Repo)
    const parentDeptId = await RiskTreatmentRepository.findTreatmentParentDepartment(id);
    if (!parentDeptId) throw new Error("Treatment tidak ditemukan atau relasi risk-nya hilang.");

    // 2. Logika Bisnis: Cek Izin
    if (!isAdmin(user)) {
      if (!user.department_name) {
        throw new Error("Data departemen pengguna tidak tersedia di token SSO.");
      }

      // Panggil helper untuk mengonversi NAMA user menjadi ID
      const userDeptId = await RiskTreatmentRepository.findDepartmentIdByName(user.department_name);

      if (!userDeptId) {
        throw new Error(`Departemen '${user.department_name}' tidak ditemukan di sistem.`);
      }

      // Bandingkan ID vs ID
      if (parentDeptId !== userDeptId) {
        throw new Error("Anda tidak memiliki akses untuk mengubah treatment dinas lain.");
      }
    }

    // 3. Siapkan data & Panggil Repo
    const dataToUpdate: Partial<RiskTreatment> = {
      ...payload,
    };
    
    return RiskTreatmentRepository.update(id, dataToUpdate);
  }

  static async findAllForRisk(
    riskId: string, 
    user: NormalizedUser
  ): Promise<RiskTreatment[]> {
    
    // 1. Ambil data untuk validasi (dari Repo)
    const riskDeptId = await RiskTreatmentRepository.findRiskDepartment(riskId);
    if (!riskDeptId) throw new Error("Risk tidak ditemukan.");

    // 2. Logika Bisnis: Cek Izin
    if (!isAdmin(user)) {
      if (!user.department_name) {
        throw new Error("Data departemen pengguna tidak tersedia di token SSO.");
      }

      // Panggil helper yang sudah Anda buat
      const userDeptId = await RiskTreatmentRepository.findDepartmentIdByName(user.department_name);

      if (!userDeptId) {
        throw new Error(`Departemen '${user.department_name}' tidak ditemukan di sistem.`);
      }

      // Bandingkan ID vs ID
      if (riskDeptId !== userDeptId) {
        throw new Error("Anda tidak memiliki akses untuk menambah treatment pada risiko dinas lain.");
      }
    }
    // 3. Jika Izin OK, panggil Repo untuk mengambil data
    return RiskTreatmentRepository.findAllByRiskId(riskId);
  }
}