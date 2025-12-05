// Interface untuk tabel public.asset_categories
export interface AssetCategory {
  id: string; // uuid
  name: string;
}

// DTO untuk membuat
export interface CreateAssetCategoryDto {
  name: string;
}

// DTO untuk update
export interface UpdateAssetCategoryDto {
  name?: string;
}