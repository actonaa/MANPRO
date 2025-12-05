import type { Request, Response, NextFunction } from 'express';
import { ImpactAreaService } from './impact-area.service.js';
import type {
  CreateImpactAreaDto,
  UpdateImpactAreaDto,
} from './impact-area.model.js';

export class ImpactAreaController {
  
  static async getAllImpactAreas(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ImpactAreaService.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getImpactAreaById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Parameter 'id' wajib diisi." });

      const data = await ImpactAreaService.getById(id);
      if (!data) return res.status(404).json({ message: 'Impact area tidak ditemukan' });
      
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async createImpactArea(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateImpactAreaDto;
      if (!payload.name) return res.status(400).json({ message: "Payload 'name' wajib diisi." });

      const newData = await ImpactAreaService.create(payload);
      res.status(201).json({ message: 'Impact area berhasil dibuat', data: newData });
    } catch (error) {
      next(error);
    }
  }

  static async updateImpactArea(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Parameter 'id' wajib diisi." });
      
      const payload = req.body as UpdateImpactAreaDto;
      const updatedData = await ImpactAreaService.update(id, payload);
      
      if (!updatedData) return res.status(404).json({ message: 'Impact area tidak ditemukan' });
      
      res.status(200).json({ message: 'Impact area berhasil diperbarui', data: updatedData });
    } catch (error) {
      next(error);
    }
  }

  static async deleteImpactArea(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Parameter 'id' wajib diisi." });

      const success = await ImpactAreaService.delete(id);
      if (!success) return res.status(404).json({ message: 'Impact area tidak ditemukan' });
      
      res.status(200).json({ message: 'Impact area berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  }
}