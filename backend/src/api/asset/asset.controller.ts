import type { Request, Response } from "express";
import { AssetService } from "./asset.service.js";
import type { RequestWithId } from "../../types/express-request.js";

export class AssetController {
  static async getAllAssets(req: Request, res: Response) {
    try {
      const assets = await AssetService.findAll(req.user);
      res.status(200).json(assets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAssetById(req: RequestWithId, res: Response) {
    try {
      const { id } = req.params;
      const asset = await AssetService.findById(id, req.user);
      if (!asset) {
        return res.status(404).json({
          message: "Aset tidak ditemukan atau Anda tidak memiliki akses.",
        });
      }
      res.status(200).json(asset);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAssetByBarcode(req: Request, res: Response) {
    try {
      const { barcode } = req.params;

      if (!barcode) {
        return res.status(400).json({ message: "Barcode wajib diisi di parameter URL." });
      }

      const asset = await AssetService.findByBarcode(barcode, req.user);
      if (!asset) {
        return res.status(404).json({ message: "Aset dengan barcode ini tidak ditemukan." });
      }

      res.status(200).json(asset);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createAsset(req: Request, res: Response) {
    try {
      const asset = await AssetService.create(req.body, req.user);
      res.status(201).json(asset);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  //Update data aset
  static async updateAsset(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Parameter id wajib diisi." });
      }
      const asset = await AssetService.update(id, req.body, req.user);
      res.status(200).json(asset);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  //Request Delete Aset
  static async requestDeleteAsset(req: RequestWithId, res: Response) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: "Alasan penghapusan wajib diisi." });
    }

    const asset = await AssetService.requestDelete(id, reason, req.user);
    res.status(200).json({
      message: "Pengajuan penghapusan aset telah dikirim untuk diverifikasi.",
      asset,
    });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async verifyAsset(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
        const { status, notes } = req.body;
  
        const result = await AssetService.verifyAsset(id, status, notes, req.user);
        res.status(200).json({
          message: "Aset berhasil diverifikasi.",
          data: result,
        });
      } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
  }
}
