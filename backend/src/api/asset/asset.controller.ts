import type { Request, Response } from 'express';
import { AssetService } from './asset.service.js';

export class AssetController {
  static async getAllAssets(req: Request, res: Response) {
    try {
      const user = req.user; // Ambil data pengguna dari middleware
      const assets = await AssetService.findAll(user);
      res.status(200).json(assets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}