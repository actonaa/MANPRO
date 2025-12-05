import type { Request, Response, NextFunction } from 'express';
import { AssetStatusService } from './asset-status.service.js';
import type {
  CreateAssetStatusDto,
  UpdateAssetStatusDto,
} from './asset-status.model.js';

export class AssetStatusController {
  
  static async getAllStatuses(req: Request, res: Response, next: NextFunction) {
    try {
      const statuses = await AssetStatusService.getAll();
      res.status(200).json(statuses);
    } catch (error) {
      next(error);
    }
  }

  static async getStatusById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // 💡 VALIDASI DI SINI
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' status wajib diisi." });
      }

      // ✅ 'id' di sini dijamin string
      const status = await AssetStatusService.getById(id);
      if (!status) {
        return res.status(404).json({ message: 'Status tidak ditemukan' });
      }
      res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  }

  static async createStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateAssetStatusDto;
      
      if (!payload.name) {
        return res.status(400).json({ message: "Payload 'name' wajib diisi." });
      }

      const newStatus = await AssetStatusService.create(payload);
      res
        .status(201)
        .json({ message: 'Status berhasil dibuat', data: newStatus });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const payload = req.body as UpdateAssetStatusDto;

      // 💡 VALIDASI DI SINI
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' status wajib diisi." });
      }
      
      // ✅ 'id' di sini dijamin string
      const updatedStatus = await AssetStatusService.update(id, payload);
      if (!updatedStatus) {
        return res.status(404).json({ message: 'Status tidak ditemukan' });
      }
      
      res
        .status(200)
        .json({ message: 'Status berhasil diperbarui', data: updatedStatus });
    } catch (error) {
      next(error);
    }
  }

  static async deleteStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // 💡 VALIDASI DI SINI
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' status wajib diisi." });
      }

      // ✅ 'id' di sini dijamin string
      const success = await AssetStatusService.delete(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Status tidak ditemukan' });
      }
      
      res.status(200).json({ message: 'Status berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  }
}