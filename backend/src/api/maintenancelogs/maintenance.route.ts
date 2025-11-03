import { Router } from "express";
import { MaintenanceController } from "./maintenance.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

// Jadwal baru
router.post("/assets/:assetId", authMiddleware, MaintenanceController.create);

// Lihat semua jadwal per aset
router.get("/assets/:assetId", authMiddleware, MaintenanceController.getByAsset);

// Update jadwal
router.put("/:id", authMiddleware, MaintenanceController.update);

// Tandai selesai
router.patch("/:id/complete", authMiddleware, MaintenanceController.complete);

// Hapus jadwal
router.delete("/:id", authMiddleware, MaintenanceController.delete);

export default router;
