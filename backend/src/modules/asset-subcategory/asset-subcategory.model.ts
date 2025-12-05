// Interface untuk tabel public.asset_subcategories
export interface AssetSubCategory {
  id: string; // uuid
  name: string;
  description: string | null;
  category_id: string; // uuid
}

// Interface untuk data yang "diperkaya" (dengan nama kategori)
export interface EnrichedAssetSubCategory extends AssetSubCategory {
  asset_categories: {
    id: string;
    name: string;
  } | null;
}

// DTO untuk membuat
export interface CreateAssetSubCategoryDto {
  name: string;
  category_id: string;
  description?: string;
}

// DTO untuk update
export interface UpdateAssetSubCategoryDto {
  name?: string;
  category_id?: string;
  description?: string;
}