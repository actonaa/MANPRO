import { supabase } from "../../config/supabaseClient.js";

export class MaintenanceService {
  /** 🔹 Membuat jadwal pemeliharaan (oleh verifikator_dinas) */
  static async createSchedule(assetId: string, payload: any, user: any) {
    if (user.role_name !== "verifikator_dinas") {
      throw new Error("Hanya verifikator dinas yang dapat membuat jadwal pemeliharaan.");
    }

    // Pastikan aset valid dan milik departemen user
    const { data: asset, error: assetErr } = await supabase
      .from("asset")
      .select("id, department_id")
      .eq("id", assetId)
      .single();

    if (assetErr || !asset) throw new Error("Aset tidak ditemukan.");
    if (asset.department_id !== user.department_id)
      throw new Error("Anda tidak memiliki akses ke aset dinas lain.");

    // Simpan jadwal baru
    const { data, error } = await supabase
      .from("maintenance_logs")
      .insert([
        {
          asset_id: assetId,
          type: payload.type || "terjadwal",
          scheduled_date: payload.scheduled_date,
          vendor: payload.vendor || null,
          cost: payload.cost || null,
          notes: payload.notes || null,
          status: "scheduled",
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /** 🔹 Lihat semua jadwal pemeliharaan per aset */
  static async getByAsset(assetId: string, user: any) {
    // Pastikan aset ada
    const { data: asset, error: assetErr } = await supabase
      .from("asset")
      .select("department_id")
      .eq("id", assetId)
      .single();

    if (assetErr || !asset) throw new Error("Aset tidak ditemukan.");

    // Verifikator hanya boleh lihat milik dinasnya
    if (
      user.role_name === "verifikator_dinas" &&
      asset.department_id !== user.department_id
    ) {
      throw new Error("Anda tidak memiliki akses ke jadwal pemeliharaan dinas lain.");
    }

    // Admin & Auditor bisa lihat semua
    const { data, error } = await supabase
      .from("maintenance_logs")
      .select("*")
      .eq("asset_id", assetId)
      .order("scheduled_date", { ascending: true });

    if (error) throw error;
    return data;
  }

  /** 🔹 Update jadwal pemeliharaan */
  static async update(id: string, payload: any, user: any) {
    const { data: log, error: logErr } = await supabase
      .from("maintenance_logs")
      .select("asset_id")
      .eq("id", id)
      .single();

    if (logErr || !log) throw new Error("Jadwal pemeliharaan tidak ditemukan.");

    const { data: asset, error: assetErr } = await supabase
      .from("asset")
      .select("department_id")
      .eq("id", log.asset_id)
      .single();

    if (assetErr || !asset) throw new Error("Aset tidak ditemukan.");
    if (
      user.role_name === "verifikator_dinas" &&
      asset.department_id !== user.department_id
    ) {
      throw new Error("Anda tidak memiliki akses untuk mengubah jadwal aset dinas lain.");
    }

    const { data, error } = await supabase
      .from("maintenance_logs")
      .update({
        scheduled_date: payload.scheduled_date,
        vendor: payload.vendor,
        cost: payload.cost,
        notes: payload.notes,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /** 🔹 Tandai pemeliharaan selesai */
  static async complete(id: string, payload: any, user: any) {
    const { data: log, error: logErr } = await supabase
      .from("maintenance_logs")
      .select("asset_id")
      .eq("id", id)
      .single();

    if (logErr || !log) throw new Error("Jadwal pemeliharaan tidak ditemukan.");

    const { data: asset, error: assetErr } = await supabase
      .from("asset")
      .select("department_id")
      .eq("id", log.asset_id)
      .single();

    if (assetErr || !asset) throw new Error("Aset tidak ditemukan.");

    if (
      user.role_name === "verifikator_dinas" &&
      asset.department_id !== user.department_id
    ) {
      throw new Error("Anda tidak memiliki akses untuk menyelesaikan jadwal dinas lain.");
    }

    // Update log + tandai selesai
    const { data, error } = await supabase
      .from("maintenance_logs")
      .update({
        completion_date: payload.completion_date || new Date().toISOString(),
        notes: payload.notes || null,
        status: "completed",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Setelah selesai → ubah aset jadi "Aktif"
    await supabase
      .from("asset")
      .update({ status_id: "1b2ccf3a-3b0a-4662-a742-cf52039d98d4" })
      .eq("id", log.asset_id);

    return data;
  }

  /** 🔹 Hapus jadwal (oleh admin atau verifikator dinas) */
  static async delete(id: string, user: any) {
    const { data: log, error: logErr } = await supabase
      .from("maintenance_logs")
      .select("asset_id")
      .eq("id", id)
      .single();

    if (logErr || !log) throw new Error("Jadwal pemeliharaan tidak ditemukan.");

    const { data: asset, error: assetErr } = await supabase
      .from("asset")
      .select("department_id")
      .eq("id", log.asset_id)
      .single();

    if (assetErr || !asset) throw new Error("Aset tidak ditemukan.");
    if (
      user.role_name === "verifikator_dinas" &&
      asset.department_id !== user.department_id
    ) {
      throw new Error("Anda tidak memiliki akses untuk menghapus jadwal dinas lain.");
    }

    const { error } = await supabase.from("maintenance_logs").delete().eq("id", id);
    if (error) throw error;
    return { message: "Jadwal pemeliharaan berhasil dihapus." };
  }
}
