import express from 'express';
import cors from "cors";
import { fileURLToPath } from 'url';
import path from 'path';
import YAML from 'yamljs'; 
import swaggerUi from 'swagger-ui-express';
import mainRouter from './modules/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// 2. Load file YAML
const swaggerDocument = YAML.load(path.join(__dirname, './docs/openapi.yaml'));

const SWAGGER_CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";
const SWAGGER_BUNDLE_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js";
const SWAGGER_PRESET_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js";

app.use(
  '/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument, {
    customCssUrl: SWAGGER_CSS_URL,
    customJs: [SWAGGER_BUNDLE_URL, SWAGGER_PRESET_URL],
    customSiteTitle: "API Asset & Risk Management", // Judul Tab Browser
    swaggerOptions: {
      persistAuthorization: true, // Agar token tidak hilang saat refresh
    }
  })
);

app.get('/', (req, res) => {
  res.send('API Manajemen Aset & Risiko Aktif!');
});

// Rute utama (health check)
app.get('/api', (req, res) => {
  res.send('API Manajemen Aset & Risiko Aktif!');
});

// 🚀 Gunakan router utama untuk semua rute modul
app.use('/api', mainRouter);

app.use(errorMiddleware);

export { app };