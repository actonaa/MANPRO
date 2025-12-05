import type { Request, Response, NextFunction } from "express";
import { ReportService } from "./report.service.js";
import type { ReportFilterDto } from "./report.model.js";

export class ReportController {

  // Helper Private untuk mengirim response Excel
  private static async sendExcel(res: Response, workbook: any, fileName: string) {
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}_${Date.now()}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  }

  static async exportComprehensive(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ message: "Auth required" });

      // Ambil filter
      const filters: ReportFilterDto = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        department_id: req.query.department_id as string,
        format: 'excel'
      };

      // (Opsional) Validasi: Jika user bukan admin, paksa filter department_id milik user sendiri
      // if (!isAdmin(req.user)) { ... }

      const workbook = await ReportService.generateComprehensiveExcel(filters);

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename=Laporan_Lengkap_${Date.now()}.xlsx`);

      await workbook.xlsx.write(res);
      res.end();

    } catch (error) {
      next(error);
    }
  }

  static async exportRisks(req: Request, res: Response, next: NextFunction) {
    try {
      const workbook = await ReportService.generateRiskExcel();
      await ReportController.sendExcel(res, workbook, "Laporan_Risiko");
    } catch (error) { next(error); }
  }

  static async exportMaintenance(req: Request, res: Response, next: NextFunction) {
    try {
      const workbook = await ReportService.generateMaintenanceExcel();
      await ReportController.sendExcel(res, workbook, "Laporan_Maintenance");
    } catch (error) { next(error); }
  }

  static async exportScenarios(req: Request, res: Response, next: NextFunction) {
    try {
      const workbook = await ReportService.generateScenarioExcel();
      await ReportController.sendExcel(res, workbook, "Laporan_Skenario");
    } catch (error) { next(error); }
  }

  static async exportAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      // Cek Auth: Hanya Admin/Auditor
      if (req.user?.role_name !== 'admin_diskominfo' && req.user?.role_name !== 'auditor') {
          return res.status(403).json({ message: "Akses ditolak." });
      }
      const workbook = await ReportService.generateAuditExcel();
      await ReportController.sendExcel(res, workbook, "Laporan_Audit_System");
    } catch (error) { next(error); }
  }

  static async exportAssets(req: Request, res: Response, next: NextFunction) {
    try {
      const workbook = await ReportService.generateAssetExcel();
      await ReportController.sendExcel(res, workbook, "Laporan_Inventory_Aset");
    } catch (error) { next(error); }
  }

  static async exportDeletions(req: Request, res: Response, next: NextFunction) {
    try {
      const workbook = await ReportService.generateDeletionExcel();
      await ReportController.sendExcel(res, workbook, "Laporan_Penghapusan_Aset");
    } catch (error) { next(error); }
  }

  static async exportIncidents(req: Request, res: Response, next: NextFunction) {
    try {
      const workbook = await ReportService.generateIncidentExcel();
      await ReportController.sendExcel(res, workbook, "Laporan_Insiden_Aset");
    } catch (error) { next(error); }
  }

  static async exportRFC(req: Request, res: Response, next: NextFunction) {
    try {
      const workbook = await ReportService.generateRFCExcel();
      await ReportController.sendExcel(res, workbook, "Laporan_RFC_Aset");
    } catch (error) { next(error); }
  }

  static async exportHR(req: Request, res: Response, next: NextFunction) {
    try {
      // Cek Izin Khusus jika perlu (misal hanya admin)
      const workbook = await ReportService.generateHRExcel();
      await ReportController.sendExcel(res, workbook, "Laporan_SDM");
    } catch (error) { next(error); }
  }
}