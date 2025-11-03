import type { Request, Response } from "express";
import { MaintenanceService } from "./maintenance.service.js";

export class MaintenanceController {
  /** 🔹 Membuat jadwal pemeliharaan (oleh verifikator/admin) */
  static async create(req: Request, res: Response) {
    try {
      const assetId = req.params.assetId;
      if (!assetId) {
        return res.status(400).json({ message: "Asset ID wajib disertakan." });
      }

      const data = await MaintenanceService.createSchedule(assetId, req.body, req.user);
      res.status(201).json({ message: "Jadwal pemeliharaan berhasil dibuat.", data });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /** 🔹 Menampilkan semua jadwal berdasarkan aset */
  static async getByAsset(req: Request, res: Response) {
    try {
      const assetId = req.params.assetId;
      if (!assetId) {
        return res.status(400).json({ message: "Asset ID wajib disertakan." });
      }

      const data = await MaintenanceService.getByAsset(assetId, req.user);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(403).json({ message: error.message }); // gunakan 403 forbidden
    }
  }

  /** 🔹 Update detail jadwal (oleh verifikator/admin) */
  static async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "ID jadwal wajib disertakan." });
      }

      const data = await MaintenanceService.update(id, req.body, req.user);
      res.status(200).json({ message: "Jadwal berhasil diperbarui.", data });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /** 🔹 Menandai pemeliharaan selesai */
  static async complete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "ID jadwal wajib disertakan." });
      }

      const data = await MaintenanceService.complete(id, req.body, req.user);
      res.status(200).json({ message: "Pemeliharaan ditandai selesai.", data });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /** 🔹 Menghapus jadwal */
  static async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "ID jadwal wajib disertakan." });
      }

      const data = await MaintenanceService.delete(id, req.user);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
