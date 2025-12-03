interface RelatedName {
  name: string;
}

// Tipe utama untuk Aset Anda
export interface Asset {
  id: string;
  name: string;
  barcode: string;
  barcode_128_url: string;
  barcode_qr_url: string;
  serial_number?: string;
  lokasi?: string | null;
  merk_type?: string | null;
  vendor?: string | null;
  hostname?: string | null;
  os?: string | null;
  ip_address?: string | null;
  version?: string | null;
  approval_status: 'pending' | 'approved' | 'rejected' | 'pending_delete' | 'verified_delete' | 'approved_delete';
  revision_notes?: string | null;
  pic?: string | null;
  acquisition_date?: string | Date | null;
  acquisition_value?: number | null;
  attachments?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  bmd_code?: string | null;
  deploy_date?: string | Date | null;
  material?: string | null;
  specification?: string | null;
  linked_change_id?: string | null;
  linked_incident_id?: string | null;
  parent_id?: string | null;
  department_id: string | null;
  division_id?: string | null;
  section_id?: string | null;
  status_id: string | null;
  category_id: string | null;
  sub_category_id: string | null;
  condition_id: string | null;

  // Properti dari join 'baseSelect'
  parent?: RelatedName[];
  category?: RelatedName[];
  sub_category?: RelatedName[];
  status?: RelatedName[];
  condition?: RelatedName[];
  department?: RelatedName[];
  division?: RelatedName[];
  section?: RelatedName[];
}

export interface pubclicAsset {
  id: string;
  name: string;
  barcode: string;
  serial_number?: string;
  lokasi?: string;
  merk_type?: string;
  vendor?: string;
  hostname?: string;
  os?: string;
  ip_address?: string;
  version?: string;
  pic?: string | null;
  bmd_code?: string | null;
  deploy_date?: string | Date | null;
  material?: string | null;
  specification?: string | null;
  parent_id?: string | null;
  department_id: string | null;
  division_id?: string | null;
  section_id?: string | null;
  status_id: string | null;
  category_id: string | null;
  sub_category_id: string | null;
  condition_id: string | null;

  // Properti dari join 'baseSelect'
  parent?: RelatedName[];
  category?: RelatedName[];
  sub_category?: RelatedName[];
  status?: RelatedName[];
  condition?: RelatedName[];
  department?: RelatedName[];
  division?: RelatedName[];
  section?: RelatedName[];
}


// Tipe untuk data yang dibuat (Create Asset)
// Ini bisa lebih sederhana karena banyak bidang diisi oleh service
export type CreateAssetDto = Omit<
  Asset, 
  | 'id' 
  | 'created_at'
  | 'updated_at'
  | 'barcode' 
  | 'barcode_128_url' 
  | 'barcode_qr_url' 
  | 'approval_status' 
  | 'parent'
  | 'category' 
  | 'sub_category'
  | 'status'
  | 'condition'
  | 'department'
  | 'division'
  | 'section'
>;

// Tipe untuk data yang diupdate
export type UpdateAssetDto = Partial<CreateAssetDto>;

export type LinkChangeDto = {
  linked_change_id: string; // Wajib
  status_id: string;          // Wajib
  notes?: string;
};

export type LinkIncidentDto = {
  linked_incident_id: string; // Wajib
  status_id: string;          // Wajib
  notes?: string;
};

export type BulkLinkChangeDto = {
  asset_ids: string[]; // Array UUID aset
  linked_change_id: string | null;
  notes?: string | null;
  // status_id tidak perlu di body, karena akan diambil dari URL param
};

// Konstanta Status UUID (Agar mudah dikelola)
export const ASSET_STATUS = {
  STANDBY: "283f3f87-c2aa-402c-8f23-a514a8502b86",
  IN_USE: "5f0dbc82-025a-4897-b871-b238679727bd",
  RETIRED: "7107c5b6-5e38-4288-9357-fb445baa1878",
  MAINTENANCE: "9ac09a40-f161-4181-a11c-b25beed5f4c0"
};

export interface MaintenancePlanningData {
  id: string;
  name: string;
  location: string | null; // Karena di repo Anda meng-alias 'location:lokasi'
  department: {
    name: string;
  } | null;
  risk: {
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
  }[];
}