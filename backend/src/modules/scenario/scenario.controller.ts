import type { Request, Response, NextFunction } from "express";
import { ScenarioService } from "./scenario.service.js";
import type { CreateScenarioDto, UpdateScenarioDto } from "./scenario.model.js";

export class ScenarioController {

  /**
   * Membuat skenario baru (POST /)
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }
      const payload = req.body as CreateScenarioDto;
      
      const data = await ScenarioService.create(payload, req.user);
      
      res.status(201).json({ message: "Skenario berhasil dibuat.", data });
    } catch (error) {
      next(error); // Kirim error ke middleware global
    }
  }

  /**
   * Mengambil semua skenario (GET /)
   * (Sudah difilter berdasarkan departemen pengguna oleh service)
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }
      
      const data = await ScenarioService.findAll(req.user);
      
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mengambil satu skenario berdasarkan ID (GET /:id)
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' wajib diisi." });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      const data = await ScenarioService.findById(id, req.user);
      if (!data) {
        return res.status(404).json({ message: "Skenario tidak ditemukan atau Anda tidak memiliki akses." });
      }
      
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mengupdate skenario (PUT /:id)
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' wajib diisi." });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      const payload = req.body as UpdateScenarioDto;
      const data = await ScenarioService.update(id, payload, req.user);
      
      res.status(200).json({ message: "Skenario berhasil diperbarui.", data });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menghapus skenario (DELETE /:id)
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' wajib diisi." });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      await ScenarioService.delete(id, req.user);
      
      res.status(200).json({ message: "Skenario berhasil dihapus." });
    } catch (error) {
      next(error);
    }
  }
}