import type {
  CreateAssetSubCategoryDto,
  UpdateAssetSubCategoryDto,
  EnrichedAssetSubCategory,
} from './asset-subcategory.model.js';
import { AssetSubCategoryRepository } from './asset-subcategory.repository.js';

export class AssetSubCategoryService {
  
  static async getAll(categoryId?: string): Promise<EnrichedAssetSubCategory[]> {
    if (categoryId) {
      return AssetSubCategoryRepository.findAllByCategoryId(categoryId);
    }
    return AssetSubCategoryRepository.findAll();
  }

  static async getById(id: string): Promise<EnrichedAssetSubCategory | null> {
    return AssetSubCategoryRepository.findById(id);
  }

  static async create(dto: CreateAssetSubCategoryDto): Promise<EnrichedAssetSubCategory> {
    return AssetSubCategoryRepository.create(dto);
  }

  static async update(
    id: string,
    dto: UpdateAssetSubCategoryDto,
  ): Promise<EnrichedAssetSubCategory | null> {
    return AssetSubCategoryRepository.update(id, dto);
  }

  static async delete(id: string): Promise<boolean> {
    return AssetSubCategoryRepository.delete(id);
  }
}