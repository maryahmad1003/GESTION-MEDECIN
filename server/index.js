require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/gestion_medecin'
});

pool.on('connect', () => {
  console.log('Connecté à PostgreSQL');
});

app.get('/api/medecins', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM medecins ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/medecins', async (req, res) => {
  try {
    const { matricule, code, nom, prenom, sexe, specialite, telephone, email, experience, disponibilite } = req.body;
    const result = await pool.query(
      `INSERT INTO medecins (matricule, code, nom, prenom, sexe, specialite, telephone, email, experience, disponibilite)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [matricule, code, nom, prenom, sexe, specialite, telephone, email, experience, disponibilite]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend disponible sur http://localhost:${PORT}`);
});
