export interface AssetStatus {
  id: string; // atau 'uuid' jika Anda menggunakan tipe spesifik
  name: string;
}

export interface CreateAssetStatusDto {
  name: string;
}

export interface UpdateAssetStatusDto {
  name?: string;
}