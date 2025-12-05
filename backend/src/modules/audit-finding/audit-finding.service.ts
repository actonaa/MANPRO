// src/modules/audit-finding/audit-finding.service.ts
import { AuditFindingRepository } from "./audit-finding.repository.js";
import type { CreateFindingDto, CreateReportDto } from "./audit-finding.model.js";
import type { NormalizedUser } from "../../types/index.js";
import { NotificationService } from "../notification/notification.service.js";

const isAuditor = (user: NormalizedUser) => user.role_name === 'auditor' || user.role_name === 'admin_diskominfo';

export class AuditFindingService {

  // === 1. UPLOAD LAPORAN AUDIT ===
  static async uploadReport(
    payload: CreateReportDto, 
    user: NormalizedUser,
    file: Express.Multer.File
  ) {
    if (!isAuditor(user)) throw new Error("Hanya Auditor yang boleh upload laporan.");
    if (!file) throw new Error("File laporan wajib diunggah.");

    // Upload File
    const fileExt = file.originalname.split('.').pop();
    const fileName = `audit-report-${Date.now()}.${fileExt}`;
    const url = await AuditFindingRepository.uploadReportFile(fileName, file.buffer, file.mimetype);

    // Simpan ke DB
    const report = await AuditFindingRepository.createReport({
      ...payload,
      file_url: url,
      auditor_id: user.user_id
    });

    // Notifikasi ke Admin/Verifikator bahwa ada laporan baru
    void NotificationService.notifyRoles({
      roles: ["admin_diskominfo", "verifikator_dinas"],
      senderId: user.user_id,
      category: "System",
      title: "Laporan Audit Baru",
      message: `Laporan audit "${payload.title}" telah diterbitkan.`,
      link: `/audit/reports`, // Halaman list laporan
      type: "info"
    });

    return report;
  }

  static async getAllReports(user: NormalizedUser) {
    // Semua role boleh lihat laporan (Transparansi), atau batasi jika perlu
    return AuditFindingRepository.findAllReports();
  }

  // === 2. KOMENTAR/TEMUAN AUDIT ===
  
  static async addFinding(payload: CreateFindingDto, user: NormalizedUser) {
    if (!isAuditor(user)) throw new Error("Hanya Auditor yang boleh menambahkan temuan.");

    const finding = await AuditFindingRepository.createFinding({
      ...payload,
      status: 'open',
      auditor_id: user.user_id
    });

    // Notifikasi ke Verifikator (Penting!)
    // (Di sini idealnya kita cari tahu siapa pemilik Entity tersebut untuk notif lebih spesifik)
    void NotificationService.notifyRoles({
      roles: ["verifikator_dinas"],
      senderId: user.user_id,
      category: 'System', // Atau bisa dinamis berdasarkan entity_type
      title: 'Temuan Audit Baru',
      message: `Auditor memberikan catatan ${payload.severity} pada ${payload.entity_type}.`,
      link: `/${payload.entity_type}s/${payload.entity_id}`, // Link dinamis ke detail aset/risk
      type: "warning"
    });

    return finding;
  }

  static async getFindingsByEntity(type: string, id: string) {
    return AuditFindingRepository.findByEntity(type, id);
  }

  // Fitur: Tandai Selesai (Oleh Dinas)
  static async resolveFinding(id: string, user: NormalizedUser) {
    // Validasi: Apakah user berhak menyelesaikan temuan ini?
    // (Sederhana: Asal bukan auditor, berarti pihak teraudit)
    
    await AuditFindingRepository.updateFindingStatus(id, 'resolved');
    
    return { message: "Temuan ditandai telah diselesaikan." };
  }
}