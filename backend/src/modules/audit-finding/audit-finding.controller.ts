// src/modules/audit-finding/audit-finding.controller.ts
import type { Request, Response, NextFunction } from "express";
import { AuditFindingService } from "./audit-finding.service.js";

export class AuditFindingController {

  // Laporan
  static async uploadReport(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ message: "Auth required" });
      const data = await AuditFindingService.uploadReport(req.body, req.user, req.file!);
      res.status(201).json({ message: "Laporan berhasil diunggah", data });
    } catch (error) { next(error); }
  }

  static async getReports(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ message: "Auth required" });
      const data = await AuditFindingService.getAllReports(req.user);
      res.json(data);
    } catch (error) { next(error); }
  }

  // Temuan
  static async addFinding(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ message: "Auth required" });
      const data = await AuditFindingService.addFinding(req.body, req.user);
      res.status(201).json({ message: "Temuan berhasil ditambahkan", data });
    } catch (error) { next(error); }
  }

  static async getEntityFindings(req: Request, res: Response, next: NextFunction) {
     try {
        const { type, id } = req.params;
        
        // ✅ PERBAIKAN 1: Validasi keberadaan parameter
        if (!type || !id) {
            return res.status(400).json({ message: "Parameter 'type' dan 'id' wajib diisi." });
        }

        const data = await AuditFindingService.getFindingsByEntity(type, id);
        res.status(200).json(data);
     } catch (error) {
        next(error);
     }
  }

  // PATCH /api/audit/findings/:id/resolve
  static async resolveFinding(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // ✅ PERBAIKAN 2: Validasi keberadaan ID
      if (!id) {
          return res.status(400).json({ message: "Parameter 'id' wajib diisi." });
      }
      
      if (!req.user) return res.status(401).json({ message: "Auth required" });
      
      const data = await AuditFindingService.resolveFinding(id, req.user);
      res.json(data);
    } catch (error) { next(error); }
  }
}