// src/modules/notification/notification.controller.ts
import type { Request, Response, NextFunction } from "express";
import { NotificationService } from "./notification.service.js";

export class NotificationController {
  
  /** GET /api/notifications */
  static async getMine(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      
      const data = await NotificationService.getMyNotifications(req.user.user_id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  /** PATCH /api/notifications/:id/read */
  static async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // ✅ TAMBAHKAN VALIDASI INI
      if (!id) {
        return res.status(400).json({ message: "ID notifikasi wajib ada." });
      }

      await NotificationService.markRead(id);
      res.status(200).json({ message: "Ditandai sudah dibaca" });
    } catch (error) {
      next(error);
    }
  }
  
  /** PATCH /api/notifications/read-all */
  static async markAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      
      await NotificationService.markAllRead(req.user.user_id);
      res.status(200).json({ message: "Semua notifikasi ditandai sudah dibaca" });
    } catch (error) {
      next(error);
    }
  }
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID notifikasi wajib ada." });
      }
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      await NotificationService.delete(id, req.user.user_id);
      res.status(200).json({ message: "Notifikasi berhasil dihapus." });
    } catch (error) {
      next(error);
    }
  }

  /** * 🆕 DELETE /api/notifications
   * Bersihkan semua notifikasi
   */
  static async deleteAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      await NotificationService.deleteAll(req.user.user_id);
      res.status(200).json({ message: "Semua notifikasi berhasil dibersihkan." });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "ID wajib disertakan." });
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const data = await NotificationService.getById(id, req.user.user_id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}