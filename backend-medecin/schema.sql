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
