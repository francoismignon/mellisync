# 🐝 Mellisync

> Application web de gestion de ruches pour apiculteurs professionnels et amateurs

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions)](https://github.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

**Projet de fin d'études** - Bachelier en Informatique de Gestion
**Année académique** : 2024-2025

---

## 📋 À propos

Mellisync est une application web moderne conçue pour simplifier la gestion quotidienne des ruches. Elle permet aux apiculteurs de suivre leurs ruchers, d'enregistrer les visites, de gérer les transhumances et d'accéder à des données météorologiques en temps réel.

### 🎯 Problématique

Les apiculteurs gèrent souvent leurs ruches avec des carnets papier ou des tableurs Excel dispersés, rendant difficile :
- Le suivi historique des interventions
- La planification selon les conditions météo
- La traçabilité des déplacements de ruches
- L'analyse des données à long terme

### ✨ Solution

Mellisync centralise toutes ces informations dans une interface intuitive, accessible sur mobile et desktop, avec :
- Scan de QR codes pour accès rapide aux ruches
- Météo locale en temps réel
- Historique complet des visites
- Gestion des transhumances
- Recommandations d'actions selon la période

---

## 🚀 Démo en ligne

**🔗 [Accéder à la démo](https://mellisync.francoiscloud.duckdns.org/)**

Utilisez le bouton **"Recruteur ? Testez en 1 clic"** pour explorer l'application sans inscription.

---

## 🛠️ Stack technique

### Backend
- **Runtime** : Node.js 22
- **Framework** : Express.js (TypeScript)
- **ORM** : Prisma
- **Base de données** : PostgreSQL 15
- **Authentification** : JWT (HttpOnly cookies)
- **Tests** : Jest

### Frontend
- **Framework** : React 18 + TypeScript
- **Routage** : React Router v7
- **UI Library** : Material-UI (MUI)
- **Styling** : TailwindCSS
- **Build** : Vite
- **HTTP Client** : Axios

### DevOps & Infrastructure
- **Containerisation** : Docker + Docker Compose
- **CI/CD** : GitHub Actions
- **Registry** : Docker Hub
- **Reverse Proxy** : Traefik
- **SSL** : Let's Encrypt

### APIs externes
- **Météo** : Open-Meteo API
- **QR Codes** : qrcode.js

---

## 📊 Fonctionnalités principales

### Gestion des ruchers
- ✅ Création de ruchers avec géolocalisation
- ✅ Affichage carte des ruchers
- ✅ Météo locale en temps réel par rucher
- ✅ Statistiques (nombre de ruches actives/inactives)

### Gestion des ruches
- ✅ Création/modification de ruches
- ✅ Génération automatique de QR codes uniques
- ✅ Scan QR pour accès rapide à une ruche
- ✅ Statuts : ACTIVE, INACTIVE, SWARM, DEAD
- ✅ Historique complet des visites

### Transhumance
- ✅ Déplacement de ruches entre ruchers
- ✅ Historique des transhumances avec dates
- ✅ Motifs : ACQUISITION, PRODUCTION, WINTERING, POLLINATION, TREATMENT, INSPECTION

### Visites & Actions
- ✅ Enregistrement des visites avec météo capturée
- ✅ 18 actions métier apicoles (couvain, nourrissement, traitement varroa, etc.)
- ✅ Restrictions intelligentes selon période/météo/température
- ✅ Actions CYCLE (choix multiples) et INCREMENT (valeurs numériques)

### Météo intelligente
- ✅ Données météo temps réel (Open-Meteo API)
- ✅ Température, précipitations, code WMO
- ✅ Restrictions d'actions selon conditions (pluie/orage)

### Sécurité
- ✅ Authentification JWT (HttpOnly cookies)
- ✅ RBAC (Role-Based Access Control)
- ✅ Isolation totale des données par utilisateur
- ✅ Protection CSRF
- ✅ Validation des entrées (backend + frontend)

---

## 🏗️ Architecture

```
mellisync/
├── client/                 # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   └── config/        # Configuration
│   └── Dockerfile
│
├── server/                # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/   # Logique métier
│   │   ├── services/      # Services applicatifs
│   │   ├── repositories/  # Accès données (Prisma)
│   │   ├── middleware/    # Auth, validation
│   │   └── routes/        # Définition routes API
│   ├── prisma/
│   │   ├── schema.prisma  # Modèle de données
│   │   └── seed.ts        # Données initiales
│   ├── __tests__/         # Tests unitaires/intégration
│   └── Dockerfile
│
└── .github/workflows/     # Pipeline CI/CD
```

---

## 🚢 CI/CD Pipeline

Chaque push sur `master` déclenche automatiquement :

1. **Tests** : Exécution suite de tests backend
2. **Build** : Compilation TypeScript → JavaScript
3. **Containerisation** : Build images Docker (frontend + backend)
4. **Push** : Envoi vers Docker Hub
5. **Déploiement** : Déploiement automatique sur serveur de production

---

## 👨‍💻 Contact

**François Mignon**
- 🌐 mignon.francois@gmail.com
---

**⭐ Si ce projet vous intéresse, n'hésitez pas à lui donner une étoile !**
