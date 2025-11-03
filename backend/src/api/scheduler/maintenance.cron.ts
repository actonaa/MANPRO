import cron from "node-cron";
import { supabase } from "../../config/supabaseClient.js";

// 🔁 Jalankan setiap jam 00:00 waktu server
cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Memeriksa jadwal pemeliharaan aset...");

  const today = new Date().toISOString().split("T")[0];

  // Ambil jadwal maintenance yang jatuh tempo hari ini
  const { data: logs, error } = await supabase
    .from("maintenance_logs")
    .select("id, asset_id")
    .eq("scheduled_date", today)
    .eq("status", "scheduled");

  if (error) {
    console.error("❌ Gagal memeriksa jadwal:", error.message);
    return;
  }

  if (!logs?.length) {
    console.log("✅ Tidak ada jadwal hari ini.");
    return;
  }

  for (const log of logs) {
    // Ubah status maintenance log
    await supabase
      .from("maintenance_logs")
      .update({ status: "in_progress" })
      .eq("id", log.id);

    // Update status aset jadi Maintenance
    await supabase
      .from("asset")
      .update({ status_id: "9ac09a40-f161-4181-a11c-b25beed5f4c0" }) // ID status: Maintenance
      .eq("id", log.asset_id);
  }

  console.log(`🔧 ${logs.length} aset masuk status Maintenance hari ini.`);
});
