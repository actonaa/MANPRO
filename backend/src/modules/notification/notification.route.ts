// src/modules/notification/notification.routes.ts
import { Router } from "express";
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { NotificationController } from "./notification.controller.js";

const router = Router();

// Semua rute butuh login
router.use(authMiddleware);

// Ambil notifikasi saya
router.get("/", NotificationController.getMine);
router.delete("/clear-all", NotificationController.deleteAll);
router.get("/:id", NotificationController.getById);
// Tandai satu sudah baca
router.patch("/:id/read", NotificationController.markRead);
// 4. Hapus SATU Notifikasi
router.delete("/:id", NotificationController.delete);
// Tandai semua sudah baca
router.patch("/read-all", NotificationController.markAllRead);

export default router;