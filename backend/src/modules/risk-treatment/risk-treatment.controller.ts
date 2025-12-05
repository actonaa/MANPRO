// src/modules/risk-treatment/risk-treatment.controller.ts
import type { Request, Response, NextFunction } from "express";
import { RiskTreatmentService } from "./risk-treatment.service.js";
import type { CreateTreatmentDto, UpdateTreatmentDto } from "./risk-treatment.model.js";

export class RiskTreatmentController {
  static async findAllForRisk(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      // 1. Ambil risk_id dari query string (?risk_id=...)
      const { risk_id } = req.query;
      if (!risk_id || typeof risk_id !== 'string') {
        return res.status(400).json({ message: "Query parameter 'risk_id' wajib diisi." });
      }

      // 2. Panggil Service
      const data = await RiskTreatmentService.findAllForRisk(risk_id, req.user);
      
      // 3. Kirim data
      res.status(200).json(data);

    } catch (error) {
      next(error); // Kirim error ke middleware global
    }
  }

  static async add(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ message: "Otentikasi diperlukan" });
      
      // Ambil riskId dari parameter rute, tambahkan ke body
      const payload = req.body as CreateTreatmentDto; // risk_id harus ada di body
      if (!payload.risk_id) {
        return res.status(400).json({ message: "risk_id wajib ada di body" });
      }

      const data = await RiskTreatmentService.createTreatment(payload, req.user);
      res.status(201).json({ message: "Treatment ditambahkan.", data });
      
    } catch (error) {
      next(error); // 👈 Kirim error ke middleware global
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID treatment tidak ditemukan." });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      const payload = req.body as UpdateTreatmentDto;
      const data = await RiskTreatmentService.updateTreatment(id, payload, req.user);

      res.status(200).json({ message: "Treatment diperbarui.", data });
      
    } catch (error) {
      next(error); // 👈 Kirim error ke middleware global
    }
  }
}