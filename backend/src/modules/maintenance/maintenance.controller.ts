import type { Request, Response, NextFunction } from "express";
import { MaintenanceService } from "./maintenance.service.js";
import type { CreateMaintenanceDto, UpdateMaintenanceDto, CompleteMaintenanceDto } from "./maintenance.model.js";

export class MaintenanceController {
  /**
   * 🆕 Ambil semua jadwal (dengan filter)
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      // 1. Tentukan tipe filternya dulu
      const filters: { status?: string } = {};
      
      // 2. Ambil nilai status dari query
      const status = req.query.status as string | undefined;

      // 3. HANYA tambahkan ke objek 'filters' JIKA nilainya ada
      if (status) {
        filters.status = status;
      }
      
      // ⬆️ === AKHIR PERUBAHAN === ⬆️

      // 'filters' sekarang akan menjadi `{}` (kosong) atau `{ status: "scheduled" }`
      // Keduanya valid dan tidak akan error.
      const data = await MaintenanceService.getAll(req.user, filters);
      res.status(200).json(data);
      
    } catch (error) {
      next(error);
    }
  }
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Validasi
      if (!id) {
        return res.status(400).json({ message: "ID maintenance wajib disertakan." });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      // Panggil Service
      const data = await MaintenanceService.findById(id, req.user);
      
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { assetId } = req.params;
      if (!assetId) {
        return res.status(400).json({ message: "Asset ID wajib disertakan." });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      const payload = req.body as CreateMaintenanceDto;
      const data = await MaintenanceService.createSchedule(assetId, payload, req.user);
      res.status(201).json({ message: "Jadwal pemeliharaan berhasil dibuat.", data });
      
    } catch (error) {
      next(error);
    }
  }

  static async getByAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const { assetId } = req.params;
      if (!assetId) {
        return res.status(400).json({ message: "Asset ID wajib disertakan." });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      const data = await MaintenanceService.getByAsset(assetId, req.user);
      res.status(200).json(data);
      
    } catch (error) {
      next(error); // Middleware error akan menangani 403 (Forbidden)
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID jadwal wajib disertakan." });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }
      
      const payload = req.body as UpdateMaintenanceDto;
      const data = await MaintenanceService.update(id, payload, req.user);
      res.status(200).json({ message: "Jadwal berhasil diperbarui.", data });
      
    } catch (error) {
      next(error);
    }
  }

  static async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID jadwal wajib disertakan." });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      const payload = req.body as CompleteMaintenanceDto;
      const file = (req as any).file;
      const data = await MaintenanceService.complete(id, payload, req.user, file);
      res.status(200).json({ message: "Pemeliharaan ditandai selesai.", data });
      
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID jadwal wajib disertakan." });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      const data = await MaintenanceService.delete(id, req.user);
      res.status(200).json(data);
      
    } catch (error) {
      next(error);
    }
  }
}