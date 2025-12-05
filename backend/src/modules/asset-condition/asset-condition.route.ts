import { Router } from 'express';
import { AssetConditionController } from './asset-condition.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { adminOnlyMiddleware } from '../../middleware/admin.middleware.js';

const router = Router();

// Rute publik untuk GET (siapa saja boleh lihat)
router.get('/', AssetConditionController.getAllConditions);
router.get('/:id', AssetConditionController.getConditionById);

// Rute terproteksi (hanya admin boleh C, U, D)
router.post(
  '/', 
  authMiddleware, 
  adminOnlyMiddleware, 
  AssetConditionController.createCondition
);
router.put(
  '/:id', 
  authMiddleware, 
  adminOnlyMiddleware, 
  AssetConditionController.updateCondition
);
router.delete(
  '/:id', 
  authMiddleware, 
  adminOnlyMiddleware, 
  AssetConditionController.deleteCondition
);

export default router;