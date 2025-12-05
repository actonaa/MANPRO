// src/scheduler/maintenance.cron.ts
import cron from 'node-cron';
import { MaintenanceService } from '../maintenance/maintenance.service.js';

// Jadwal: Setiap hari jam 00:01 dini hari
// Format: Minute Hour Day Month Weekday
cron.schedule('1 0 * * *', async () => {
  console.log('🕒 [CRON] Menjalankan Pengecekan Jadwal Maintenance Harian...');
  await MaintenanceService.autoStartDailyMaintenance();
});

console.log('✅ Scheduler Maintenance diaktifkan (Jalan setiap jam 00:01)');