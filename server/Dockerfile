# syntax=docker/dockerfile:1
  FROM node:22-alpine

  WORKDIR /app

  # Copier les fichiers de package en premier (pour le cache Docker)
  COPY package*.json ./

  # Installer SEULEMENT les dépendances de production
  RUN npm ci --omit=dev

  # Copier le JavaScript compilé + Prisma
  COPY dist/ ./dist/
  COPY prisma/ ./prisma/

  # Générer le client Prisma
  RUN npx prisma generate

  # Exposer le port
  EXPOSE 3000

  # Démarrer l'application
  CMD ["npm", "start"]