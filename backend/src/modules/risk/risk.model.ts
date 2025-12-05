// Tipe untuk relasi (data yang di-join)
interface RelatedAsset {
  name: string;
  lokasi: string;
}
interface RelatedDepartment {
  name: string;
}
// 🆕 Tambahan join untuk logika baru
interface RelatedImpactArea {
  name: string;
}
interface RelatedRiskCategory {
  name: string;
}

// Tipe utama untuk Risk Treatment (Sudah dikoreksi)
export interface RiskTreatment {
  id: string;
  risk_id: string;
  strategy: 'accept' | 'avoid' | 'reduce' | 'transfer';
  action: string | null;
  action_owner: string | null;
  target_date: string | null; // Tipe Date/string
  cost?: number | null;
  effectiveness?: string | null;
  new_probability?: number | null;
  new_impact_score?: number | null;
  residual_level?: number | null;
  // ❗️ 'created_by' & 'updated_by' DIHAPUS (tidak ada di skema DB)
  created_at: string | null;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  approved_by?: string | null; 
  approved_at?: string | null;
}

// Tipe utama untuk Risk (Sudah dikoreksi)
export interface Risk {
  id: string;
  asset_id: string;
  approval_status: 'draft' | 'pending' | 'approved' | 'rejected';
  revision_notes?: string | null;
  created_at: string | null;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  approved_by?: string | null; 
  approved_at?: string | null;
  
  // --- ⬇️ Kolom dari SQL yang Hilang ---
  type: string | null;
  title: string | null;
  description: string | null;
  cause: string | null;
  impact: string | null;
  scenario_id: string | null;
  probability: number ;
  impact_score: number;
  criteria: string | null;
  priority: string | null;
  status: 'new' | 'planned' | 'in_progress' | 'completed' | 'on_hold';
  risk_category_id: string | null; 
  impact_area_id: string | null;   
  
  // --- ⬇️ Kolom Kalkulasi ---
  entry_level: number;
  type_of_risk: 'positif' | 'negatif'; // 👈 Logika bisnis baru

  // --- ❗️ Kolom SALAH Dihapus ---
  // 'department_id' tidak ada di tabel risk (didapat dari asset)
  // 'created_by', 'updated_by', 'approved_by', 'approved_at' tidak ada di tabel risk

  // --- ⬇️ Properti dari Join (View) ---
  asset?: RelatedAsset | null;
  department?: RelatedDepartment | null; // 👈 Didapat dari join asset
  risk_category?: RelatedRiskCategory | null; // 👈 Join baru
  impact_area?: RelatedImpactArea | null;     // 👈 Join baru
}

// === DTO (Data Transfer Objects) ===

// DTO untuk membuat RiskTreatment (sudah benar)
export type CreateTreatmentDto = Omit<
  RiskTreatment, 
  | 'id' 
  | 'risk_id' 
  | 'residual_level' 
  | 'status' 
  | 'created_at' 
  | 'updated_at'
>;

// DTO untuk membuat Risk (Sudah dikoreksi)
export type CreateRiskDto = Omit<
  Risk,
  // Kolom yang diatur server/database
  | 'id'
  | 'approval_status'
  | 'created_at'
  | 'updated_at'
  | 'status'
  // Kolom kalkulasi
  | 'entry_level'
  //| 'type_of_risk'
  // Properti Join (read-only)
  | 'asset'
  | 'department'
  | 'risk_category'
  | 'impact_area'
>;

// DTO untuk update Risk
export type UpdateRiskDto = Partial<CreateRiskDto>;

// DTO untuk update Treatment
export type UpdateTreatmentDto = Partial<CreateTreatmentDto> & { id?: string };

// DTO untuk payload gabungan
export interface RiskWithTreatmentsPayload {
  risk: CreateRiskDto | UpdateRiskDto;
  treatments: (CreateTreatmentDto | UpdateTreatmentDto)[];
}