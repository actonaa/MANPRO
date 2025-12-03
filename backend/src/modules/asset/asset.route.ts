import { Router } from 'express';
import { AssetController } from './asset.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';

const router = Router();

// ✅ Route publik (tanpa auth)
router.get('/public', AssetController.getAllPublic);
router.get('/public/:id', AssetController.getPublicById);
router.get('/public/barcode/:barcode', AssetController.getPublicAssetByBarcode);
router.patch(
  "/:id/link-incident-public", 
  AssetController.linkIncidentPublic 
);


// Terapkan middleware keamanan pada rute ini
router.get('/', authMiddleware, AssetController.getAllAssets);
router.get('/barcode/:barcode', authMiddleware, AssetController.getAssetByBarcode);
router.patch("/change-status/:statusKey", authMiddleware, AssetController.bulkLinkChange);
router.get('/:id', authMiddleware, AssetController.getAssetById);
router.post('/', authMiddleware, upload.single('file'), AssetController.createAsset);
router.put('/:id', authMiddleware, upload.single('file'), AssetController.updateAsset);
router.patch('/:id/request-delete', authMiddleware, AssetController.requestDeleteAsset);
router.patch('/:id/verify-delete', authMiddleware, AssetController.verifyDeleteAsset);
router.patch('/:id/approve-delete', authMiddleware, AssetController.approveDeleteAsset);
router.patch("/:id/verify", authMiddleware, AssetController.verifyAsset);
router.patch(
  "/:id/link-change",
  authMiddleware, AssetController.linkChange
);
router.patch(
  "/:id/link-incident",
  authMiddleware, AssetController.linkIncident
);
router.get("/:id/planning-data", authMiddleware, AssetController.getPlanningData);



export default router;