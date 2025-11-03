import type { Request, Response } from "express";
import { RiskTreatmentService } from "./risk-treatment.service.js";

export class RiskTreatmentController {
  static async add(req: Request, res: Response) {
    try {
      const data = await RiskTreatmentService.createTreatment(
        req.body,
        req.user
      );
      res.status(201).json({ message: "Treatment ditambahkan.", data });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ message: "ID treatment tidak ditemukan." });
      }

      const data = await RiskTreatmentService.updateTreatment(
        req.params.id, // ✅ aman karena sudah dicek
        req.body,
        req.user
      );

      res.status(200).json({ message: "Treatment diperbarui.", data });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
