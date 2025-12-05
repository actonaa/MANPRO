import type { Request, Response, NextFunction } from "express";
import { AuditService } from "./audit.service.js";

export class AuditController {
  static async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      // Panggil service yang sudah kita update logikanya
      const logs = await AuditService.getAllLogs();
      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  }
}