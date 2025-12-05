import type { Request, Response, NextFunction } from 'express';
import { AssetSubCategoryService } from './asset-subcategory.service.js';
import type {
  CreateAssetSubCategoryDto,
  UpdateAssetSubCategoryDto,
} from './asset-subcategory.model.js';

export class AssetSubCategoryController {
  
  static async getAllSubCategories(req: Request, res: Response, next: NextFunction) {
    try {
      // Cek query parameter ?categoryId=...
      const { categoryId } = req.query;
      
      const categories = await AssetSubCategoryService.getAll(categoryId as string | undefined);
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  static async getSubCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' sub-kategori wajib diisi." });
      }

      const category = await AssetSubCategoryService.getById(id);
      if (!category) {
        return res.status(404).json({ message: 'Sub-kategori tidak ditemukan' });
      }
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  static async createSubCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateAssetSubCategoryDto;
      if (!payload.name || !payload.category_id) {
        return res.status(400).json({ message: "Payload 'name' dan 'category_id' wajib diisi." });
      }

      const newSubCategory = await AssetSubCategoryService.create(payload);
      res.status(201).json({ message: 'Sub-kategori berhasil dibuat', data: newSubCategory });
    } catch (error) {
      next(error);
    }
  }

  static async updateSubCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const payload = req.body as UpdateAssetSubCategoryDto;

      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' sub-kategori wajib diisi." });
      }
      
      const updatedSubCategory = await AssetSubCategoryService.update(id, payload);
      if (!updatedSubCategory) {
        return res.status(404).json({ message: 'Sub-kategori tidak ditemukan' });
      }
      
      res.status(200).json({ message: 'Sub-kategori berhasil diperbarui', data: updatedSubCategory });
    } catch (error) {
      next(error);
    }
  }

  static async deleteSubCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' sub-kategori wajib diisi." });
      }

      const success = await AssetSubCategoryService.delete(id);
      if (!success) {
        return res.status(404).json({ message: 'Sub-kategori tidak ditemukan' });
      }
      
      res.status(200).json({ message: 'Sub-kategori berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  }
}