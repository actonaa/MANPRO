import { supabase } from "../../config/supabaseClient.js";

export class NotificationService {
  /**
   * Kirim notifikasi ke user tertentu
   */
  static async notifyUser(
    userId: string,
    message: string,
    type: string = "info",
    link_target: string | null = null
  ): Promise<void> {
    try {
      await supabase.from("notifications").insert([
        {
          user_id: userId,
          message,
          type,
          link_target,
        },
      ]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Gagal mengirim notifikasi user:", err.message);
      } else {
        console.error("Gagal mengirim notifikasi user: error tidak dikenal");
      }
    }
  }

  /**
   * Kirim notifikasi ke semua user dengan role tertentu
   */
  static async notifyRoles(
    roles: string[],
    message: string,
    type: string = "info",
    link_target: string | null = null
  ): Promise<void> {
    try {
      // Ambil user berdasarkan role_name
      const { data: users, error } = await supabase
        .from("users")
        .select("id, role_name")
        .in("role_name", roles);

      if (error) throw error;
      if (!users || users.length === 0) return;

      const inserts = users.map((u) => ({
        user_id: u.id,
        message,
        type,
        link_target,
      }));

      await supabase.from("notifications").insert(inserts);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Gagal mengirim notifikasi role:", err.message);
      } else {
        console.error("Gagal mengirim notifikasi role: error tidak dikenal");
      }
    }
  }

  /**
   * Kirim notifikasi ke semua user dalam satu departemen
   */
  static async notifyDepartment(
    department_id: string,
    message: string,
    type: string = "info"
  ): Promise<void> {
    try {
      const { data: users, error } = await supabase
        .from("users")
        .select("id")
        .eq("department_id", department_id);

      if (error) throw error;
      if (!users || users.length === 0) return;

      const inserts = users.map((u) => ({
        user_id: u.id,
        message,
        type,
      }));

      await supabase.from("notifications").insert(inserts);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Gagal mengirim notifikasi departemen:", err.message);
      } else {
        console.error("Gagal mengirim notifikasi departemen: error tidak dikenal");
      }
    }
  }
}
