import { Router } from "express";
import { AuditController } from "./audit.controller.js";
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

router.get("/", authMiddleware, AuditController.getLogs);

export default router;