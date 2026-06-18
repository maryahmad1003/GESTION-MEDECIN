const fs = require('fs');
const path = require('path');

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const REQUIRED_FIELDS = [
  'matricule',
  'nom',
  'prenom',
  'sexe',
  'specialite',
  'telephone',
  'email',
  'experience',
  'disponibilite'
];

const SEXE_VALUES = new Set(['Masculin', 'Féminin']);
const DISPONIBILITE_VALUES = new Set(['Disponible', 'Non disponible']);

function createMedecinApi({
  databaseUrl,
  staticDir
}) {
  const app = express();
  const pool = new Pool({
    connectionString: databaseUrl
  });

  app.use(cors());
  app.use(express.json());

  pool.on('connect', () => {
    console.log('Connecté à PostgreSQL');
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/medecins', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM medecins ORDER BY id');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/medecins/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Identifiant invalide.' });
      }

      const result = await pool.query('SELECT * FROM medecins WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Médecin introuvable.' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/medecins', async (req, res) => {
    const validation = validateMedecinBody(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const insertedResult = await client.query(
        `INSERT INTO medecins (
          matricule,
          code,
          nom,
          prenom,
          sexe,
          specialite,
          telephone,
          email,
          experience,
          disponibilite
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          validation.data.matricule,
          '',
          validation.data.nom,
          validation.data.prenom,
          validation.data.sexe,
          validation.data.specialite,
          validation.data.telephone,
          validation.data.email,
          validation.data.experience,
          validation.data.disponibilite
        ]
      );

      const insertedMedecin = insertedResult.rows[0];
      const generatedCode = buildMedecinCode(insertedMedecin.id);

      const updatedResult = await client.query(
        'UPDATE medecins SET code = $1 WHERE id = $2 RETURNING *',
        [generatedCode, insertedMedecin.id]
      );

      await client.query('COMMIT');
      res.status(201).json(updatedResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  });

  app.put('/api/medecins/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Identifiant invalide.' });
      }

      const validation = validateMedecinBody(req.body);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const result = await pool.query(
        `UPDATE medecins
         SET matricule = $1,
             code = COALESCE(NULLIF($2, ''), code),
             nom = $3,
             prenom = $4,
             sexe = $5,
             specialite = $6,
             telephone = $7,
             email = $8,
             experience = $9,
             disponibilite = $10
         WHERE id = $11
         RETURNING *`,
        [
          validation.data.matricule,
          normalizeText(req.body.code),
          validation.data.nom,
          validation.data.prenom,
          validation.data.sexe,
          validation.data.specialite,
          validation.data.telephone,
          validation.data.email,
          validation.data.experience,
          validation.data.disponibilite,
          id
        ]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Médecin introuvable.' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/medecins/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Identifiant invalide.' });
      }

      const result = await pool.query('DELETE FROM medecins WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Médecin introuvable.' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  if (staticDir) {
    app.use(express.static(staticDir));

    app.get('/{*any}', (req, res) => {
      const indexPath = path.join(staticDir, 'index.html');

      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
        return;
      }

      res.status(404).json({
        error: 'Application non buildée. Lancez "npm run build" d’abord.'
      });
    });
  }

  app.use((req, res) => {
    res.status(404).json({ error: 'Route introuvable.' });
  });

  async function ensureSchema() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS medecins (
        id SERIAL PRIMARY KEY,
        matricule VARCHAR(100) NOT NULL,
        code VARCHAR(100) NOT NULL,
        nom VARCHAR(255) NOT NULL,
        prenom VARCHAR(255) NOT NULL,
        sexe VARCHAR(20) NOT NULL CHECK (sexe IN ('Masculin', 'Féminin')),
        specialite VARCHAR(255) NOT NULL,
        telephone VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        experience INTEGER NOT NULL DEFAULT 0 CHECK (experience >= 0),
        disponibilite VARCHAR(50) NOT NULL CHECK (disponibilite IN ('Disponible', 'Non disponible')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      ALTER TABLE medecins
      ADD COLUMN IF NOT EXISTS code VARCHAR(100) NOT NULL DEFAULT '';
    `);

    await pool.query(`
      UPDATE medecins
      SET code = 'CP-' || LPAD(id::text, 4, '0')
      WHERE code IS NULL OR code = '';
    `);
  }

  async function start(port) {
    await ensureSchema();

    return new Promise((resolve, reject) => {
      const server = app.listen(port, () => resolve(server));
      server.on('error', reject);
    });
  }

  return {
    app,
    pool,
    start
  };
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function buildMedecinCode(id) {
  return `CP-${String(id).padStart(4, '0')}`;
}

function validateMedecinBody(body) {
  const missingFields = REQUIRED_FIELDS.filter(field => {
    const value = body[field];
    return value === undefined || value === null || `${value}`.trim() === '';
  });

  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Champs obligatoires manquants : ${missingFields.join(', ')}`
    };
  }

  const matricule = normalizeText(body.matricule);
  const nom = normalizeText(body.nom);
  const prenom = normalizeText(body.prenom);
  const sexe = normalizeText(body.sexe);
  const specialite = normalizeText(body.specialite);
  const telephone = normalizeText(body.telephone);
  const email = normalizeText(body.email);
  const disponibilite = normalizeText(body.disponibilite);
  const experience = Number(body.experience);

  if (!SEXE_VALUES.has(sexe)) {
    return {
      valid: false,
      error: 'Le sexe doit être Masculin ou Féminin.'
    };
  }

  if (!DISPONIBILITE_VALUES.has(disponibilite)) {
    return {
      valid: false,
      error: 'La disponibilité doit être Disponible ou Non disponible.'
    };
  }

  if (!isValidEmail(email)) {
    return {
      valid: false,
      error: "L'adresse email doit être valide."
    };
  }

  if (!Number.isInteger(experience) || experience < 0) {
    return {
      valid: false,
      error: 'Le nombre d’années doit être supérieur ou égal à 0.'
    };
  }

  return {
    valid: true,
    data: {
      matricule,
      nom,
      prenom,
      sexe,
      specialite,
      telephone,
      email,
      experience,
      disponibilite
    }
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = {
  createMedecinApi
};
