// src/modules/asset/asset.service.ts
import bwipjs from 'bwip-js';
import 'multer';
import { v4 as uuidv4 } from 'uuid';
import { AssetRepository } from './asset.repository.js';
import { NotificationService } from '../notification/notification.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { Asset, CreateAssetDto, pubclicAsset, UpdateAssetDto, LinkChangeDto, LinkIncidentDto, BulkLinkChangeDto } from './asset.model.js';
import { ASSET_STATUS } from "./asset.model.js";
import type { NormalizedUser } from '../../types/index.js'; // Impor tipe User Anda

// Helper untuk mengecek role admin
const isAdmin = (user: NormalizedUser) => 
  user.role_name === 'admin_diskominfo' || user.role_name === 'auditor';

// Helper untuk mengecek role verifikator
const isVerifikator = (user: NormalizedUser) => 
  user.role_name === 'verifikator';

export class AssetService {
  // === Metode Publik (langsung panggil repo) ===
  static async findAllPublic(): Promise<Partial<Asset>[]> {
    return AssetRepository.findAllPublic();
  }
  
  static async findByIdPublic(id: string): Promise<Partial<Asset> | null> {
    return AssetRepository.findByIdPublic(id);
  }

  // === Metode Find dengan Logika Bisnis ===
  static async findAll(user: NormalizedUser): Promise<Asset[]> {
    if (isAdmin(user)) {
      return AssetRepository.findAll();
    }
    if (!user.department_name) {
      return []; 
    } // User non-admin tanpa departemen
    const departmentId = await AssetRepository.findDepartmentIdByName(user.department_name);
    if (!departmentId) return [];
    return AssetRepository.findAllByDepartmentId(departmentId);

  }

  static async findById(id: string, user: NormalizedUser): Promise<Asset | null> {
    const asset = await AssetRepository.findById(id);
    if (!asset) return null;

    const assetDepartmentName = (asset.department as any)?.name; 

    if (isAdmin(user) || assetDepartmentName === user.department_name) {
      return asset;
    }
    
    // Jika tidak cocok, user tidak punya akses
    throw new Error("Anda tidak memiliki akses untuk melihat aset ini.");
  }

  static async findByBarcode(barcode: string, user: NormalizedUser): Promise<Asset | null> {
    const asset = await AssetRepository.findByBarcode(barcode);
    if (!asset) return null;

    // Logika keamanan yang sama dengan findById
    if (isAdmin(user) || asset.department?.[0]?.name === user.department_name) {
      return asset;
    }
    
    throw new Error("Anda tidak memiliki akses untuk melihat aset ini.");
  }

  static async findPublicByBarcode(barcode: string): Promise<pubclicAsset | null> {
    const asset = await AssetRepository.findPublicByBarcode(barcode);
    
    if (!asset) {
      return null;
    }
    
    // Tidak ada logika keamanan, langsung kembalikan data terbatas
    return asset;
  }

