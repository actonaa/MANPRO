import { Router } from 'express';
import { RiskCategoryController } from './risk-category.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { adminOnlyMiddleware } from '../../middleware/admin.middleware.js';

const router = Router();

// Rute publik (GET)
router.get('/', RiskCategoryController.getAllRiskCategories);
router.get('/:id', RiskCategoryController.getRiskCategoryById);

// Rute admin (POST, PUT, DELETE)
router.post('/', authMiddleware, adminOnlyMiddleware, RiskCategoryController.createRiskCategory);
router.put('/:id', authMiddleware, adminOnlyMiddleware, RiskCategoryController.updateRiskCategory);
router.delete('/:id', authMiddleware, adminOnlyMiddleware, RiskCategoryController.deleteRiskCategory);

export default router;