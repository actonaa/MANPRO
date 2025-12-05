import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { RiskTreatmentController } from "./risk-treatment.controller.js";

const router = Router();

router.get("/", authMiddleware, RiskTreatmentController.findAllForRisk);
router.post("/", authMiddleware, RiskTreatmentController.add); 
router.put("/:id", authMiddleware, RiskTreatmentController.update); 


export default router;
