import type {
  AssetCategory,
  CreateAssetCategoryDto,
  UpdateAssetCategoryDto,
} from './asset-category.model.js';
import { AssetCategoryRepository } from './asset-category.repository.js';

export class AssetCategoryService {
  
  static async getAll(): Promise<AssetCategory[]> {
    return AssetCategoryRepository.findAll();
  }

  static async getById(id: string): Promise<AssetCategory | null> {
    return AssetCategoryRepository.findById(id);
  }

  static async create(dto: CreateAssetCategoryDto): Promise<AssetCategory> {
    // Anda bisa tambahkan validasi nama duplikat di sini jika perlu
    return AssetCategoryRepository.create(dto);
  }

  static async update(
    id: string,
    dto: UpdateAssetCategoryDto,
  ): Promise<AssetCategory | null> {
    return AssetCategoryRepository.update(id, dto);
  }

  static async delete(id: string): Promise<boolean> {
    // Logika repository sudah menangani pengecekan 'in-use' via error FK
    return AssetCategoryRepository.delete(id);
  }
}