import { Router } from 'express';
import { AssetController } from './asset.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

// Terapkan middleware keamanan pada rute ini
router.get('/', authMiddleware, AssetController.getAllAssets);
router.get('/barcode/:barcode', authMiddleware, AssetController.getAssetByBarcode);
router.get('/:id', authMiddleware, AssetController.getAssetById);
router.post('/', authMiddleware, AssetController.createAsset);
router.put('/:id', authMiddleware, AssetController.updateAsset);
router.patch('/:id/request-delete', authMiddleware, AssetController.requestDeleteAsset);
router.patch("/:id/verify", authMiddleware, AssetController.verifyAsset);

export default router;