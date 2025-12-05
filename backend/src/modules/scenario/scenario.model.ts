// Tipe untuk data join
interface RelatedPosition {
  name: string;
}
interface RelatedAsset {
  id: string;
  name: string;
}

// Tipe utama Skenario (sesuai VIEW 'scenarios_detailed')
export interface Scenario {
  id: string;
  name: string;
  description: string | null;
  owner_position_id: string | null;
  created_by: string | null;
  updated_by:string | null;

  // Properti dari JOIN
  owner_position?: RelatedPosition | null;
  assets?: RelatedAsset[]; // 👈 Array aset (dari M2M)
}

// DTO untuk MEMBUAT Skenario
// (Cocok dengan argumen fungsi SQL 'create_scenario_with_assets')
export type CreateScenarioDto = {
  name: string;
  description?: string | null;
  owner_position_id: string | null;
  asset_ids: string[]; // 👈 Array ID aset
};

// DTO untuk MENGUPDATE Skenario
export type UpdateScenarioDto = Partial<CreateScenarioDto>;