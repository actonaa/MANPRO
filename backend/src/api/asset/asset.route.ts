import { Router } from 'express';
import { AssetController } from './asset.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

// Terapkan middleware keamanan pada rute ini
router.get('/', authMiddleware, AssetController.getAllAssets);

export default router;