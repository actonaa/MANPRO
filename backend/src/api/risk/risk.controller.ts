import type { Request, Response } from 'express';
import { RiskService } from './risk.service.js';
import type { RequestWithId } from "../../type/express-request.js";

export class RiskController {
  static async getAllRisks(req: Request, res: Response) {
    try {
      const risks = await RiskService.findAll(req.user);
      res.status(200).json(risks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getRiskById(req: RequestWithId, res: Response) {
      try {
        const { id } = req.params;
        const  risk = await RiskService.findById(id, req.user);
        if (!risk) {
          return res.status(404).json({
            message: "Risiko tidak ditemukan atau Anda tidak memiliki akses.",
          });
        }
        res.status(200).json(risk);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
  }
  
  static async createRisk(req: Request, res: Response) {
    try {
      const risk = await RiskService.create(req.body, req.user);
      res.status(201).json({
        message: "Risiko berhasil diajukan dan menunggu verifikasi.",
        risk,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateRisk(req: RequestWithId, res: Response) {
    try {
      const { id } = req.params;
      const risk = await RiskService.update(id, req.body, req.user);
      res.status(200).json({
        message: "Perubahan risiko berhasil disimpan (menunggu verifikasi).",
        risk,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}