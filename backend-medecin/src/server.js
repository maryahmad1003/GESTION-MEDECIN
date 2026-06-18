require('dotenv').config();

const { createMedecinApi } = require('../../server/medecin-api');

const PORT = process.env.PORT || 3001;
const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://postgres:Passer1234@localhost:5432/gestion_medecin';

const { start } = createMedecinApi({
  databaseUrl: DATABASE_URL
});

start(PORT)
  .then(() => {
    console.log(`API backend-medecin disponible sur http://localhost:${PORT}`);
  })
  .catch(error => {
    console.error('Erreur au démarrage du backend-medecin :', error);
    process.exit(1);
  });
