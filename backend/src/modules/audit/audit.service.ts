import { AuditRepository } from "./audit.repository.js";
import type { AuditLog, AuditLogResponse, CreateAuditLogDto } from "./audit.model.js";

export class AuditService {

  // Helper: Terjemahkan nama tabel
  private static formatModule(tableName: string): string {
    const map: Record<string, string> = {
      'asset': 'Aset',
      'risk': 'Risiko',
      'risk_treatment': 'Penanganan Risiko',
      'maintenance_logs': 'Pemeliharaan',
      'scenario': 'Skenario',
      'user': 'Pengguna'
    };
    return map[tableName] || tableName;
  }

  // Helper: Terjemahkan aksi
  private static formatAction(action: string): string {
    const map: Record<string, string> = {
      'CREATE': 'Buat', 'UPDATE': 'Perbarui', 'DELETE': 'Hapus',
      'VERIFY': 'Verifikasi', 'APPROVE': 'Penyetujuan'
    };
    return map[action] || action;
  }

  // Helper: Dapatkan Nama Objek dengan aman
  private static getName(data: any): string {
    if (!data) return 'Item';
    return data.name || data.title || data.serial_number || data.description || 'Item';
  }

  // Helper: Generate kalimat Detail yang PINTAR
  private static generateDetail(log: AuditLog): string {
    const name = this.getName(log.data_after || log.data_before);
    
    switch (log.action) {
      case 'CREATE':
        return `Menambahkan data baru "${name}"`;
      
      case 'DELETE':
        return `Menghapus data "${name}"`;
      
      case 'VERIFY':
        return `Memverifikasi data "${name}"`;
        
      case 'APPROVE':
        return `Menyetujui data "${name}"`;

      case 'UPDATE':
        // Logika Deteksi Perubahan
        const before = log.data_before || {};
        const after = log.data_after || {};
        const changes: string[] = [];

        // Cek perubahan Status
        if (before.status !== after.status) {
           // Handle jika status berupa objek join atau string ID
           const newStat = typeof after.status === 'object' ? after.status?.name : after.status;
           if (newStat) changes.push(`Status menjadi "${newStat}"`);
        }

        // Cek perubahan Approval
        if (before.approval_status !== after.approval_status) {
           changes.push(`Status Persetujuan menjadi "${after.approval_status}"`);
        }

        // Cek perubahan Penanggung Jawab (PIC)
        if (before.pic !== after.pic && after.pic) {
           changes.push(`PIC diubah menjadi "${after.pic}"`);
        }

        // Cek perubahan Lokasi
        if (before.lokasi !== after.lokasi && after.lokasi) {
           changes.push(`Lokasi dipindah ke "${after.lokasi}"`);
        }

        // Jika ada perubahan spesifik yang terdeteksi
        if (changes.length > 0) {
          return `Mengubah ${name}: ${changes.join(', ')}`;
        }
        
        // Default fallback
        return `Memperbarui detail data "${name}"`;

      default:
        return `Melakukan aktivitas pada ${name}`;
    }
  }

  // Fungsi Utama: Simpan Log
  static async log(dto: CreateAuditLogDto): Promise<void> {
    await AuditRepository.create({
      ...dto,
      timestamp: new Date().toISOString()
    });
  }

  // Fungsi Utama: Ambil Log untuk UI
  static async getAllLogs(): Promise<AuditLogResponse[]> {
    const logs = await AuditRepository.findAll();
    return logs.map(log => ({
      id: log.id,
      tanggal: log.timestamp,
      pengguna: { 
        nama: log.user_name || 'System', 
        email: log.user_email || '-' 
      },
      modul: this.formatModule(log.table_name),
      aksi: this.formatAction(log.action),
      detail: this.generateDetail(log), // 👈 Menggunakan logika pintar di atas
      ip_address: log.ip_address || '-'
    }));
  }
}