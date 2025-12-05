// Interface untuk tabel public.risk_category
export interface RiskCategory {
  id: string; // uuid
  name: string;
}

// DTO untuk membuat
export interface CreateRiskCategoryDto {
  name: string;
}

// DTO untuk update
export interface UpdateRiskCategoryDto {
  name?: string;
}