  // === Metode Mutasi dengan Logika Bisnis ===
  static async create(
    assetData: CreateAssetDto, 
    user: NormalizedUser,
    file?: Express.Multer.File
  ): Promise<Asset> {
    try {
      const dataToCreate: Partial<Asset> = { ...assetData };

      if (!isAdmin(user) && user.department_name) {
        
        // 1. Cari ID departemen berdasarkan nama dari SSO
        const departmentId = await AssetRepository.findDepartmentIdByName(user.department_name);

        // 2. Jika ID tidak ketemu, tolak
        if (!departmentId) {
          throw new Error(`Departemen "${user.department_name}" tidak valid atau tidak ditemukan.`);
        }
        
        // 3. Set department_id di data yang akan dibuat
        dataToCreate.department_id = departmentId;

      } else if (!isAdmin(user) && !user.department_name) {
        throw new Error("User non-admin harus memiliki departemen untuk membuat aset.");
      }
      
      // Logika Bisnis: Atur status default
      dataToCreate.approval_status = "pending";
      dataToCreate.status_id = '6494a4a6-41e6-42b5-be69-b587a0371c4f'; // Non-Aktif

      // Logika Bisnis: Buat Barcode
      const barcodeValue = `AST-${Date.now()}-${uuidv4().slice(0, 6)}`;
      dataToCreate.barcode = barcodeValue;

      // 2. Generate Buffer untuk Code128 (untuk scanner fisik)
      const code128Buffer = await bwipjs.toBuffer({
        bcid: 'code128', 
        text: barcodeValue, 
        scale: 3, 
        height: 10,
        includetext: true, textxalign: 'center',
      });

      const publicUrl = `${process.env.FRONTEND_PUBLIC_URL}/public/asset/${barcodeValue}`;

      // 3. Generate Buffer untuk QR Code (untuk scan HP)
      const qrBuffer = await bwipjs.toBuffer({
        bcid: 'qrcode',
        text: publicUrl, // Encode data yang SAMA
        scale: 4,
        width: 25,
        height: 25,
      });

      // 4. Upload kedua gambar (misal ke Supabase Storage)
      const filePath128 = `assets/${barcodeValue}-128.png`;
      const code128Url = await AssetRepository.uploadBarcode(filePath128, code128Buffer);

      const filePathQR = `assets/${barcodeValue}-qr.png`;
      const qrUrl = await AssetRepository.uploadBarcode(filePathQR, qrBuffer);

      // 5. Simpan kedua URL ke data yang akan dibuat
      dataToCreate.barcode_128_url = code128Url;
      dataToCreate.barcode_qr_url = qrUrl;

      if (file) {
        // Bersihkan nama file
        const fileExt = file.originalname.split('.').pop();
        // Nama file: [BARCODE]-att.[ext]
        const cleanFileName = `${barcodeValue}-att.${fileExt}`; 
        
        // Gunakan method uploadFile generic yang baru kita buat di Repository
        const attachmentUrl = await AssetRepository.uploadFile(
          'assets/',         // Folder di bucket
          cleanFileName,     // Nama file
          file.buffer,       // Data binary
          file.mimetype      // Tipe konten
        );

        // Simpan URL ke kolom 'attachments'
        dataToCreate.attachments = attachmentUrl; 
      }

      dataToCreate.created_by = user.user_id;
      // 5. Panggil Repository (Database)
      const newAsset = await AssetRepository.create(dataToCreate);

      // 6. Logika Lintas Sektoral (Notifikasi & Audit)
      void NotificationService.notifyRoles({
        roles: ["verifikator"],
        senderId: user.user_id,
        
        category: "Asset",
        title: "Aset Baru Diajukan",
        message: `Aset baru dibuat oleh ${user.email}: ${newAsset.name}`,
        
        link: `/assets/${newAsset.id}`,
        type: "info"
      });
      
      void AuditService.log({
        user_id: user.user_id,
        user_name: user.name || user.email, // Snapshot Nama
        user_email: user.email,             // Snapshot Email
        action: "CREATE",
        table_name: "asset",
        record_id: newAsset.id,
        data_before: null,                  // Create tidak ada data sebelumnya
        data_after: newAsset,               // Data baru
        ip_address: user.ip_address || null // Ambil IP dari user
      });

      return newAsset;

    } catch (error: any) {
      console.error("Error creating asset:", error);
      throw new Error(error.message);
    }
  }
  
