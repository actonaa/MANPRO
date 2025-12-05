import type {
  ImpactArea,
  CreateImpactAreaDto,
  UpdateImpactAreaDto,
} from './impact-area.model.js';
import { ImpactAreaRepository } from './impact-area.repository.js';

export class ImpactAreaService {
  static async getAll(): Promise<ImpactArea[]> {
    return ImpactAreaRepository.findAll();
  }
  static async getById(id: string): Promise<ImpactArea | null> {
    return ImpactAreaRepository.findById(id);
  }
  static async create(dto: CreateImpactAreaDto): Promise<ImpactArea> {
    return ImpactAreaRepository.create(dto);
  }
  static async update(id: string, dto: UpdateImpactAreaDto): Promise<ImpactArea | null> {
    return ImpactAreaRepository.update(id, dto);
  }
  static async delete(id: string): Promise<boolean> {
    return ImpactAreaRepository.delete(id);
  }
}