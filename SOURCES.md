# Mellisync - Tracking des Sources Documentation

**Projet** : Application de gestion de ruches pour apiculteurs  
**Objectif** : Références pour dossier technique TFE  

## 📚 Standards et Spécifications

### HTTP Protocol
- **RFC 7231 - HTTP/1.1 Semantics and Content**
  - URL : https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.1
  - Section : 4.3.1 GET
  - Citation : "A payload within a GET request message has no defined semantics"
  - **Utilisé dans** : 
    - `server/index.ts:31` - Route `app.post("/api/hives", HiveController.create)`
    - `client/src/pages/Apiary.tsx:fetchHives()` - Requête GET avec query params
    - **Justification** : Choix architecture GET (query params) vs POST (body params)

## 🔧 Technologies et Frameworks

### React
- **Source** : À documenter
- **Utilisé dans** : Frontend complet
- **Version** : À documenter

### Express.js
- **Source** : À documenter  
- **Utilisé dans** : `server/index.ts`, controllers, routes
- **Version** : À documenter

### Prisma ORM
- **Source** : https://www.prisma.io/docs (Documentation officielle)
- **Best Practices** : https://www.prisma.io/docs/tags/best-practices
- **Utilisé dans** : Services, modèles, migrations
- **Version** : À documenter

### Material-UI / MUI
- **Source** : Documentation officielle (abandonné en cours de projet)
- **Utilisé dans** : Composants frontend (phases 1-8, puis supprimé)
- **Décision** : Abandon pour HTML pur + Tailwind

### Tailwind CSS
- **Source** : À documenter
- **Utilisé dans** : Styling frontend (phases 9+)
- **Version** : À documenter

## 🏗️ Architecture et Patterns

### REST API Design
- **Zalando RESTful API Guidelines**
  - URL : https://opensource.zalando.com/restful-api-guidelines/
  - GitHub : https://github.com/zalando/restful-api-guidelines
  - **Utilisé dans** : 
    - Architecture routes flat `/api/hives?apiaryId=123`
    - Décision RBAC "Implicit Filtering"
    - **Justification** : Routes flat vs nested pour scalabilité

### MVC Pattern
- **Source** : À documenter
- **Utilisé dans** : 
  - `server/controllers/` - Controllers
  - `server/services/` - Services (logique métier)
  - Architecture séparation responsabilités

## 🔐 Sécurité et RBAC

### Role-Based Access Control (RBAC)
- **Source** : À documenter
- **Utilisé dans** :
  - `server/services/HiveService.ts` - Filtrage par userId
  - `server/services/ApiaryService.ts` - Ownership verification
  - **Justification** : Sécurité multi-tenant

## 📦 DevOps et Déploiement

### Docker
- **Source** : Documentation officielle Docker
- **Utilisé dans** : 
  - `Dockerfile` - Multi-stage builds
  - `docker-compose.yml` - Orchestration dev/prod

### GitHub Actions
- **Source** : Documentation GitHub Actions
- **Utilisé dans** : 
  - `.github/workflows/` - CI/CD pipeline
  - Déploiement automatique

### Traefik
- **Source** : Documentation Traefik
- **Utilisé dans** : 
  - Reverse proxy HTTPS
  - Let's Encrypt automatique

## 🗄️ Base de Données

### PostgreSQL
- **Source** : Documentation PostgreSQL
- **Utilisé dans** : 
  - Base de données principale
  - Gestion enums, relations

### Prisma Schema Design
- **Source** : Documentation Prisma
- **Utilisé dans** :
  - `prisma/schema.prisma` - Modélisation données
  - Relations many-to-many avec table pivot

## 📱 Frontend

### React Router
- **Source** : À documenter
- **Utilisé dans** : 
  - `client/src/App.tsx` - Navigation
  - Routes `/ruchers`, `/ruchers/nouveau`, etc.

### Axios HTTP Client
- **Source** : À documenter
- **Utilisé dans** : 
  - Communication frontend-backend
  - Gestion erreurs HTTP

## 📝 Conventions et Standards

### Naming Conventions
- **Source** : `NAMING_CONVENTIONS.md` (créé projet)
- **Utilisé dans** : 
  - Convention bilingue URLs françaises / code anglais
  - Limitations Express.js paramètres routes

## 🔄 Méthodologie

### GitHub Flow
- **Source** : https://docs.github.com/en/get-started/quickstart/github-flow (Documentation officielle GitHub)
- **Guide complet** : https://githubflow.github.io/
- **Utilisé dans** : 
  - Workflow Git (main + feature branches)
  - Pas de branch develop (simplicité 2025)

### Need-Driven Development
- **Source** : Approche projet (pas de source externe)
- **Utilisé dans** : 
  - Développement fonctionnalités selon besoins frontend
  - Architecture émergente vs over-engineering

---

## 📋 Instructions de maintenance

**Mettre à jour à chaque nouvelle technologie/source utilisée :**
1. Ajouter référence avec URL officielle
2. Indiquer fichiers/lignes précises d'utilisation  
3. Justifier choix technique avec contexte métier
4. Maintenir organisation par catégories

**Ne pas oublier :**
- Versions exactes des dépendances
- Dates de consultation documentation
- Raisons abandons (ex: Material-UI → Tailwind)