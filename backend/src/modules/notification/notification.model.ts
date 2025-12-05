// src/modules/notification/notification.model.ts

export interface Notification {
  id: string;
  user_id: string;           // Penerima
  sender_id?: string | null; // Pengirim (null = System)
  
  // Kategori Modul (agar frontend bisa kasih icon yg sesuai)
  category: 'Asset' | 'Risk' | 'Maintenance' | 'Scenario' | 'System'; 
  
  title: string;             // Judul singkat (misal: "Aset Ditolak")
  message: string;           // Pesan detail
  notes?: string | null;     // Catatan tambahan (alasan reject, dll)
  
  type: 'info' | 'warning' | 'success' | 'error'; // Tipe visual (warna)
  link_target?: string | null; // URL tujuan saat diklik
  is_read: boolean;
  timestamp: string;
}

// src/modules/notification/notification.model.ts

export interface NotificationDetailResponse extends Notification {
  sender_name?: string; // Nama Petugas
  sender_role?: string; // Jabatan Petugas
  related_entity?: {    // Data tambahan dari objek yang dinotifikasi (Aset/Risk)
    name?: string;      // Nama Aset / Judul Risiko
    code?: string;      // Kode Aset (bmd_code/barcode)
    status?: string;    // Status terkini
  };
}

// DTO untuk input
export type CreateNotificationPayload = Omit<Notification, 'id' | 'timestamp' | 'is_read'>;