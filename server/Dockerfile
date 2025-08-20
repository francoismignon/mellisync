# syntax=docker/dockerfile:1
  FROM node:22-alpine

  WORKDIR /app

  # Copier les fichiers de package et prisma schema en premier (pour le cache Docker)
  COPY package*.json ./
  COPY prisma/ ./prisma/

  # Installer SEULEMENT les dépendances de production + générer client
  RUN npm ci --omit=dev

  # Copier le JavaScript compilé
  COPY dist/ ./dist/

  # Exposer le port
  EXPOSE 3000

  # Démarrer l'application
  CMD ["npm", "start"]