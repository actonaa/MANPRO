import { Router } from "express";
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { ScenarioController } from "./scenario.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", ScenarioController.create);
router.get("/", ScenarioController.getAll);
router.get("/:id", ScenarioController.getById);
router.put("/:id", ScenarioController.update);
router.delete("/:id", ScenarioController.delete);

export default router;