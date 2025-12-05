import type {
  RiskCategory,
  CreateRiskCategoryDto,
  UpdateRiskCategoryDto,
} from './risk-category.model.js';
import { RiskCategoryRepository } from './risk-category.repository.js';

export class RiskCategoryService {
  static async getAll(): Promise<RiskCategory[]> {
    return RiskCategoryRepository.findAll();
  }
  static async getById(id: string): Promise<RiskCategory | null> {
    return RiskCategoryRepository.findById(id);
  }
  static async create(dto: CreateRiskCategoryDto): Promise<RiskCategory> {
    return RiskCategoryRepository.create(dto);
  }
  static async update(id: string, dto: UpdateRiskCategoryDto): Promise<RiskCategory | null> {
    return RiskCategoryRepository.update(id, dto);
  }
  static async delete(id: string): Promise<boolean> {
    return RiskCategoryRepository.delete(id);
  }
}