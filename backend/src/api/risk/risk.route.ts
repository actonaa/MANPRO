import { Router } from 'express';
import { RiskController } from './risk.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

// Terapkan middleware keamanan pada rute ini
router.get('/', authMiddleware, RiskController.getAllRisks);
router.get('/:id', authMiddleware, RiskController.getRiskById);
router.post("/", authMiddleware, RiskController.createRisk);
router.put("/:id", authMiddleware, RiskController.updateRisk);
router.post("/with-treatments", authMiddleware, RiskController.createRiskWithTreatments);
router.put("/:id/with-treatments", authMiddleware, RiskController.updateRiskWithTreatments);
router.patch("/:id/verify", authMiddleware, RiskController.verifyRisk);
router.patch("/:id/approve", authMiddleware, RiskController.approveRisk);

export default router;