import type { Request, Response, NextFunction } from "express";
import { AssetService } from "./asset.service.js";
import type { CreateAssetDto, UpdateAssetDto, LinkChangeDto, LinkIncidentDto, BulkLinkChangeDto } from "./asset.model.js";

export class AssetController {

  // === Metode Publik ===
  static async getAllPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const assets = await AssetService.findAllPublic();
      res.status(200).json(assets);
    } catch (error) {
      next(error); // 👈 Kirim error ke middleware global
    }
  }

  static async getPublicById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Validasi input tetap di controller
      if (!id) {
        return res.status(400).json({ message: "Parameter id wajib diisi." });
      }

      const asset = await AssetService.findByIdPublic(id);

      // Logika "Not Found" (404) tetap di controller
      if (!asset) {
        return res.status(404).json({ message: "Aset tidak ditemukan atau tidak tersedia untuk publik." });
      }

      res.status(200).json(asset);
    } catch (error) {
      next(error);
    }
  }

  // === Metode Terotentikasi ===

  static async getAllAssets(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }
      const assets = await AssetService.findAll(req.user);
      res.status(200).json(assets);
    } catch (error) {
      next(error);
    }
  }

  static async getAssetById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // 1. 💡 TAMBAHKAN PENGECEKAN INI
      // Ini adalah perbaikan untuk error di baris 61, 123, 141, 161
      if (!id) {
        return res.status(400).json({ message: "Parameter ID aset diperlukan." });
      }
      
      // Pengecekan 'req.user' Anda sudah benar
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      // 2. Sekarang, TypeScript tahu bahwa 'id' 100% adalah 'string'
      const asset = await AssetService.findById(id, req.user);
      
      if (!asset) {
        return res.status(404).json({
          message: "Aset tidak ditemukan.",
        });
      }
      res.status(200).json(asset);
    } catch (error) {
      next(error);
    }
  }

  static async getAssetByBarcode(req: Request, res: Response, next: NextFunction) {
    try {
      const { barcode } = req.params;
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }
      if (!barcode) {
        return res.status(400).json({ message: "Barcode wajib diisi di parameter URL." });
      }

      const asset = await AssetService.findByBarcode(barcode, req.user);
      if (!asset) {
        return res.status(404).json({ message: "Aset dengan barcode ini tidak ditemukan." });
      }

      res.status(200).json(asset);
    } catch (error) {
      next(error);
    }
  }

  static async getPublicAssetByBarcode(req: Request, res: Response, next: NextFunction) {
  try {
    const { barcode } = req.params;
    if (!barcode) {
      return res.status(400).json({ message: "Barcode wajib diisi." });
    }

    // Panggil service publik (TANPA req.user)
    const asset = await AssetService.findPublicByBarcode(barcode);
    if (!asset) {
      return res.status(404).json({ message: "Aset... tidak ditemukan." });
    }

    res.status(200).json(asset); // Mengembalikan data TERBATAS (PublicAssetDto)
  } catch (error) {
    next(error);
  }
}

  static async createAsset(req: Request, res: Response, next: NextFunction) {
    try {
      // 💡 Gunakan DTO untuk memberi tipe pada req.body
      const assetData = req.body as CreateAssetDto;

      const file = req.file;

      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      const asset = await AssetService.create(assetData, req.user, file);
      res.status(201).json(asset); // 201 Created
    } catch (error) {
      next(error);
    }
  }

  static async updateAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
      return res.status(400).json({ message: "Parameter ID aset diperlukan." });
    }
      // 💡 Gunakan DTO untuk memberi tipe pada req.body
      const assetData = req.body as UpdateAssetDto;
      const file = req.file;
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      const asset = await AssetService.update(id, assetData, req.user, file);
      res.status(200).json(asset);
    } catch (error) {
      next(error);
    }
  }

  static async requestDeleteAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
      return res.status(400).json({ message: "Parameter ID aset diperlukan." });
    }
      const { reason } = req.body;
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }
      if (!reason) {
        return res.status(400).json({ message: "Alasan penghapusan wajib diisi." });
      }

      const asset = await AssetService.requestDelete(id, reason, req.user);
      res.status(200).json({
        message: "Pengajuan penghapusan aset telah dikirim untuk diverifikasi.",
        asset,
      });
    } catch (error) {
        next(error);
      }
  }

  static async verifyDeleteAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // Ambil action ('accept'/'reject') dan notes dari body
      const { action, notes } = req.body; 

      if (!id) {
        return res.status(400).json({ message: "Parameter ID aset diperlukan." });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      // Validasi Input Body
      if (!action || !['accept', 'reject'].includes(action)) {
        return res.status(400).json({ message: "Action harus berupa 'accept' atau 'reject'." });
      }
      // if (!notes) {
      //   return res.status(400).json({ message: "Catatan verifikasi wajib diisi." });
      // }

      // Panggil Service
      const asset = await AssetService.verifyDeleteRequest(id, action, notes, req.user);

      // Respons dinamis tergantung aksi
      const message = action === 'accept' 
        ? "Verifikasi berhasil. Aset diteruskan ke Admin untuk persetujuan akhir." 
        : "Verifikasi ditolak. Aset dikembalikan ke status Aktif.";

      res.status(200).json({
        message,
        asset,
      });

    } catch (error) {
      next(error);
    }
  }

  static async approveDeleteAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { action, notes } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Parameter ID aset diperlukan." });
      }
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      // Validasi Input Body
      if (!action || !['accept', 'reject'].includes(action)) {
        return res.status(400).json({ message: "Action harus berupa 'accept' atau 'reject'." });
      }
      // Notes opsional untuk admin jika accept, tapi wajib jika reject (tergantung kebijakan)
      // Di sini kita buat wajib agar audit trail jelas
      // if (!notes) {
      //   return res.status(400).json({ message: "Catatan persetujuan/penolakan wajib diisi." });
      // }

      // Panggil Service Admin
      const asset = await AssetService.approveDeleteRequest(id, action, notes, req.user);

      // Respons dinamis
      const message = action === 'accept' 
        ? "Penghapusan disetujui. Status aset kini 'Decomission/Musnah'." 
        : "Penghapusan ditolak oleh Admin. Aset dikembalikan ke status Aktif.";

      res.status(200).json({
        message,
        asset,
      });

    } catch (error) {
      next(error);
    }
  }

  static async verifyAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
      return res.status(400).json({ message: "Parameter ID aset diperlukan." });
    }
      const { approval_status, revision_notes } = req.body;
      if (!req.user) {
        return res.status(401).json({ message: "Otentikasi diperlukan" });
      }

      // TODO: Validasi 'status' (misal: hanya boleh 'approved' atau 'rejected')

      const result = await AssetService.verifyAsset(id, approval_status, revision_notes, req.user);
      res.status(200).json({
        message: "Aset berhasil diverifikasi.",
        data: result,
      });
    } catch (error) {
      // 💡 Ini akan menangkap error "Hanya verifikator..." dari service
      // dan middleware global bisa memberinya status 403 (Forbidden)
      next(error);
    }
  }

  // src/modules/asset/asset.controller.ts

  static async linkChange(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
         return res.status(401).json({ message: "Otentikasi diperlukan" });
      }
      
      const { id } = req.params;
      const payload = req.body as LinkChangeDto;

      // 💡 TAMBAHKAN VALIDASI ID INI
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' aset wajib diisi." });
      }
      
      if (!payload.status_id || !payload.linked_change_id) {
          return res.status(400).json({ message: "Payload 'status_id' dan 'linked_change_id' wajib diisi." });
      }
      
      // ✅ 'id' di sini dijamin string
      const updatedAsset = await AssetService.linkChange(id, payload, req.user); 
      if (!updatedAsset) return res.status(404).json({ message: "Aset tidak ditemukan." });

      res.status(200).json({ message: "Aset berhasil ditautkan ke Change.", data: updatedAsset });

    } catch (error) {
      next(error);
    }
  }

  // src/modules/asset/asset.controller.ts
  static async linkIncidentPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const payload = req.body as LinkIncidentDto;

      // 💡 TAMBAHKAN VALIDASI ID INI
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' aset wajib diisi." });
      }

      if (!payload.status_id || !payload.linked_incident_id) {
          return res.status(400).json({ message: "Payload 'status_id' dan 'linked_incident_id' wajib diisi." });
      }

      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
      // ✅ 'id' di sini dijamin string
      const updatedAsset = await AssetService.linkIncidentPublic(id, payload, ip); 
      if (!updatedAsset) return res.status(404).json({ message: "Aset tidak ditemukan." });

      res.status(200).json({ message: "Aset berhasil ditautkan ke Insiden.", data: updatedAsset });

    } catch (error) {
      next(error);
    }
  }

  // src/modules/asset/asset.controller.ts

  static async linkIncident(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
         return res.status(401).json({ message: "Otentikasi diperlukan" });
      }
      
      const { id } = req.params;
      const payload = req.body as LinkIncidentDto;
      
      // 💡 TAMBAHKAN VALIDASI ID INI
      if (!id) {
        return res.status(400).json({ message: "Parameter 'id' aset wajib diisi." });
      }

      if (!payload.status_id || !payload.linked_incident_id) {
          return res.status(400).json({ message: "Payload 'status_id' dan 'linked_incident_id' wajib diisi." });
      }
      
      // ✅ 'id' di sini dijamin string
      const updatedAsset = await AssetService.linkIncident(id, payload, req.user); 
      if (!updatedAsset) return res.status(404).json({ message: "Aset tidak ditemukan." });

      res.status(200).json({ message: "Aset berhasil ditautkan ke Insiden.", data: updatedAsset });

    } catch (error) {
      next(error);
    }
  }
  // src/modules/asset/asset.controller.ts

  static async getPlanningData(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // 1. ✅ TAMBAHKAN VALIDASI INI
      if (!id) {
        return res.status(400).json({ message: "Asset ID wajib disertakan." });
      }

      if (!req.user) {
         return res.status(401).json({ message: "Auth required" });
      }

      // Sekarang TypeScript tahu 'id' pasti string
      const data = await AssetService.getMaintenancePlanningData(id, req.user);
      
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async bulkLinkChange(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ message: "Otentikasi diperlukan" });

      const { statusKey } = req.params; // Ambil dari URL
      const payload = req.body as BulkLinkChangeDto;

      if (!statusKey) {
        return res.status(400).json({ message: "Parameter 'statusKey' wajib diisi." });
      }

      // Validasi Input
      if (!payload.asset_ids || !Array.isArray(payload.asset_ids) || payload.asset_ids.length === 0) {
        return res.status(400).json({ message: "Payload 'asset_ids' harus berupa array dan tidak boleh kosong." });
      }
      // if (!payload.linked_change_id) {
      //   return res.status(400).json({ message: "Payload 'linked_change_id' wajib diisi." });
      // }

      // Validasi Status Key yang diizinkan
      const allowedStatuses = ['in_use', 'standby', 'retired', 'maintenance'];
      if (!allowedStatuses.includes(statusKey)) {
        return res.status(400).json({ message: `Status '${statusKey}' tidak dikenali.` });
      }

      // Panggil Service
      const result = await AssetService.bulkLinkChange(
        statusKey as 'in_use' | 'standby' | 'retired' | 'maintenance', 
        payload, 
        req.user
      );

      res.status(200).json({ 
        message: `Berhasil memperbarui ${result.length} aset ke status ${statusKey}.`, 
        data: result 
      });

    } catch (error) {
      next(error);
    }
  }
}