# Gestion des médecins

Application Angular de gestion des médecins pour une clinique privée, avec backend Node.js et base PostgreSQL.

## Objectif

Cette version permet de :

- créer un médecin depuis un formulaire Angular ;
- consulter la liste des médecins enregistrés ;
- modifier ou supprimer un médecin depuis la liste ;
- centraliser les données dans un service Angular ;
- persister les données dans PostgreSQL via une API Express.

## Fonctionnement

- La page d’accueil sert à créer un nouveau médecin.
- Après enregistrement, le formulaire se vide automatiquement.
- La liste affiche tous les médecins présents dans la base.
- Si aucun médecin n’a encore été créé, un message de liste vide s’affiche.
- Chaque ligne de la liste propose deux actions sous forme d’icônes :
  - modifier ;
  - supprimer.
- Le code professionnel est généré automatiquement par le backend.

## Champs du formulaire

Le formulaire contient les champs demandés :

- Matricule ;
- Nom ;
- Prénom ;
- Sexe ;
- Spécialité ;
- Téléphone ;
- Email ;
- Années d’expérience ;
- Disponibilité.

## Structure du projet

- `src/app/models/medecin.ts` : modèle TypeScript du médecin.
- `src/app/services/medecin.service.ts` : service Angular qui communique avec l’API.
- `src/app/components/medecin-form/` : composant de saisie.
- `src/app/components/medecin-list/` : composant d’affichage.
- `server/medecin-api.js` : API Express partagée.
- `backend-medecin/src/server.js` : backend Node.js pour le développement local.
- `server/index.js` : backend Node.js utilisé par Docker avec l’application Angular buildée.

## Lancer le projet

### 1. Installer les dépendances

À la racine du projet :

```bash
npm install
```

Si tu veux utiliser aussi le dossier backend dédié :

```bash
cd backend-medecin
npm install
```

### 2. Préparer PostgreSQL

Créer la base `gestion_medecin`, puis lancer le script SQL :

```bash
npm run setup-db
```

Le schéma crée la table `medecins` avec les contraintes de base.

### 3. Lancer le backend

En développement local :

```bash
npm run backend
```

Le backend écoute sur `http://localhost:3001`.

### 4. Lancer l’application Angular

Dans un autre terminal :

```bash
npm start
```

L’application Angular est disponible sur `http://localhost:4200`.

### 5. Vérifier la compilation

```bash
npm run build
```

### 6. Lancer les tests

```bash
npm test
```

### Option Docker

Si tu veux démarrer la version conteneurisée complète :

```bash
docker compose up --build
```

L’application sera exposée sur `http://localhost:8000`.

## Réponses aux questions

### Question 4 : Intérêt d’utiliser un modèle dans Angular

Un modèle sert à définir la structure des données manipulées par l’application. Il permet de :

- typer correctement les objets ;
- éviter les erreurs de structure ;
- partager la même définition entre plusieurs composants ;
- rendre le code plus lisible et plus maintenable ;
- bénéficier de l’autocomplétion et de la sécurité de TypeScript.

### Question 8 : Rôle d’un service dans l’architecture Angular

Un service sert à centraliser la logique métier et le partage de données entre plusieurs composants. Dans ce projet, il permet de :

- communiquer avec l’API backend ;
- récupérer, ajouter, modifier et supprimer les médecins ;
- éviter de dupliquer la logique dans les composants ;
- séparer l’affichage de la gestion des données ;
- faciliter les tests et la maintenance.

## Vérification du cahier des charges

### Partie 1 : Création du projet

- Projet Angular nommé `gestion-medecin` : oui.
- Arborescence organisée avec modèles, services et composants : oui.

### Partie 2 : Modélisation des données

- Modèle `Medecin` complet : oui.
- Intérêt du modèle expliqué : oui.

### Partie 3 : Développement du service

- Service Angular pour gérer les médecins : oui.
- Ajout d’un médecin dans la collection : oui, via l’API et PostgreSQL.
- Récupération de l’ensemble des médecins : oui.
- Rôle du service expliqué : oui.

### Partie 4 : Formulaire de saisie

- Composant dédié à l’enregistrement : oui.
- Liaison entre les champs et les propriétés : oui.
- Validations demandées :
  - tous les champs obligatoires : oui ;
  - email valide : oui ;
  - années d’expérience >= 0 : oui.
- Bouton d’enregistrement : oui.
- Réinitialisation automatique du formulaire après enregistrement : oui.

### Partie 5 : Affichage des données

- Affichage sous forme de tableau : oui.
- Colonnes demandées présentes : oui.
- Icônes modifier et supprimer : oui.

## Remarque

La version finale combine :

- Angular pour l’interface utilisateur ;
- Node.js/Express pour l’API ;
- PostgreSQL pour la persistance ;
- un code professionnel généré automatiquement côté backend ;
- une liste vide au départ, puis alimentée après création d’un médecin.
