// Interface untuk tabel public.asset_conditions
export interface AssetCondition {
  id: string; // uuid
  name: string;
}

// DTO untuk membuat
export interface CreateAssetConditionDto {
  name: string;
}

// DTO untuk update
export interface UpdateAssetConditionDto {
  name?: string;
}