import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { RiskTreatmentController } from "./risk-treatment.controller.js";

const router = Router();

router.post("/:riskId/treatments", authMiddleware, RiskTreatmentController.add);
router.put("/treatments/:id", authMiddleware, RiskTreatmentController.update);


export default router;
