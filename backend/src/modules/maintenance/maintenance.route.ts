import { Router } from "express";
import { MaintenanceController } from "./maintenance.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { upload } from '../../middleware/upload.middleware.js';

const router = Router();

router.post("/:assetId", authMiddleware, MaintenanceController.create);
router.get("/", authMiddleware, MaintenanceController.getAll);
router.get("/assets/:assetId", authMiddleware, MaintenanceController.getByAsset);
router.get("/:id", authMiddleware, MaintenanceController.getById);
router.put("/:id", authMiddleware, MaintenanceController.update);
router.patch("/:id/complete", authMiddleware, upload.single('proof'), MaintenanceController.complete);
router.delete("/:id", authMiddleware, MaintenanceController.delete);

export default router;
