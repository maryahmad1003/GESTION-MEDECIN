require('dotenv').config();

const path = require('path');
const fs = require('fs');

const { createMedecinApi } = require('./medecin-api');

const publicPath = path.join(__dirname, '../public');
const distPath = path.join(__dirname, '../dist/gestion-medecin/browser');
const staticPath = fs.existsSync(publicPath) ? publicPath : distPath;

const PORT = process.env.PORT || 8000;
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://postgres:Passer1234@db:5432/gestion_medecin';

const { start } = createMedecinApi({
  databaseUrl: DATABASE_URL,
  staticDir: fs.existsSync(staticPath) ? staticPath : undefined
});

start(PORT)
  .then(() => {
    console.log(`Backend disponible sur http://localhost:${PORT}`);
  })
  .catch(error => {
    console.error('Erreur au démarrage du backend :', error);
    process.exit(1);
  });
