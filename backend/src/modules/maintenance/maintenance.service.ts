import { supabase } from "../../config/supabaseClient.js";
import { MaintenanceRepository } from "./maintenance.repository.js";
import type { CreateMaintenanceDto, UpdateMaintenanceDto, CompleteMaintenanceDto, MaintenanceLog } from "./maintenance.model.js";
import type { NormalizedUser } from "../../types/index.js";
import { RiskRepository } from "../risk/risk.repository.js";
import { NotificationService } from '../notification/notification.service.js';
import { AuditService } from '../audit/audit.service.js';

// Helper Roles
const isVerifikator = (user: NormalizedUser) => user.role_name === 'verifikator';
const isAdmin = (user: NormalizedUser) => user.role_name === 'admin_diskominfo' || 'auditor';
const isTeknisi = (user: NormalizedUser) => user.role_name === 'teknisi';

export class MaintenanceService {

  /** * Helper internal untuk cek izin verifikator
   */
  private static async checkPermission(
    user: NormalizedUser, 
    getData: () => Promise<string | null>
  ): Promise<void> {
    if (isAdmin(user)) return; // Admin boleh melakukan apa saja

    if (isVerifikator(user)) {
    // 1. Dapatkan ID Departemen dari Aset/Log yang dituju
    const assetDeptId = await getData(); 
    if (!assetDeptId) throw new Error("Aset atau data terkait tidak ditemukan.");

    // 2. Dapatkan ID Departemen dari User (via NAMA)
    if (!user.department_name) {
      throw new Error("Data departemen pengguna tidak tersedia di token SSO.");
    }
    
    // Ganti 'AssetRepository' jika Anda memindahkan fungsi ini
    const userDeptId = await MaintenanceRepository.findDepartmentIdByName(user.department_name); 

    if (!userDeptId) {
      throw new Error(`Departemen '${user.department_name}' tidak ditemukan di sistem.`);
    }

    // 3. Bandingkan ID vs ID (YANG BENAR)
    if (assetDeptId !== userDeptId) {
      throw new Error("Anda tidak memiliki akses ke aset dinas lain.");
    }

  } else {
    // Jika bukan admin atau verifikator, tolak
    throw new Error("Anda tidak memiliki izin untuk melakukan aksi ini.");
  }
  }

  static async getAll(
    user: NormalizedUser, 
    filters: { status?: string }
  ): Promise<MaintenanceLog[]> {
    
    let logs: MaintenanceLog[] = [];

    // 1. Ambil Data Utama (Logs + Asset + Risk)
    if (isAdmin(user)) {
      logs = await MaintenanceRepository.findAll(filters);
    } else if ((isVerifikator(user) || isTeknisi(user)) && user.department_name) {
      const departmentId = await MaintenanceRepository.findDepartmentIdByName(user.department_name); 
      if (!departmentId) {
        throw new Error(`Departemen '${user.department_name}' tidak ditemukan.`);
      }
      logs = await MaintenanceRepository.findAllByDepartment(departmentId, filters);
    } else {
      throw new Error("Anda tidak memiliki izin untuk melihat data ini.");
    }

    // 2. 🚀 Optimasi: Bulk Fetch Nama Departemen
    // Kumpulkan semua department_id unik dari aset yang ditemukan
    const deptIds = new Set<string>();
    logs.forEach(log => {
        if (log.asset?.department_id) {
            deptIds.add(log.asset.department_id);
        }
    });

    // Ambil map nama departemen { "id": "nama" }
    const deptMap = await MaintenanceRepository.findDepartmentsByIds(Array.from(deptIds));

    // 3. Tempelkan Nama Departemen ke setiap Log
    // (Mutasi objek di memori sebelum dikirim ke frontend)
    logs.forEach(log => {
        if (log.asset && log.asset.department_id) {
            const deptName = deptMap[log.asset.department_id];
            // Kita isi properti optional 'department' di dalam asset
            if (deptName) {
                log.asset.department = { name: deptName };
            }
        }
    });

    return logs;
  }

