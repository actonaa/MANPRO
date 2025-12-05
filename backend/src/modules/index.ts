import { Router } from 'express';
import assetRoutes from './asset/asset.route.js';
import riskRoutes from './risk/risk.route.js';
import maintenanceRoutes from './maintenance/maintenance.route.js';
import treatmentRoutes from './risk-treatment/risk-treatment.route.js';
import assetStatusRoutes from './asset-status/asset-status.route.js';
import assetCategoriesRoutes from './asset-category/asset-category.route.js';
import assetSubCategoryRoutes from './asset-subcategory/asset-subcategory.route.js';
import assetConditionRoutes from './asset-condition/asset-condition.route.js';
import impactAreaRoutes from './impact-area/impact-area.route.js';
import riskCategoriesRoutes from './risk-category/risk-category.route.js';
import scenarioRoutes from './scenario/scenario.route.js';
import auditLogRoutes from './audit/audit.route.js';
import notifRoutes from './notification/notification.route.js';
import auditRoutes from './audit-finding/audit-finding.routes.js';
import reportRoutes from './report/report.routes.js';

const router = Router();

router.use('/assets', assetRoutes);
router.use('/risks', riskRoutes);
router.use('/risk-treatments', treatmentRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/asset-statuses', assetStatusRoutes);
router.use('/asset-categories', assetCategoriesRoutes);
router.use('/asset-subcategories', assetSubCategoryRoutes);
router.use('/asset-conditions', assetConditionRoutes);
router.use('/impact-area', impactAreaRoutes);
router.use('/risk-categories', riskCategoriesRoutes);
router.use('/scenarios', scenarioRoutes);
router.use('/audit-logs', auditLogRoutes);
router.use('/notifications', notifRoutes);
router.use('/audit', auditRoutes);
router.use('/reports', reportRoutes);


export default router;