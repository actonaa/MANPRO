// src/modules/notification/notification.repository.ts
import { supabase } from "../../config/supabaseClient.js";
import type { Notification, CreateNotificationPayload } from "./notification.model.js";

export class NotificationRepository {

  /**
   * Mencari daftar User ID berdasarkan nama Role
   * (Digunakan untuk broadcast notifikasi ke divisi tertentu)
   */
  static async findUserIdsByRole(roleName: string): Promise<string[]> {
    // LANGKAH 1: Cari ID Role terlebih dahulu
    // Kita query tabel 'role' secara terpisah
    const { data: roleData, error: roleError } = await supabase
      .from("role") // Pastikan tabel ini ada (meski dari FDW)
      .select("role_id")
      .eq("role_name", roleName)
      .single();

    if (roleError || !roleData) {
      // Jangan error fatal, cukup log dan return kosong
      console.warn(`Role '${roleName}' tidak ditemukan di database User Management.`);
      return [];
    }

    const roleId = roleData.role_id;

    // LANGKAH 2: Cari User yang punya role_id tersebut
    // Kita query tabel 'user' tanpa melakukan join
    const { data: userData, error: userError } = await supabase
      .from("user") // Pastikan tabel ini ada (meski dari FDW)
      .select("user_id")
      .eq("role_id", roleId);

    if (userError) {
      console.error(`Gagal mengambil user untuk roleId ${roleId}:`, userError.message);
      return [];
    }
    
    // Mapping hasilnya
    return userData.map((u: any) => u.user_id);
  }

  /**
   * Simpan banyak notifikasi sekaligus (Bulk Insert)
   */
  static async createMany(payloads: CreateNotificationPayload[]): Promise<void> {
    if (payloads.length === 0) return;
    
    const { error } = await supabase
      .from("notifications")
      .insert(payloads);

    if (error) {
      console.error("Gagal menyimpan notifikasi:", error.message);
    }
  }

  /**
   * Ambil notifikasi milik user tertentu
   */
  static async findByUserId(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(50); // Batasi 50 notifikasi terbaru

    if (error) throw error;
    return data || [];
  }

  /**
   * Tandai satu notifikasi sudah dibaca
   */
  static async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
      
    if (error) throw error;
  }
  
  /**
   * Tandai SEMUA notifikasi user sudah dibaca
   */
  static async markAllRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false); // Hanya update yang belum dibaca
      
    if (error) throw error;
  }

  static async delete(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id)
      .eq("user_id", userId); // 🔒 Security Check

    if (error) throw error;
  }

  /**
   * 🆕 Hapus SEMUA notifikasi milik user tertentu
   */
  static async deleteAll(userId: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("user_id", userId); // 🔒 Hapus semua milik user ini saja

    if (error) throw error;
  }
  
  static async findById(id: string, userId: string): Promise<Notification | null> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId) // 🔒 Hanya pemilik yang bisa lihat
      .single();

    if (error) {
      if (error.code !== 'PGRST116') console.error("Error findById notification:", error.message);
      return null;
    }
    return data;
  }
}