  static async update(
    id: string, 
    assetData: UpdateAssetDto, 
    user: NormalizedUser,
    file?: Express.Multer.File
  ): Promise<Asset> {

    const existingAsset = await AssetRepository.findById(id);
    if (!existingAsset) {
      throw new Error('Aset tidak ditemukan.');
    }

    const dataToUpdate: Partial<Asset> = { ...assetData }
    let needsReverification = false;
    if (!isAdmin(user)) {
      if (!user.department_name) {
        throw new Error("Data departemen pengguna tidak tersedia di token SSO.");
      }
      // Ambil ID departemen user berdasarkan nama
      const userDeptId = await AssetRepository.findDepartmentIdByName(user.department_name);

      if (!userDeptId) {
        throw new Error(`Departemen '${user.department_name}' tidak ditemukan di sistem aset.`);
      }
      // Cek apakah aset ini milik departemen user
      if (existingAsset.department_id !== userDeptId) {
        throw new Error("Anda tidak memiliki akses untuk mengubah aset dinas lain.");
      }
      dataToUpdate.approval_status = 'pending';
      needsReverification = true;
    }
    if (file) {
      // Gunakan barcode yang sudah ada untuk penamaan
      // Tambahkan timestamp agar browser tidak men-cache gambar lama
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${existingAsset.barcode || id}-att-${Date.now()}.${fileExt}`;

      const attachmentUrl = await AssetRepository.uploadFile(
        'assets/', 
        fileName, 
        file.buffer, 
        file.mimetype
      );

      dataToUpdate.attachments = attachmentUrl;
    }

    delete dataToUpdate.department_id;
    dataToUpdate.updated_by = user.user_id;
    const updatedAsset = await AssetRepository.update(id, dataToUpdate);

    if (needsReverification) {
      void NotificationService.notifyRoles({
        roles: ["verifikator"],
        senderId: user.user_id,
        category: "Asset",
        title: "Aset Diperbarui (Verifikasi Ulang)",
        message: `Aset "${existingAsset.name}" telah diperbarui oleh ${user.name || user.email} dan perlu diverifikasi ulang.`,
        link: `/assets/${id}`, // Link ke detail aset
        type: "warning"
      });
    }

    void AuditService.log({
      user_id: user.user_id,
      user_name: user.name || user.email,
      user_email: user.email,
      action: "UPDATE",
      table_name: "asset",
      record_id: id,
      data_before: existingAsset, 
      data_after: updatedAsset, 
      ip_address: user.ip_address || null
    });

    return updatedAsset;
  }

  static async verifyAsset(id: string, approval_status: string, notes: string | null, user: NormalizedUser): Promise<Asset> {
    if (!isVerifikator(user) && !isAdmin(user)) {
      throw new Error("Hanya verifikator dinas yang dapat memverifikasi aset.");
    }

    const asset = await AssetRepository.findById(id);
    if (!asset) throw new Error("Aset tidak ditemukan.");

    // 3. Cek izin departemen
    if (!user.department_name) {
      throw new Error("Data departemen pengguna tidak tersedia di token SSO.");
    }
    const userDeptId = await AssetRepository.findDepartmentIdByName(user.department_name);

    if (!userDeptId) {
      throw new Error(`Departemen '${user.department_name}' tidak ditemukan di sistem aset.`);
    }

    if (asset.department_id !== userDeptId) {
      throw new Error("Anda tidak memiliki akses ke aset dinas lain.");
    }

    // 3. Logika Bisnis: Validasi Input
    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(approval_status)) {
      throw new Error(`Status tidak valid. Pilihan: ${validStatuses.join(", ")}`);
    }

    // 4. Logika Bisnis: Siapkan data update
    const updateData: Partial<Asset> = {
      approval_status: approval_status as 'approved' | 'rejected',
      revision_notes: notes || null,
      updated_by: user.user_id,
      updated_at: new Date().toISOString()
    };

    if (approval_status === "approved") {
      updateData.status_id = "1b2ccf3a-3b0a-4662-a742-cf52039d98d4"; // ID "Aktif"
      updateData.approved_by = user.user_id;
      updateData.approved_at = new Date().toISOString();
    }

   const updatedAsset = await AssetRepository.update(id, updateData);

   if (asset.created_by) {
      if (approval_status === 'approved') {
        void NotificationService.notifyUser({
          userId: asset.created_by,
          senderId: user.user_id,
          category: 'Asset',
          title: 'Aset Disetujui',
          message: `Aset "${asset.name}" telah disetujui oleh verifikator dan kini Aktif.`,
          notes: notes, // Catatan opsional
          link: `/assets/${id}`,
          type: 'success'
        });
      } else if (approval_status === 'rejected') {
        // Kasus: DITOLAK
        void NotificationService.notifyUser({
          userId: asset.created_by,
          senderId: user.user_id,
          category: 'Asset',
          title: 'Pengajuan Aset Ditolak',
          message: `Pengajuan aset "${asset.name}" ditolak. Silakan periksa catatan revisi.`,
          notes: notes,
          link: `/assets/${id}`,
          type: 'error'
        });
      }
    }

    // 7. AUDIT TRAIL
    void AuditService.log({
      user_id: user.user_id,
      user_name: user.name || user.email,
      user_email: user.email,
      action: "APPROVE", 
      table_name: "asset",
      record_id: id,
      data_before: asset,        
      data_after: updatedAsset,  
      ip_address: user.ip_address || null
    });

    return updatedAsset;
  }

  static async requestDelete(id: string, reason: string, user: NormalizedUser): Promise<Asset> {
    const asset = await AssetRepository.findById(id);
    if (!asset) throw new Error("Aset tidak ditemukan.");

    if (!user.department_name) {
      throw new Error("Data departemen pengguna tidak tersedia di token SSO.");
    }
    const userDeptId = await AssetRepository.findDepartmentIdByName(user.department_name);

    if (!userDeptId) {
      throw new Error(`Departemen '${user.department_name}' tidak ditemukan di sistem aset.`);
    }

    if (!isAdmin(user) && asset.department_id !== userDeptId) {
      throw new Error("Anda tidak memiliki akses ke aset dinas lain.");
    }
  
    // 2. Panggil Repository (Helper)
    const statusId = await AssetRepository.findStatusIdByName("Akan Dihapus");

    // 3. Siapkan data update
    const updateData: Partial<Asset> = {
      approval_status: "pending_delete",
      revision_notes: reason,
      status_id: statusId,
      updated_by: user.user_id,
      updated_at: new Date().toISOString()
    };

    const updatedAsset = await AssetRepository.update(id, updateData);

    void NotificationService.notifyRoles({
        roles: ["verifikator"], 
        senderId: user.user_id,
        category: 'Asset',
        title: 'Pengajuan Penghapusan Aset',
        message: `${user.name || user.email} mengajukan penghapusan untuk aset: "${asset.name}".`,
        notes: reason, // Alasan penghapusan masuk ke sini
        link: `/assets/${id}`, // Link ke detail aset
        type: 'warning' // Warna kuning/oranye karena ini aksi destruktif
    });

    // 6. 🚀 AUDIT TRAIL
    void AuditService.log({
      user_id: user.user_id,
      user_name: user.name || user.email,
      user_email: user.email,
      action: "UPDATE", 
      table_name: "asset",
      record_id: id,
      data_before: asset,        
      data_after: updatedAsset,  
      ip_address: user.ip_address || null
    });

    return updatedAsset;
  }

  static async verifyDeleteRequest(
    id: string, 
    action: 'accept' | 'reject',
    notes: string | null, 
    user: NormalizedUser
  ): Promise<Asset> {
    const asset = await AssetRepository.findById(id);
    if (!asset) throw new Error("Aset tidak ditemukan.");

    const requesterId = asset.updated_by || asset.created_by;

    // 1. Validasi Role & Departemen (Logic sama seperti sebelumnya)
    if (!isVerifikator(user) && !isAdmin(user)) {
      throw new Error("Hanya Verifikator yang dapat memverifikasi.");
    }
    if (asset.approval_status !== 'pending_delete') {
      throw new Error("Aset tidak dalam status pengajuan hapus.");
    }
    if (!isAdmin(user)) {
       // 1. Cek apakah department_name ada (tidak null/undefined)
       if (!user.department_name) {
         throw new Error("Data departemen Anda tidak ditemukan (null). Hubungi admin.");
       }

       // 2. Sekarang TypeScript tahu user.department_name pasti string
       const userDeptId = await AssetRepository.findDepartmentIdByName(user.department_name);
       
       if (asset.department_id !== userDeptId) {
         throw new Error("Anda tidak dapat memverifikasi aset departemen lain.");
       }
    }

    let updateData: Partial<Asset> = {};

    if (action === 'reject') {
      const activeStatusId = "1b2ccf3a-3b0a-4662-a742-cf52039d98d4"; 

      updateData = {
        approval_status: "approved", // Kembali normal
        status_id: activeStatusId,   // Fisik kembali Aktif
        revision_notes: `Verifikasi DITOLAK oleh ${user.email}. Alasan: ${notes}`,
        updated_by: user.user_id, 
        updated_at: new Date().toISOString()
      };
    } else {
      // LANJUT KE ADMIN
      updateData = {
        approval_status: "verified_delete", 
        revision_notes: `Diverifikasi oleh ${user.email}. Catatan: ${notes}`,
        updated_by: user.user_id, 
        updated_at: new Date().toISOString()
      };
    }

    const updatedAsset = await AssetRepository.update(id, updateData);

    if (action === 'reject') {
        // A. Kasus DITOLAK -> Info ke Teknisi
        if (requesterId) {
            void NotificationService.notifyUser({
                userId: requesterId,
                senderId: user.user_id,
                category: 'Asset',
                title: 'Penghapusan Aset Ditolak',
                message: `Permintaan hapus aset "${asset.name}" ditolak. Aset kembali aktif.`,
                notes: notes,
                link: `/assets/${id}`,
                type: 'warning'
            });
        }
    } else {
        // B. Kasus DISETUJUI (VERIFIED) -> Ada 2 Notifikasi
        // 1. Info ke ADMIN (Untuk Approval Final)
        void NotificationService.notifyRoles({
            roles: ["admin_diskominfo"], 
            senderId: user.user_id,
            category: 'Asset',
            title: 'Persetujuan Akhir Penghapusan',
            message: `Aset "${asset.name}" telah diverifikasi dan menunggu persetujuan pemusnahan.`,
            notes: notes,
            link: `/assets/${id}/delete-approval`,
            type: 'info'
        });

        // 2. Info ke TEKNISI (Status Update: "Sudah diverifikasi, tunggu admin ya")
        if (requesterId) {
            void NotificationService.notifyUser({
                userId: requesterId,
                senderId: user.user_id,
                category: 'Asset',
                title: 'Penghapusan Diverifikasi',
                message: `Permintaan Anda untuk aset "${asset.name}" telah diverifikasi dan diteruskan ke Admin Diskominfo.`,
                notes: notes,
                link: `/assets/${id}`, // Link view biasa
                type: 'success' // Hijau (tapi belum final) atau Info (Biru)
            });
        }
    }
    // 5. 🚀 AUDIT TRAIL
    void AuditService.log({
      user_id: user.user_id,
      user_name: user.name || user.email,
      user_email: user.email,
      action: "VERIFY", // Action khusus Verifikasi
      table_name: "asset",
      record_id: id,
      data_before: asset,        // Status: pending_delete
      data_after: updatedAsset,  // Status: approved ATAU verified_delete
      ip_address: user.ip_address || null
    });

    return updatedAsset;
  }

  static async approveDeleteRequest(
    id: string, 
    action: 'accept' | 'reject', 
    notes: string | null, 
    user: NormalizedUser
  ): Promise<Asset> {
    const asset = await AssetRepository.findById(id);
    if (!asset) throw new Error("Aset tidak ditemukan.");

    // 1. Validasi Admin
    if (!isAdmin(user)) throw new Error("Hanya Admin Diskominfo.");

    // 2. Validasi Status (Harus verified_delete)
    if (asset.approval_status !== 'verified_delete') {
      throw new Error("Permintaan belum diverifikasi verifikator.");
    }

    const verifierId = asset.updated_by;

    let updateData: Partial<Asset> = {};

    if (action === 'reject') {
      // KEMBALIKAN KE AKTIF (Batal Musnah)
      const activeStatusId = "1b2ccf3a-3b0a-4662-a742-cf52039d98d4"; 

      updateData = {
        approval_status: "approved", // Kembali normal
        status_id: activeStatusId,
        revision_notes: `Pemusnahan DITOLAK Admin ${user.email}. Alasan: ${notes}`,
        updated_by: user.user_id,
        updated_at: new Date().toISOString()
      };
    } else {
      // EKSEKUSI MUSNAH (Decomission)
      const decomissionId = "2541f5a5-0771-481b-91ac-5989b0100c86";

      updateData = {
        approval_status: "approved_delete", 
        status_id: decomissionId,    
        revision_notes: `Disetujui Musnah oleh ${user.email}. Ket: ${notes}`,
        updated_by: user.user_id,
        updated_at: new Date().toISOString()
      };
    }
    
    const updatedAsset = await AssetRepository.update(id, updateData);

    const targetUserIds = [asset.created_by, verifierId].filter(uid => uid) as string[];
    // Hapus duplikat (jika verifikator juga pembuatnya)
    const uniqueTargets = [...new Set(targetUserIds)];

    for (const targetId of uniqueTargets) {
        if (action === 'reject') {
            // Kasus DITOLAK
            void NotificationService.notifyUser({
                userId: targetId,
                senderId: user.user_id, // Admin
                category: 'Asset',
                title: 'Pemusnahan Aset Dibatalkan',
                message: `Admin menolak pemusnahan aset "${asset.name}". Aset dikembalikan ke status Aktif.`,
                notes: notes, // Alasan penolakan admin
                link: `/assets/${id}`,
                type: 'warning'
            });
        } else {
            // Kasus DISETUJUI (Final)
            void NotificationService.notifyUser({
                userId: targetId,
                senderId: user.user_id,
                category: 'Asset',
                title: 'Aset Resmi Dihapus',
                message: `Aset "${asset.name}" telah disetujui untuk dimusnahkan (Decommissioned) oleh Admin.`,
                notes: notes,
                link: `/assets/${id}`,
                type: 'error' // Merah (karena aset hilang/musnah)
            });
        }
    }
    // 6. 🚀 AUDIT TRAIL
    void AuditService.log({
      user_id: user.user_id,
      user_name: user.name || user.email,
      user_email: user.email,
      action: action === 'accept' ? 'APPROVE' : 'UPDATE', 
      table_name: "asset",
      record_id: id,
      data_before: asset,       // Status: verified_delete
      data_after: updatedAsset, // Status: approved_delete / approved
      ip_address: user.ip_address || null
    });

    return updatedAsset;
  }

  //mitra
  static async linkChange(
    assetId: string,
    payload: LinkChangeDto,
    user: NormalizedUser
  ): Promise<Partial<Asset> | null> { 
    
    const oldAsset = await AssetRepository.findById(assetId);
    // 1. Validasi Status
    const isAllowed = await AssetRepository.isStatusLinkable(payload.status_id);
    if (!isAllowed) {
      throw new Error(`Status ID '${payload.status_id}' tidak valid atau tidak diizinkan untuk integrasi ini.`);
    }

    // 2. Siapkan data update
    const dataToUpdate: Partial<Asset> = {
       status_id: payload.status_id,
       linked_change_id: payload.linked_change_id,
       revision_notes: payload.notes || `Ditautkan ke RFC oleh ${user.email}`
    };
    
    // 3. Panggil repo dan kembalikan data parsial
    const updatedAsset = await AssetRepository.linkAndUpdateStatus(assetId, dataToUpdate);

    if (oldAsset?.created_by) {
        void NotificationService.notifyUser({
            userId: oldAsset.created_by,
            senderId: user.user_id,
            category: 'Asset',
            title: 'Aset Terhubung ke Change Request',
            message: `Status aset "${oldAsset.name}" diperbarui karena adanya Change Request (RFC): ${payload.linked_change_id}.`,
            notes: payload.notes || null,
            link: `/assets/${assetId}`,
            type: 'warning' // Kuning (Perubahan)
        });
    }
    
    void AuditService.log({
       user_id: user.user_id,
       user_name: user.name || user.email,
       user_email: user.email,
       action: "UPDATE",
       table_name: "asset",
       record_id: assetId,
       data_before: oldAsset,      // Data sebelum
       data_after: updatedAsset,   // Data sesudah
       ip_address: user.ip_address || null
    });

    return updatedAsset;
  }

  static async bulkLinkChange(
    statusKey: 'in_use' | 'standby' | 'retired' | 'maintenance',
    payload: BulkLinkChangeDto,
    user: NormalizedUser
  ): Promise<Asset[]> {

    // 1. Mapping Status Key ke UUID
    const statusMap: Record<string, string> = {
      'in_use': ASSET_STATUS.IN_USE,
      'standby': ASSET_STATUS.STANDBY,
      'retired': ASSET_STATUS.RETIRED,
      'maintenance': ASSET_STATUS.MAINTENANCE
    };

    const targetStatusId = statusMap[statusKey];
    if (!targetStatusId) throw new Error("Status target tidak valid.");

    // 2. Validasi apakah status ini linkable (Opsional, tapi bagus untuk konsistensi)
    const isAllowed = await AssetRepository.isStatusLinkable(targetStatusId);
    if (!isAllowed) {
      throw new Error(`Status '${statusKey}' tidak diizinkan untuk integrasi Change Management.`);
    }

    // 3. Ambil Data Lama (Snapshot Before)
    const oldAssets = await AssetRepository.findManyByIds(payload.asset_ids);
    if (oldAssets.length === 0) throw new Error("Tidak ada aset valid yang ditemukan dari ID yang diberikan.");

    // 4. Siapkan Payload Update
    const dataToUpdate: Partial<Asset> = {
      status_id: targetStatusId,
      linked_change_id: payload.linked_change_id,
      revision_notes: payload.notes || `Bulk Update via RFC ${payload.linked_change_id} oleh ${user.email}`,
      updated_by: user.user_id,
      updated_at: new Date().toISOString()
    };

    // 5. Eksekusi Bulk Update
    const updatedAssets = await AssetRepository.updateMany(payload.asset_ids, dataToUpdate);

    // 6. Loop untuk Audit & Notifikasi (Per Aset)
    // Kita lakukan secara asinkron agar tidak memperlambat response API
    (async () => {
      for (const newAsset of updatedAssets) {
        const oldAsset = oldAssets.find(a => a.id === newAsset.id);
        
        // A. Notifikasi ke Pemilik Aset
        if (oldAsset?.created_by) {
          await NotificationService.notifyUser({
            userId: oldAsset.created_by,
            senderId: user.user_id,
            category: 'Asset',
            title: 'Status Aset Diperbarui (RFC)',
            message: `Status aset "${newAsset.name}" berubah menjadi ${statusKey.toUpperCase()} karena RFC: ${payload.linked_change_id}.`,
            link: `/assets/${newAsset.id}`,
            type: 'warning'
          });
        }

        // B. Audit Log
        await AuditService.log({
          user_id: user.user_id,
          user_name: user.name || user.email,
          user_email: user.email,
          action: "UPDATE",
          table_name: "asset",
          record_id: newAsset.id,
          data_before: oldAsset,
          data_after: newAsset,
          ip_address: user.ip_address || null
        });
      }
    })();

    return updatedAssets;
  }

  static async linkIncident(
  assetId: string,
  payload: LinkIncidentDto,
  user: NormalizedUser
): Promise<Partial<Asset> | null> {
  
  const oldAsset = await AssetRepository.findById(assetId);
  const isAllowed = await AssetRepository.isStatusLinkable(payload.status_id);
  if (!isAllowed) {
    throw new Error(`Status ID '${payload.status_id}' tidak valid atau tidak diizinkan untuk integrasi ini.`);
  }

  const dataToUpdate: Partial<Asset> = {
      status_id: payload.status_id,
      linked_incident_id: payload.linked_incident_id,
      revision_notes: payload.notes || `Ditautkan ke Insiden oleh ${user.email}` 
  };

  const updatedAsset = await AssetRepository.linkAndUpdateStatus(assetId, dataToUpdate);

  if (oldAsset?.created_by) {
        void NotificationService.notifyUser({
            userId: oldAsset.created_by,
            senderId: user.user_id,
            category: 'Asset',
            title: 'Insiden Dilaporkan (Internal)',
            message: `Insiden ${payload.linked_incident_id} dilaporkan pada aset "${oldAsset.name}" oleh staf internal.`,
            
            // ✅ PERBAIKAN DI SINI: Tambahkan || null
            notes: payload.notes || null,
            
            link: `/assets/${assetId}`,
            type: 'error' 
        });
  }
  void AuditService.log({
        user_id: user.user_id,
        user_name: user.name || user.email,
        user_email: user.email,
        action: "UPDATE",
        table_name: "asset",
        record_id: assetId,
        data_before: oldAsset,
        data_after: updatedAsset,
        ip_address: user.ip_address || null
    });

  return updatedAsset;
}

static async linkIncidentPublic(
  assetId: string,
  payload: LinkIncidentDto,
  ipAddress: string
): Promise<Partial<Asset> | null> {
  
  const oldAsset = await AssetRepository.findById(assetId);
  const isAllowed = await AssetRepository.isStatusLinkable(payload.status_id);
  if (!isAllowed) {
    throw new Error(`Status ID '${payload.status_id}' tidak valid atau tidak diizinkan untuk integrasi ini.`);
  }

  const dataToUpdate: Partial<Asset> = {
    status_id: payload.status_id,
    linked_incident_id: payload.linked_incident_id,
    revision_notes: payload.notes || `Ditautkan ke Insiden ${payload.linked_incident_id} via integrasi publik`
  };

  const updatedAsset = await AssetRepository.linkAndUpdateStatus(assetId, dataToUpdate);

  if (oldAsset?.created_by) {
        void NotificationService.notifyUser({
        userId: oldAsset.created_by,
        senderId: null, // System
        category: 'Asset',
        title: 'Insiden Baru dari Service Desk',
        message: `Sistem eksternal melaporkan insiden ${payload.linked_incident_id} pada aset "${oldAsset.name}".`,
        notes: payload.notes || null,
        link: `/assets/${assetId}`,
        type: 'error'
      });
    }

    void AuditService.log({
      user_id: '00000000-0000-0000-0000-000000000000', 
      user_name: 'Sistem Eksternal (Service Desk)',
      user_email: 'system@external',
      action: "UPDATE",
      table_name: "asset",
      record_id: assetId,
      data_before: oldAsset,
      data_after: updatedAsset,
      ip_address: ipAddress // 👈 Gunakan IP dari controller
    });

    return updatedAsset;
  }

  // src/modules/asset/asset.service.ts

  /**
   * 🆕 Ambil data penunjang untuk perencanaan maintenance
   */
  static async getMaintenancePlanningData(id: string, user: NormalizedUser) {
    const asset = await AssetRepository.findById(id);
    if (!asset) throw new Error("Aset tidak ditemukan.");

    if (!user.department_name) {
      throw new Error("Data departemen pengguna tidak tersedia di token SSO.");
    }
    const userDeptId = await AssetRepository.findDepartmentIdByName(user.department_name);

    if (!userDeptId) {
      throw new Error(`Departemen '${user.department_name}' tidak ditemukan di sistem aset.`);
    }

    if (!isAdmin(user) && asset.department_id !== userDeptId) {
      throw new Error("Anda tidak memiliki akses ke aset dinas lain.");
    }

    // 2. Ambil Data dari Repo
    const data = await AssetRepository.findForMaintenancePlanning(id);
    if (!data) throw new Error("Aset tidak ditemukan.");

    // 3. Cari Rekomendasi Tanggal
    // Cari 'target_date' paling dekat dari semua treatment yang ada
    let recommendedDate: string | null = null;
    let highestRiskLevel = 0;

    // Loop semua risiko
    if (data.risk && Array.isArray(data.risk)) {
      for (const r of data.risk) {
        // Cari level risiko tertinggi
        if (r.entry_level > highestRiskLevel) highestRiskLevel = r.entry_level;

        // Loop semua treatment di risiko ini
        if (r.risk_treatment && Array.isArray(r.risk_treatment)) {
          for (const t of r.risk_treatment) {
            if (t.target_date && t.status !== 'completed') {
              // Jika belum ada rekomendasi, atau tanggal ini lebih cepat dari yang ada
              if (!recommendedDate || new Date(t.target_date) < new Date(recommendedDate)) {
                recommendedDate = t.target_date;
              }
            }
          }
        }
      }
    }

    // 4. Kembalikan data + Rekomendasi
    return {
      asset: data,
      analysis: {
        total_active_risks: data.risk?.length || 0,
        highest_risk_level: highestRiskLevel,
        recommended_deadline: recommendedDate, // Verifikator sebaiknya menjadwalkan sebelum tgl ini
        is_urgent: highestRiskLevel >= 15 || (recommendedDate && new Date(recommendedDate) < new Date()) 
      }
    };
  }
}