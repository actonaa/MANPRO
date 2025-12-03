// src/modules/audit-finding/audit-finding.routes.ts
import { Router } from "express";
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';
import { AuditFindingController } from "./audit-finding.controller.js";

const router = Router();
router.use(authMiddleware);

// 1. Manajemen Laporan (File)
router.post("/reports", upload.single('file'), AuditFindingController.uploadReport);
router.get("/reports", AuditFindingController.getReports);

// 2. Manajemen Temuan (Komentar)
router.post("/findings", AuditFindingController.addFinding);
// Contoh: GET /api/audit/findings/asset/uuid-aset-123
router.get("/findings/:type/:entityId", AuditFindingController.getEntityFindings); 
router.patch("/findings/:id/resolve", AuditFindingController.resolveFinding);

export default router;