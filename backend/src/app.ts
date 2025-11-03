import express from 'express';
import 'dotenv/config';
import cors from "cors";
import assetRoutes from './api/asset/asset.route.js';
import riskRoutes from './api/risk/risk.route.js';
import maintenanceRoutes from "./api/maintenancelogs/maintenance.route.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


// Rute utama
app.get('/api', (req, res) => {
  res.send('API Manajemen Aset & Risiko Aktif!');
});


// rute aset
app.use('/api/assets', assetRoutes);

// rute risiko
app.use('/api/risks', riskRoutes);

//rute maintenenace
app.use("/api/maintenance", maintenanceRoutes);

// 🕐 Jalankan CRON otomatis setiap hari
import "./scheduler/maintenance.cron.js";


app.listen(port, () => {
  console.log(`API Aset & Risiko berjalan di http://localhost:${port}`);
});