import type { Request, Response, NextFunction } from 'express';
import { RiskCategoryService } from './risk-category.service.js';
import type {
  CreateRiskCategoryDto,
  UpdateRiskCategoryDto,
} from './risk-category.model.js';

export class RiskCategoryController {
  
  static async getAllRiskCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await RiskCategoryService.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getRiskCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Parameter 'id' wajib diisi." });

      const data = await RiskCategoryService.getById(id);
      if (!data) return res.status(404).json({ message: 'Kategori risiko tidak ditemukan' });
      
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async createRiskCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateRiskCategoryDto;
      if (!payload.name) return res.status(400).json({ message: "Payload 'name' wajib diisi." });

      const newData = await RiskCategoryService.create(payload);
      res.status(201).json({ message: 'Kategori risiko berhasil dibuat', data: newData });
    } catch (error) {
      next(error);
    }
  }

  static async updateRiskCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Parameter 'id' wajib diisi." });
      
      const payload = req.body as UpdateRiskCategoryDto;
      const updatedData = await RiskCategoryService.update(id, payload);
      
      if (!updatedData) return res.status(404).json({ message: 'Kategori risiko tidak ditemukan' });
      
      res.status(200).json({ message: 'Kategori risiko berhasil diperbarui', data: updatedData });
    } catch (error) {
      next(error);
    }
  }

  static async deleteRiskCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Parameter 'id' wajib diisi." });

      const success = await RiskCategoryService.delete(id);
      if (!success) return res.status(404).json({ message: 'Kategori risiko tidak ditemukan' });
      
      res.status(200).json({ message: 'Kategori risiko berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  }
}