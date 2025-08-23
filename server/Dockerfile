# syntax=docker/dockerfile:1
FROM node:22-alpine

WORKDIR /app

# Installer les dépendances nécessaires pour Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Dire à Puppeteer d'utiliser le Chromium installé
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

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