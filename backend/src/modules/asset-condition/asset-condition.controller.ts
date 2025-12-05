import type { Request, Response, NextFunction } from 'express';
import { AssetConditionService } from './asset-condition.service.js';
import type {
  CreateAssetConditionDto,
  UpdateAssetConditionDto,
} from './asset-condition.model.js';

export class AssetConditionController {
  
  static async getAllConditions(req: Request, res: Response, next: NextFunction) {
    try {
      const conditions = await AssetConditionService.getAll();
      res.status(200).json(conditions);
    } catch (error) {
      next(error);
    }
  }

  static async getConditionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' kondisi wajib diisi." });
      }

      const condition = await AssetConditionService.getById(id);
      if (!condition) {
        return res.status(404).json({ message: 'Kondisi tidak ditemukan' });
      }
      res.status(200).json(condition);
    } catch (error) {
      next(error);
    }
  }

  static async createCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateAssetConditionDto;
      if (!payload.name) {
        return res.status(400).json({ message: "Payload 'name' wajib diisi." });
      }

      const newCondition = await AssetConditionService.create(payload);
      res.status(201).json({ message: 'Kondisi berhasil dibuat', data: newCondition });
    } catch (error) {
      next(error);
    }
  }

  static async updateCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const payload = req.body as UpdateAssetConditionDto;

      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' kondisi wajib diisi." });
      }
      
      const updatedCondition = await AssetConditionService.update(id, payload);
      if (!updatedCondition) {
        return res.status(404).json({ message: 'Kondisi tidak ditemukan' });
      }
      
      res.status(200).json({ message: 'Kondisi berhasil diperbarui', data: updatedCondition });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' kondisi wajib diisi." });
      }

      const success = await AssetConditionService.delete(id);
      if (!success) {
        return res.status(404).json({ message: 'Kondisi tidak ditemukan' });
      }
      
      res.status(200).json({ message: 'Kondisi berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  }
}