  static async findById(id: string, user: NormalizedUser): Promise<MaintenanceLog> {
    // 1. Ambil Data (Sekarang sudah super lengkap dari Repo)
    const log = await MaintenanceRepository.findById(id);
    
    if (!log) throw new Error("Data pemeliharaan tidak ditemukan.");

    // 2. Cek Izin Admin (Bebas)
    if (isAdmin(user)) {
      return log; 
    }

    // 3. Cek Departemen User vs Aset
    if ((isVerifikator(user) || isTeknisi(user)) && user.department_name) {
      
      const userDeptId = await MaintenanceRepository.findDepartmentIdByName(user.department_name);
      if (!userDeptId) throw new Error(`Departemen '${user.department_name}' tidak valid.`);

      if (!log.asset) {
         throw new Error("Data aset terkait hilang atau tidak ditemukan.");
      }

      // Validasi ID Departemen (Masih bekerja karena field department_id tetap diambil)
      if (log.asset.department_id !== userDeptId) {
        throw new Error("Anda tidak memiliki akses untuk melihat detail pemeliharaan ini.");
      }
      
      return log;
    }

    throw new Error("Akses ditolak.");
  }

  /** 🔹 Membuat jadwal pemeliharaan */
  static async createSchedule(
    assetId: string, 
    payload: CreateMaintenanceDto, // 👈 Tipe DTO berubah
    user: NormalizedUser
  ): Promise<MaintenanceLog> {
    
    // 1. Cek Izin (Tetap sama)
    await this.checkPermission(user, () => 
      MaintenanceRepository.findAssetDepartment(assetId)
    );
    
    if (!payload.risk_id) {
        throw new Error("Anda harus memilih Risiko yang akan ditangani dalam jadwal ini.");
    }

    // Cek ke database apakah risk ini valid
    const riskCheck = await RiskRepository.findById(payload.risk_id); // Atau buat helper simple findByIdSimple
    if (!riskCheck) {
        throw new Error("Risiko tidak ditemukan.");
    }

    // Cek apakah Risk ini benar-benar menempel pada Asset yang dipilih?
    // (Mencegah user menjadwalkan Risk Aset A tapi di URL pakai ID Aset B)
    if (riskCheck.asset_id !== assetId) {
        throw new Error("Risiko yang dipilih tidak sesuai dengan aset yang dijadwalkan.");
    }
    // 2. Siapkan Data (Lebih ramping)
    const dataToCreate: Partial<MaintenanceLog> = {
      ...payload, // Hanya berisi 'scheduled_date', 'notes'
      asset_id: assetId,
      risk_id: payload.risk_id,
      status: 'dijadwalkan',
      created_by: user.user_id,
      created_at: new Date().toISOString()
    };

    const newLog = await MaintenanceRepository.create(dataToCreate);

    // 5. 🚀 NOTIFIKASI (Ke Teknisi)
    // Memberi tahu tim teknis ada tugas baru
    void NotificationService.notifyRoles({
      roles: ["teknisi"], // Kirim ke role yang bertugas
      senderId: user.user_id,
      category: 'Maintenance',
      title: 'Jadwal Pemeliharaan Baru',
      // riskCheck.asset?.name mungkin tersedia jika findById melakukan join
      message: `Jadwal baru ditetapkan untuk menangani risiko "${riskCheck.title}" pada tanggal ${payload.scheduled_date}.`,
      link: `/maintenance/${newLog.id}`,
      type: 'info'
    });

    // 6. 🚀 AUDIT TRAIL
    void AuditService.log({
      user_id: user.user_id,
      user_name: user.name || user.email,
      user_email: user.email,
      action: "CREATE",
      table_name: "maintenance_logs",
      record_id: newLog.id,
      data_before: null,
      data_after: newLog,
      ip_address: user.ip_address || null
    });

    return newLog;
  }

  /** 🔹 Lihat semua jadwal pemeliharaan per aset */
  static async getByAsset(assetId: string, user: NormalizedUser): Promise<MaintenanceLog[]> {
    // 1. Cek Izin
    if (!isTeknisi(user)) {
      await this.checkPermission(user, () => 
        MaintenanceRepository.findAssetDepartment(assetId)
      );
    }

    // 2. Panggil Repo
    return MaintenanceRepository.findByAssetId(assetId);
  }

