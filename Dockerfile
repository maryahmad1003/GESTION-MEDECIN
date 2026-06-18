# Étape 1: Build de l'application Angular
FROM node:20-alpine AS angular-build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2: Image finale pour l'application (Node.js + Express + Angular)
FROM node:20-alpine

# Installer les outils nécessaires
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copier les fichiers du serveur
COPY server/ ./server/
COPY package*.json ./
RUN npm install --production

# Copier le build Angular (fichiers statiques)
COPY --from=angular-build /app/dist/gestion-medecin/browser ./public

# Copier le script d'entrée
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Créer le répertoire pour le schéma SQL
RUN mkdir -p /app/server/

# Installer pg CLI pour le entrypoint
RUN apk add --no-cache postgresql-client

# Exposer le port 8000
EXPOSE 8000

# Utiliser le script d'entrée
ENTRYPOINT ["docker-entrypoint.sh"]

# Commande par défaut
CMD ["node", "server/index.js"]
