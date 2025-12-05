// src/modules/risk-treatment/risk-treatment.model.ts

// Tipe ini mungkin sudah ada di risk.model.ts, 
// tapi kita definisikan di sini agar modul ini mandiri.
export interface RiskTreatment {
  id: string;
  risk_id: string;
  strategy: string | null;
  action: string | null;
  action_owner: string | null;
  target_date: string | Date | null;
  cost?: number | null;
  effectiveness?: string | null;
  new_probability?: number | null;
  new_impact_score?: number | null;
  residual_level?: number | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string | null;
  updated_at?: string | null;
}

// DTO untuk MEMBUAT treatment
// Pengguna tidak boleh mengisi ID, status, atau data audit
export type CreateTreatmentDto = Omit<
  RiskTreatment,
  | 'id'
  | 'created_by'
  | 'created_at'
  | 'updated_by'
  | 'updated_at'
  // 'risk_id' akan diambil dari body atau params, 
  // kita biarkan di sini agar bisa divalidasi
>;

// DTO untuk MENGUPDATE treatment
// Pengguna bisa mengupdate sebagian field
export type UpdateTreatmentDto = Partial<CreateTreatmentDto>;