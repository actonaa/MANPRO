import type { Request, Response, NextFunction } from 'express';
import { AssetCategoryService } from './asset-category.service.js';
import type {
  CreateAssetCategoryDto,
  UpdateAssetCategoryDto,
} from './asset-category.model.js';

export class AssetCategoryController {
  
  static async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await AssetCategoryService.getAll();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' kategori wajib diisi." });
      }

      const category = await AssetCategoryService.getById(id);
      if (!category) {
        return res.status(404).json({ message: 'Kategori tidak ditemukan' });
      }
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateAssetCategoryDto;
      if (!payload.name) {
        return res.status(400).json({ message: "Payload 'name' wajib diisi." });
      }

      const newCategory = await AssetCategoryService.create(payload);
      res.status(201).json({ message: 'Kategori berhasil dibuat', data: newCategory });
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const payload = req.body as UpdateAssetCategoryDto;

      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' kategori wajib diisi." });
      }
      
      const updatedCategory = await AssetCategoryService.update(id, payload);
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Kategori tidak ditemukan' });
      }
      
      res.status(200).json({ message: 'Kategori berhasil diperbarui', data: updatedCategory });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' kategori wajib diisi." });
      }

      const success = await AssetCategoryService.delete(id);
      if (!success) {
        return res.status(404).json({ message: 'Kategori tidak ditemukan' });
      }
      
      res.status(200).json({ message: 'Kategori berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  }
}