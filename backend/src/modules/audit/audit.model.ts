export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VERIFY' | 'APPROVE' | 'LOGIN';
  table_name: string;
  record_id: string;
  data_before: any;
  data_after: any;
  ip_address: string | null;
  timestamp: string;
}

// Format respon untuk Frontend (sesuai gambar UI Anda)
export interface AuditLogResponse {
  id: string;
  tanggal: string;
  pengguna: { nama: string; email: string };
  modul: string;
  aksi: string;
  detail: string; // Kalimat informatif
  ip_address: string;
}

export type CreateAuditLogDto = Omit<AuditLog, 'id' | 'timestamp'>;