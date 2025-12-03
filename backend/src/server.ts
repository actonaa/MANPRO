import 'dotenv/config'; 
import { app } from './app.js';

import "./modules/scheduler/maintenance.cron.js";

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`API Aset & Risiko berjalan di http://localhost:${port}`);
});