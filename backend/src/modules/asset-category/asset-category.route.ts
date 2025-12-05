import { Router } from 'express';
import { AssetCategoryController } from './asset-category.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { adminOnlyMiddleware } from '../../middleware/admin.middleware.js';

const router = Router();

// Rute publik untuk GET
router.get('/', AssetCategoryController.getAllCategories);
router.get('/:id', AssetCategoryController.getCategoryById);

// Rute terproteksi untuk C, U, D
router.post('/', authMiddleware, adminOnlyMiddleware, AssetCategoryController.createCategory);
router.put('/:id', authMiddleware, adminOnlyMiddleware, AssetCategoryController.updateCategory);
router.delete('/:id', authMiddleware, adminOnlyMiddleware, AssetCategoryController.deleteCategory);

export default router;