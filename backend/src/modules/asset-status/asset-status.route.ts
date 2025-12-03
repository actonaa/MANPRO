import { Router } from 'express';
import { AssetStatusController } from './asset-status.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { adminOnlyMiddleware } from '../../middleware/admin.middleware.js';

const router = Router();

// Endpoint ini bisa jadi publik (misal: untuk dropdown di frontend)
router.get('/', AssetStatusController.getAllStatuses);
router.get('/:id', AssetStatusController.getStatusById);

// Endpoint ini memerlukan otentikasi (admin-only)
router.post('/', authMiddleware, adminOnlyMiddleware, AssetStatusController.createStatus);
router.put('/:id', authMiddleware, adminOnlyMiddleware, AssetStatusController.updateStatus);
router.delete('/:id', authMiddleware, adminOnlyMiddleware, AssetStatusController.deleteStatus);

// Ekspor sebagai 'AssetStatusRouter' (atau 'default' jika Anda suka)
export default router;