  /** 🔹 Update jadwal pemeliharaan */
  static async update(id: string, payload: UpdateMaintenanceDto, user: NormalizedUser): Promise<MaintenanceLog> {
    // 1. Ambil Data Lama (Untuk Snapshot Audit & Cek Izin)
    const oldLog = await MaintenanceRepository.findById(id);
    if (!oldLog) throw new Error("Data pemeliharaan tidak ditemukan.");

    // 2. Cek Izin
    // Kita bisa langsung ambil department_id dari oldLog karena findById sudah melakukan join
    await this.checkPermission(user, async () => {
      return oldLog.asset?.department_id || null;
    });

    // 3. Siapkan Data Update
    const dataToUpdate: Partial<MaintenanceLog> = {
      ...payload,
      // ✅ Simpan siapa yang mengubah
      updated_by: user.user_id,
      updated_at: new Date().toISOString()
    };

    // 4. Eksekusi Update
    const updatedLog = await MaintenanceRepository.update(id, dataToUpdate);

    // 5. 🚀 NOTIFIKASI (Jadwal Berubah)
    // Beri tahu Verifikator bahwa jadwal telah direvisi
    void NotificationService.notifyRoles({
        roles: ["verifikator"],
        senderId: user.user_id,
        category: 'Maintenance',
        title: 'Jadwal Pemeliharaan Diubah',
        // oldLog.asset?.name harusnya ada karena findById melakukan join
        message: `Jadwal pemeliharaan untuk aset "${oldLog.asset?.name || 'Aset'}" telah diperbarui oleh ${user.name || user.email}.`,
        notes: payload.notes || null,
        link: `/maintenance/${id}`,
        type: 'warning' // Kuning (Perubahan)
    });

    // 6. 🚀 AUDIT TRAIL
    void AuditService.log({
      user_id: user.user_id,
      user_name: user.name || user.email,
      user_email: user.email,
      action: "UPDATE",
      table_name: "maintenance_logs",
      record_id: id,
      data_before: oldLog,      // Data Sebelum
      data_after: updatedLog,   // Data Sesudah
      ip_address: user.ip_address || null
    });

    return updatedLog;
  }

  /** 🔹 Tandai pemeliharaan selesai (Orkestrasi) */
  static async complete(
    id: string, 
    payload: CompleteMaintenanceDto,
    user: NormalizedUser,
    file?: Express.Multer.File
  ): Promise<MaintenanceLog> {
    
    const oldLog = await MaintenanceRepository.findById(id);
    if (!oldLog) throw new Error("Jadwal Maintenance tidak ditemukan.");

    if (!oldLog.asset_id) throw new Error("Aset terkait tidak ditemukan untuk log ini.");
    const assetDeptId = oldLog.asset?.department_id || null;

    if (!isTeknisi(user)) {
      await this.checkPermission(user, () => {
        return Promise.resolve(assetDeptId);
      });
    }

    // 3. Siapkan Data Update
    const dataToUpdate: Partial<MaintenanceLog> = {
      ...payload, 
      completion_date: payload.completion_date || new Date().toISOString(),
      // Pastikan string ini sesuai dengan ENUM di database/model ('completed' atau 'selesai')
      status: 'selesai', 
      
      // ✅ TAMBAHAN: Catat siapa yang menyelesaikan
      updated_by: user.user_id,
      updated_at: new Date().toISOString()
    };

    // 4. Handle File Upload
    if (file) {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `maint-${id}-${Date.now()}.${fileExt}`;

      const proofUrl = await MaintenanceRepository.uploadProof(
        fileName,
        file.buffer,
        file.mimetype
      );

      dataToUpdate.proof = proofUrl;
    }

    // 5. Update Log Maintenance
    const updatedLog = await MaintenanceRepository.update(id, dataToUpdate);

    // 6. Side-effect: Update status aset
    const AKTIF_STATUS_ID = "1b2ccf3a-3b0a-4662-a742-cf52039d98d4"; 
    await MaintenanceRepository.updateAssetStatus(oldLog.asset_id, AKTIF_STATUS_ID);
    
    if (oldLog.risk_id) {
        await RiskRepository.updateRisk(oldLog.risk_id, {
            status: 'completed', 
            updated_by: user.user_id,
            updated_at: new Date().toISOString()
        });
    }
    
    // 7. 🚀 NOTIFIKASI (Laporan ke Verifikator)
    // Memberi tahu Verifikator bahwa Teknisi sudah selesai kerja
    void NotificationService.notifyRoles({
        roles: ["verifikator"],
        senderId: user.user_id,
        category: 'Maintenance',
        title: 'Pemeliharaan Selesai',
        // oldLog.asset?.name tersedia karena kita pakai findById di atas
        message: `Pemeliharaan aset "${oldLog.asset?.name || 'Unknown'}" telah diselesaikan oleh ${user.name || user.email}. Aset kembali Aktif.`,
        notes: payload.notes || null,
        link: `/maintenance/${id}`,
        type: 'success'
    });

    // 8. 🚀 AUDIT TRAIL
    void AuditService.log({
      user_id: user.user_id,
      user_name: user.name || user.email,
      user_email: user.email,
      action: "UPDATE", // Status berubah dari scheduled -> completed
      table_name: "maintenance_logs",
      record_id: id,
      data_before: oldLog,      // Data sebelum selesai
      data_after: updatedLog,   // Data sesudah selesai
      ip_address: user.ip_address || null
    });

    return updatedLog;
  }

