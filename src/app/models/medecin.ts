export type Sexe = 'Masculin' | 'Féminin';
export type Disponibilite = 'Disponible' | 'Non disponible';

export interface Medecin {
  id: number;
  matricule: string;
  code: string;
  nom: string;
  prenom: string;
  sexe: Sexe | '';
  specialite: string;
  telephone: string;
  email: string;
  experience: number;
  disponibilite: Disponibilite | '';
}
