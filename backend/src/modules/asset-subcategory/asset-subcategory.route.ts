import { Router } from 'express';
import { AssetSubCategoryController } from './asset-subcategory.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { adminOnlyMiddleware } from '../../middleware/admin.middleware.js';

const router = Router();

// Rute publik untuk GET
// Ini akan menangani /asset-subcategories DAN /asset-subcategories?categoryId=...
router.get('/', AssetSubCategoryController.getAllSubCategories);
router.get('/:id', AssetSubCategoryController.getSubCategoryById);

// Rute terproteksi
router.post('/', authMiddleware, adminOnlyMiddleware, AssetSubCategoryController.createSubCategory);
router.put('/:id', authMiddleware, adminOnlyMiddleware, AssetSubCategoryController.updateSubCategory);
router.delete('/:id', authMiddleware, adminOnlyMiddleware, AssetSubCategoryController.deleteSubCategory);

export default router;