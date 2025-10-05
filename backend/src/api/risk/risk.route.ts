import { Router } from 'express';
import { RiskController } from './risk.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

// Terapkan middleware keamanan pada rute ini
router.get('/', authMiddleware, RiskController.getAllRisks);

export default router;