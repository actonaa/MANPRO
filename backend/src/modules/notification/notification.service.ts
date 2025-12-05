import { supabase } from "../../config/supabaseClient.js";
import { NotificationRepository } from "./notification.repository.js";
import type { CreateNotificationPayload, Notification, NotificationDetailResponse } from "./notification.model.js";
import { AssetRepository } from "../asset/asset.repository.js";
import { RiskRepository } from "../risk/risk.repository.js";
import { MaintenanceRepository } from "../maintenance/maintenance.repository.js"; // ✅ FIX: Import Maintenance
import { ScenarioRepository } from "../scenario/scenario.repository.js";

// Interface helper untuk parameter input (agar coding lebih rapi)
interface NotifyParams {
  senderId?: string | null; // Optional (default: null/system)
  category: Notification['category'];
  title: string;
  message: string;
  notes?: string | null;
  link?: string;
  type?: Notification['type']; // Default: info
}

interface NotifyUserParams extends NotifyParams {
  userId: string;
}

interface NotifyRolesParams extends NotifyParams {
  roles: string[];
}

export class NotificationService {

  /**
   * 🚀 Kirim Notifikasi ke SATU User Spesifik
   * Contoh: Verifikator menolak aset User A (User A dapat notif)
   */
  static async notifyUser(params: NotifyUserParams) {
    const payload: CreateNotificationPayload = {
      user_id: params.userId,
      sender_id: params.senderId || null,
      category: params.category,
      title: params.title,
      message: params.message,
      notes: params.notes || null,
      link_target: params.link || null,
      type: params.type || 'info',
    };

    await NotificationRepository.createMany([payload]);
  }

  /**
   * 🚀 Kirim Notifikasi ke SEMUA User dalam Role tertentu
   * Contoh: User membuat aset (Semua Verifikator dapat notif)
   */
  static async notifyRoles(params: NotifyRolesParams) {
    try {
      // 1. Kumpulkan semua User ID dari role-role yang dituju
      let targetUserIds: string[] = [];
      
      for (const role of params.roles) {
        const ids = await NotificationRepository.findUserIdsByRole(role);
        targetUserIds = [...targetUserIds, ...ids];
      }

      // Hapus duplikat (jika 1 user punya 2 role yang sama-sama di-tag)
      targetUserIds = [...new Set(targetUserIds)];

      if (targetUserIds.length === 0) return;

      // 2. Buat payload untuk setiap user
      const notificationsPayload: CreateNotificationPayload[] = targetUserIds.map(userId => ({
        user_id: userId,
        sender_id: params.senderId || null,
        category: params.category,
        title: params.title,
        message: params.message,
        notes: params.notes || null,
        link_target: params.link || null,
        type: params.type || 'info'
      }));

      // 3. Simpan (Bulk Insert)
      await NotificationRepository.createMany(notificationsPayload);
      
    } catch (error) {
      console.error("Gagal kirim notifikasi role:", error);
      // Jangan throw error agar flow utama tidak putus
    }
  }

  // --- Fungsi Reader (Dipanggil Controller) ---
  static async getMyNotifications(userId: string) {
    return NotificationRepository.findByUserId(userId);
  }

/**
   * 🆕 Get Detail Notifikasi (LENGKAP SEMUA MODUL)
   */
  static async getById(id: string, userId: string): Promise<NotificationDetailResponse> {
    // 1. Ambil data notifikasi dasar
    const notification = await NotificationRepository.findById(id, userId);
    if (!notification) {
      throw new Error("Notifikasi tidak ditemukan atau Anda tidak memiliki akses.");
    }

    // 2. Siapkan object response
    const response: NotificationDetailResponse = { ...notification };

    // 3. Ambil Info Sender (Petugas) dari view v_auth_users
    if (notification.sender_id) {
      const { data: senderUser} = await supabase
        .from("user")
        .select("name, role_id")
        .eq("user_id", notification.sender_id)
        .single();
      
      if (senderUser) {
        response.sender_name = senderUser.name;

        // B. Cari Role di tabel public.role (Jika user punya role_id)
        if (senderUser.role_id) {
           const { data: roleData } = await supabase
             .from("role")
             .select("role_name")
             .eq("role_id", senderUser.role_id)
             .single();
           
           if (roleData) {
             response.sender_role = roleData.role_name;
           }
        }
      } else {
         console.warn(`Sender ID ${notification.sender_id} tidak ditemukan di tabel user.`);
      }
    }

    // 4. Ambil Info Entitas Terkait berdasarkan Kategori
    if (notification.link_target) {
      // Parsing ID dari URL link_target
      const parts = notification.link_target.split('/');
      const entityId = parts[parts.length - 1]; 

      // ✅ FIX: Validasi entityId agar tidak undefined
      if (entityId) {
        try {
          // --- KATEGORI: ASSET ---
          if (notification.category === 'Asset') {
             const asset = await AssetRepository.findById(entityId);
             if (asset) {
               response.related_entity = {
                 name: asset.name,
                 code: asset.barcode,
                 status: asset.approval_status 
               };
             }

          // --- KATEGORI: RISK ---
          } else if (notification.category === 'Risk') {
             const risk = await RiskRepository.findById(entityId);
             if (risk) {
               response.related_entity = {
                 name: risk.title || "Risiko Tanpa Judul",
                 code: `RISK-${risk.entry_level}`, 
                 status: risk.approval_status
               };
             }

          // --- KATEGORI: MAINTENANCE ---
          } else if (notification.category === 'Maintenance') {
             const maintenance = await MaintenanceRepository.findById(entityId);
             if (maintenance) {
               const assetName = maintenance.asset?.name || 'Aset';
               response.related_entity = {
                 name: `Pemeliharaan ${maintenance.type}: ${assetName}`,
                 code: maintenance.type, 
                 status: maintenance.status 
               };
             }

          // --- KATEGORI: SCENARIO ---
          } else if (notification.category === 'Scenario') {
             const scenario = await ScenarioRepository.findById(entityId);
             if (scenario) {
               response.related_entity = {
                 name: scenario.name,
                 code: "SCENARIO",
                 status: "Active" 
               };
             }
          }

        } catch (error) {
          console.warn(`Gagal mengambil detail entitas untuk notifikasi ${id}:`, error);
        }
      }
    }

    return response;
  }

  static async markRead(id: string) {
    return NotificationRepository.markAsRead(id);
  }
  
  static async markAllRead(userId: string) {
    return NotificationRepository.markAllRead(userId);
  }

  static async delete(id: string, userId: string) {
    return NotificationRepository.delete(id, userId);
  }

  static async deleteAll(userId: string) {
    return NotificationRepository.deleteAll(userId);
  }
}