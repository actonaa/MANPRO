import type {
  AssetStatus,
  CreateAssetStatusDto,
  UpdateAssetStatusDto,
} from './asset-status.model.js';
import { AssetStatusRepository } from './asset-status.repository.js';

export class AssetStatusService {
  static async getAll(): Promise<AssetStatus[]> {
    return AssetStatusRepository.findAll();
  }

  static async getById(id: string): Promise<AssetStatus | null> {
    return AssetStatusRepository.findById(id);
  }

  static async create(dto: CreateAssetStatusDto): Promise<AssetStatus> {
    // Di sini Anda bisa menambahkan logika bisnis
    // Contoh: Cek apakah nama status sudah ada
    // const existing = await AssetStatusRepository.findByName(dto.name);
    // if (existing) {
    //   throw new Error('Status dengan nama tersebut sudah ada.');
    // }
    return AssetStatusRepository.create(dto);
  }

  static async update(
    id: string,
    dto: UpdateAssetStatusDto,
  ): Promise<AssetStatus | null> {
    return AssetStatusRepository.update(id, dto);
  }

  static async delete(id: string): Promise<boolean> {
    // Di sini Anda bisa menambahkan logika bisnis
    // Contoh: Cek apakah status ini sedang dipakai oleh aset
    // const isInUse = await AssetRepository.checkIfStatusInUse(id); // (method ini harus dibuat di AssetRepository)
    // if (isInUse) {
    //   throw new Error('Status tidak bisa dihapus karena sedang digunakan.');
    // }
    return AssetStatusRepository.delete(id);
  }
}