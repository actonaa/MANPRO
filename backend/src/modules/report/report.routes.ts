import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { ReportController } from "./report.controller.js";

const router = Router();

router.use(authMiddleware);

// GET /api/reports/export/comprehensive
router.get("/export/comprehensive", ReportController.exportComprehensive);
router.get("/export/risks", ReportController.exportRisks);
router.get("/export/maintenance", ReportController.exportMaintenance);
router.get("/export/scenarios", ReportController.exportScenarios);
router.get("/export/audit-logs", ReportController.exportAuditLogs);
router.get("/export/assets", ReportController.exportAssets);
router.get("/export/deletions", ReportController.exportDeletions);
router.get("/export/incidents", ReportController.exportIncidents);
router.get("/export/rfc", ReportController.exportRFC);
router.get("/export/sdm", ReportController.exportHR);

export default router;