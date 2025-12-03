import type {
  AssetCondition,
  CreateAssetConditionDto,
  UpdateAssetConditionDto,
} from './asset-condition.model.js';
import { AssetConditionRepository } from './asset-condition.repository.js';

export class AssetConditionService {
  
  static async getAll(): Promise<AssetCondition[]> {
    return AssetConditionRepository.findAll();
  }

  static async getById(id: string): Promise<AssetCondition | null> {
    return AssetConditionRepository.findById(id);
  }

  static async create(dto: CreateAssetConditionDto): Promise<AssetCondition> {
    return AssetConditionRepository.create(dto);
  }

  static async update(
    id: string,
    dto: UpdateAssetConditionDto,
  ): Promise<AssetCondition | null> {
    return AssetConditionRepository.update(id, dto);
  }

  static async delete(id: string): Promise<boolean> {
    return AssetConditionRepository.delete(id);
  }
}