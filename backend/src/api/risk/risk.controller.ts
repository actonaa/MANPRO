import type { Request, Response } from 'express';
import { RiskService } from './risk.service.js';

export class RiskController {
  static async getAllRisks(req: Request, res: Response) {
    try {
      const user = req.user; // Ambil data pengguna dari middleware
      const risks = await RiskService.findAll(user);
      res.status(200).json(risks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}