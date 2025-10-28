import type { Request, Response } from 'express';
import { RiskService } from './risk.service.js';
import type { RequestWithId } from "../../types/express-request.js";

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

  static async createRiskWithTreatments(req: Request, res: Response) {
    try {
      const result = await RiskService.createRiskWithTreatments(req.body, req.user);
      res.status(201).json({
        message: "Risiko dan treatment berhasil disimpan.",
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Error createRiskWithTreatments:", error.message);
        res.status(500).json({ message: error.message });
      } else {
        console.error("❌ Error createRiskWithTreatments:", error);
        res.status(500).json({ message: "Terjadi kesalahan yang tidak diketahui." });
      }
    }
  }

  static async updateRiskWithTreatments(req: RequestWithId, res: Response) {
    try {
      const { id } = req.params;
      const result = await RiskService.updateRiskWithTreatments(id, req.body, req.user);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Error updateRiskWithTreatments:", error.message);
        res.status(500).json({ message: error.message });
      } else {
        console.error("❌ Error updateRiskWithTreatments:", error);
        res.status(500).json({ message: "Terjadi kesalahan yang tidak diketahui." });
      }
    }
  }
  static async verifyRisk(req: Request, res: Response) {
    try {
        const id = String(req.params.id); // ✅ pastikan selalu string
        const { status, notes } = req.body;
  
        const result = await RiskService.verifyRisk(id, status, notes, req.user);
        res.status(200).json({
          message: "Risiko berhasil diverifikasi.",
          data: result,
        });
      } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
  }
  static async approveRisk(req: Request, res: Response) {
    try {
      const id = String(req.params.id); // ✅ pastikan selalu string
        const { status, notes } = req.body;
  
        const result = await RiskService.approveRisk(id, status, notes, req.user);
        res.status(200).json({
          message: "Persetujuan risiko berhasil disimpan.",
          data: result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}