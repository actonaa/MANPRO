export interface MaintenanceRiskData {
  id: string;
  title: string;
  entry_level: number;
  priority: string | null;
  status: string;
  risk_treatment: {
    id: string;
    action: string;
    strategy: string;
    target_date: string | null;
    status: string;
  }[];
}

// 2. Update Interface Asset yang menempel
export interface MaintenanceRelatedAsset {
  id: string;
  name: string;
  barcode: string;
  serial_number?: string | null;
  lokasi?: string | null;
  department_id: string; 
  
  // 🆕 Tambahan: Nama Department & Data Risiko
  department?: { name: string } | null;
  // risk?: MaintenanceRiskData[]; 
}

export interface MaintenanceLog {
  id: string;
  asset_id: string;
  risk_id: string;
  type: 'terjadwal' | 'insidental';
  scheduled_date: string;
  completion_date?: string | null;
  vendor?: string | null;
  cost?: number | null;
  proof?: string | null;
  notes?: string | null;
  priority: 'tinggi' | 'sedang' | 'rendah';
  status: 'dijadwalkan' | 'selesai' | 'pemeliharaan';
  created_at: string | null;
  updated_at:string | null;
  created_by?: string | null;
  updated_by?:string | null;
  asset?: MaintenanceRelatedAsset | null;
  risk?: {
    id: string;
    title: string;
    entry_level: number;
    priority: string;
    status: string;
    risk_treatment: {
    id: string;
    action: string;
    strategy: string;
    target_date: string | null;
    status: string;
  }[];
  } | null;
}

export type CreateMaintenanceDto = Pick<
  MaintenanceLog,
  'scheduled_date' | 'risk_id' | 'notes' | 'priority' 
>;

export type UpdateMaintenanceDto = Pick<
  MaintenanceLog,
  'scheduled_date' | 'risk_id' | 'notes' | 'priority'
>;

/**
 * DTO untuk MENYELESAIKAN jadwal (oleh Teknisi/User)
 * Ini adalah form "Realisasi" yang lengkap.
 */
export type CompleteMaintenanceDto = Pick<
  MaintenanceLog,
  'type' | 'completion_date' | 'notes' | 'vendor' | 'cost' | 'proof'
>;