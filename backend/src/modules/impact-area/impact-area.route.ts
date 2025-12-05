import { Router } from 'express';
import { ImpactAreaController } from './impact-area.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { adminOnlyMiddleware } from '../../middleware/admin.middleware.js';

const router = Router();

// Rute publik (GET)
router.get('/', ImpactAreaController.getAllImpactAreas);
router.get('/:id', ImpactAreaController.getImpactAreaById);

// Rute admin (POST, PUT, DELETE)
router.post('/', authMiddleware, adminOnlyMiddleware, ImpactAreaController.createImpactArea);
router.put('/:id', authMiddleware, adminOnlyMiddleware, ImpactAreaController.updateImpactArea);
router.delete('/:id', authMiddleware, adminOnlyMiddleware, ImpactAreaController.deleteImpactArea);

export default router;