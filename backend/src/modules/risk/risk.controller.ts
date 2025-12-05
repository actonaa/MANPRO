// src/modules/risk/risk.controller.ts
import type { Request, Response, NextFunction } from 'express';
import { RiskService } from './risk.service.js';
import type { RiskWithTreatmentsPayload, CreateRiskDto, UpdateRiskDto } from './risk.model.js';

export class RiskController {

  static async getAllRisks(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ message: "Otentikasi diperlukan" });
      const risks = await RiskService.findAll(req.user);
      res.status(200).json(risks);
    } catch (error) {
      next(error);
    }
  }

  static async getRiskById(req: Request, res: Response, next: NextFunction) {
      try {
        const { id } = req.params;
        if (!id) {
          return res.status(400).json({ message: "Parameter ID aset diperlukan." });
        }
        
        if (!req.user) return res.status(401).json({ message: "Otentikasi diperlukan" });
        const risk = await RiskService.findById(id, req.user);
        
        if (!risk) {
          return res.status(404).json({
            message: "Risiko tidak ditemukan.",
          });
        }
        res.status(200).json(risk);
      } catch (error) {
        next(error);
      }
  }
  
  static async createRisk(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ message: "Otentikasi diperlukan" });
      const riskData = req.body as CreateRiskDto;
      const risk = await RiskService.create(riskData, req.user);
      res.status(201).json({
        message: "Risiko berhasil diajukan dan menunggu verifikasi.",
        risk,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateRisk(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Parameter ID aset diperlukan." });
      }
      if (!req.user) return res.status(401).json({ message: "Otentikasi diperlukan" });
      const riskData = req.body as UpdateRiskDto;
      const risk = await RiskService.update(id, riskData, req.user);
      res.status(200).json({
        message: "Perubahan risiko berhasil disimpan (menunggu verifikasi).",
        risk,
      });
    } catch (error) {
      next(error);
    }
  }

  // === Controller untuk 'WithTreatments' ===

  static async createRiskWithTreatments(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ message: "Otentikasi diperlukan" });
      const payload = req.body as RiskWithTreatmentsPayload;
      const result = await RiskService.createRiskWithTreatments(payload, req.user);
      res.status(201).json({
        message: "Risiko dan treatment berhasil disimpan.",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateRiskWithTreatments(req: Request, res: Response, next: NextFunction) {
  try {
      const { id } = req.params;
      if (!id) {
      return res.status(400).json({ message: "Parameter ID aset diperlukan." });
    }
      if (!req.user) return res.status(401).json({ message: "Otentikasi diperlukan" });
      const payload = req.body as RiskWithTreatmentsPayload;
      const result = await RiskService.updateRiskWithTreatments(id, payload, req.user);
      res.status(200).json({
        message: "Risiko dan perlakuan berhasil diperbarui.",
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  // === Controller untuk Verifikasi & Approval ===
  static async verifyRisk(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
        if (!id) {
        return res.status(400).json({ message: "Parameter ID aset diperlukan." });
      }
        const { approval_status, revision_notes } = req.body;
        if (!req.user) return res.status(401).json({ message: "Otentikasi diperlukan" });
  
        const result = await RiskService.verifyRisk(id, approval_status, revision_notes, req.user);
        res.status(200).json({
          message: "Persetujuan risiko berhasil disimpan.",
          data: result,
        });
    } catch (error) {
        next(error); // Error akan ditangkap (misal: "Hanya admin...")
    }
  }
  /*
  static async verifyRisk(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        if (!id) {
          return res.status(400).json({ message: "Parameter ID aset diperlukan." });
        }
        const { approval_status, revision_notes } = req.body;
        if (!req.user) return res.status(401).json({ message: "Otentikasi diperlukan" });
  
        const result = await RiskService.verifyRisk(id, approval_status, revision_notes, req.user);
        res.status(200).json({
          message: "Risiko berhasil diverifikasi.",
          data: result,
        });
      } catch (error) {
        next(error); // Error akan ditangkap (misal: "Hanya verifikator...")
    }
  }
*/
}