  /** 🔹 Hapus jadwal */
  static async delete(id: string, user: NormalizedUser): Promise<{ message: string }> {
   const oldLog = await MaintenanceRepository.findById(id);
    if (!oldLog) throw new Error("Jadwal pemeliharaan tidak ditemukan.");

    // 2. Cek Izin
    // Kita gunakan data dari oldLog yang sudah di-fetch
    await this.checkPermission(user, async () => {
      return oldLog.asset?.department_id || null;
    });
    
    // 3. Panggil Repo (Hapus Data)
    await MaintenanceRepository.delete(id);

    // 4. 🚀 NOTIFIKASI (Penghapusan Jadwal)
    // Beri tahu Verifikator bahwa jadwal dibatalkan/dihapus
    void NotificationService.notifyRoles({
        roles: ["verifikator_dinas"],
        senderId: user.user_id,
        category: 'Maintenance',
        title: 'Jadwal Pemeliharaan Dihapus',
        message: `Jadwal pemeliharaan untuk aset "${oldLog.asset?.name || 'Unknown'}" pada tanggal ${oldLog.scheduled_date} telah dihapus oleh ${user.name || user.email}.`,
        link: `/maintenance`, // Link ke halaman list (karena detail sudah hilang)
        type: 'error' // Merah (Destruktif)
    });

    // 5. 🚀 AUDIT TRAIL
    void AuditService.log({
      user_id: user.user_id,
      user_name: user.name || user.email,
      user_email: user.email,
      action: "DELETE",
      table_name: "maintenance_logs",
      record_id: id,
      data_before: oldLog, // Simpan data terakhir sebelum dihapus
      data_after: null,    // null karena data sudah tidak ada
      ip_address: user.ip_address || null
    });

    return { message: "Jadwal pemeliharaan berhasil dihapus." };
  }
    static async autoStartDailyMaintenance(): Promise<void> {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      console.log(`[CRON] Checking maintenance for date: ${today}`);
  
      // 1. Cari semua jadwal 'scheduled' yang tanggalnya <= hari ini
      const { data: logs, error } = await supabase
        .from("maintenance_logs")
        .select("id, asset_id, risk_id")
        .eq("status", "scheduled")
        .lte("scheduled_date", today); // lte = Less Than or Equal (jaga-jaga kalau kemarin server mati)
  
      if (error) {
        console.error("[CRON] Error fetching logs:", error.message);
        return;
      }
  
      if (!logs || logs.length === 0) {
        console.log("[CRON] Tidak ada jadwal maintenance untuk dimulai hari ini.");
        return;
      }
  
      console.log(`[CRON] Memulai ${logs.length} jadwal maintenance...`);
  
      const PEMELIHARAAN_STATUS_ID = "9ac09a40-f161-4181-a11c-b25beed5f4c0";
  
      // 2. Loop dan Eksekusi Update
      for (const log of logs) {
        try {
          // A. Update Log -> in_progress
          await MaintenanceRepository.update(log.id, {
            status: 'pemeliharaan',
            updated_at: new Date().toISOString()
            // updated_by kosong karena ini sistem
          });
  
          // B. Update Asset -> Pemeliharaan
          await MaintenanceRepository.updateAssetStatus(log.asset_id, PEMELIHARAAN_STATUS_ID);
  
          // C. Update Risk -> in_progress
          if (log.risk_id) {
            await RiskRepository.updateRisk(log.risk_id, {
               status: 'in_progress',
               updated_at: new Date().toISOString()
            });
          }
  
          // D. Audit Trail System
          void AuditService.log({
            user_id: '00000000-0000-0000-0000-000000000000',
            user_name: 'SYSTEM (Scheduler)',
            user_email: 'system@cron',
            action: "UPDATE",
            table_name: "maintenance_logs",
            record_id: log.id,
            data_before: { status: 'scheduled' },
            data_after: { status: 'in_progress' },
            ip_address: '127.0.0.1'
          });
  
          console.log(`[CRON] Success start maintenance: ${log.id}`);
  
        } catch (err) {
          console.error(`[CRON] Failed to start maintenance ${log.id}:`, err);
        }
      }
    }
}