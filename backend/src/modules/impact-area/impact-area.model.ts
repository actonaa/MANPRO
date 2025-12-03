// Interface untuk tabel public.impact_area
export interface ImpactArea {
  id: string; // uuid
  name: string;
}

// DTO untuk membuat
export interface CreateImpactAreaDto {
  name: string;
}

// DTO untuk update
export interface UpdateImpactAreaDto {
  name?: string;
}