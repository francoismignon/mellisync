## ✅ Étapes terminées

### Phase 1 : Setup & Base de données
1. **Environnement** : Projet TypeScript configuré avec dependencies
2. **Modélisation** : Schema Prisma avec entités User, Apiary, Hive, ApiaryHive
3. **Décision architecture** : Table Role créée (au lieu d'enum) pour extensibilité future
4. **Relations** : onDelete Restrict pour préserver historique des transhumances
5. **Migration initiale** : Base PostgreSQL créée et connectée
6. **Seeding** : Rôles ADMIN et BEEKEEPER initialisés en DB

### Phase 2 : API & Git Workflow
1. **Git workflow** : GitHub Flow configuré avec règles strictes
2. **Structure API** : Routes modulaires créées dans `/src/routes/`
3. **Route test** : `GET /api/test` fonctionnelle pour vérifier l'API

### Phase 3 : Frontend & Navigation
1. **React Router** : Navigation configurée avec routes principales
2. **Material-UI** : Bibliothèque UI intégrée pour MVP rapide
3. **Navigation avec Persistent Drawer** : Composant officiel Material-UI adapté
4. **Couleurs thématiques** : Interface utilisateur cohérente

### Décisions métier
- **Transhumances** : Historique préservé même si rucher/ruche supprimé
- **Rôles** : Un utilisateur = un rôle (pas de multi-rôles simultanés)
- **Types ruches** : Support des standards français (Dadant, Langstroth, Warré, etc.)
- **Développement parallèle** : Backend et Frontend en simultané pour feedback immédiat
- **UX terrain** : Mobile-first, scan QR simplifié, actions contextuelles

### Décisions techniques
- **Git workflow** : GitHub Flow adopté (main + feature branches, pas de develop)
- **Workflow moderne 2025** : Simple, CI/CD friendly, déploiement continu
- **UX terrain** : "1 tap = 1 action"
- **UI Framework** : Material-UI choisi pour MVP rapide (composants officiels réutilisés)
- **Approche composants** : Utilisation exclusive de composants Material-UI existants adaptés aux besoins
- **Context7** : Règle MCP stricte appliquée pour toute nouvelle technologie



## 📝 Notes importantes
- Prisma Studio disponible pour administration DB
- Focus sur fonctionnalités métier plutôt que sur-ingénierie



### Phase 4 : Backend API fonctionnel
1. ~~**Architecture MVC complète avec couche Repository**~~ (simplifié après recherche best practices Prisma 2025)
2. **Architecture définitive** : Controllers + Services + Prisma (sans Repository redondant)
3. **PrismaClient singleton** : Instance unique réutilisée avec hot-reload développement 
4. **ApiaryService** : Méthodes statiques (create, findAll) avec validation et gestion d'erreurs
5. **Communication Frontend-Backend** : API REST fonctionnelle avec routes CRUD partielles
6. **Prisma Client généré** : Types TypeScript automatiques + validation des relations

### Phase 5 : Integration Frontend-Backend
1. **Composant ApiaryList** : Affichage dynamique des données réelles depuis l'API
2. **useEffect + Axios** : Pattern de fetch asynchrone côté client respectant les React Server Components
3. **Material-UI VirtualizedList** : Composant optimisé pour listes longues avec données backend
4. **Debugging complet** : Résolution problèmes CORS, routes manquantes, et rendu des props

### Phase 6 : Pipeline CI/CD & Déploiement Production (terminée ✅)
1. **Dockerisation complète** : Multi-stage builds pour backend (Node.js) et frontend (Nginx)
2. **GitHub Actions** : Pipeline automatique avec tests backend PostgreSQL + déploiement SSH
3. **DockerHub Registry** : Images taguées avec latest + commit SHA pour traçabilité
4. **Traefik SSL** : Reverse proxy avec Let's Encrypt automatique + domaines locaux/externes
5. **Zero-downtime deployment** : Pull nouvelles images + restart gracieux
6. **Configuration dual-domain** : Accès HTTPS externe + HTTP local simultanés

### Décisions techniques importantes
- **Abandon pattern Repository** : Prisma agit déjà comme ORM/Repository (best practices 2025)
- **Services statiques** : Pas d'injection de dépendance pour logique métier simple
- **Need-driven development** : Développement des fonctionnalités selon besoins frontend réels
- **Hot-reload backend** : `tsx --watch` pour rechargement automatique en développement
- **Docker Compose v2** : Syntaxe moderne `docker compose` (sans tiret) adoptée
- **SSH deployment** : Authentification par clé privée + port custom pour sécurité
- **Dual routing Traefik** : Routers séparés pour domaines externes (SSL) et internes (HTTP)

## 📧 Mail d'état d'avancement

**Objet :** TFE Mellisync - Rapport #07
**Destinataire :** Mr Dieu

---

Bonjour Mr Dieu,

Voici le détail des nouvelles avancées depuis mon dernier rapport.
Je reste disponible si vous souhaitez plus de détails sur un aspect particulier.

**Lien vers Mellisync** https://mellisync.francoiscloud.duckdns.org

**Nouvelles réalisations depuis le dernier rapport**

**Phase Interface "1 tap = 1 action" Complète (terminée ✅)**

- ✅ **ActionButton TypeScript complet** : Interface props typée, logique CYCLE/INCREMENT opérationnelle
- ✅ **Communication parent-enfant maîtrisée** : Remontée valeurs ActionButton → NewVisit avec état collecté
- ✅ **18 boutons d'actions MVP** : Interface inspirée panel.html avec types toggle/cycle/counter/weight
- ✅ **Collecte état unified** : `visitActions: { [actionId]: value }` pour sauvegarde future
- ✅ **Architecture composant réutilisable** : Pattern ActionButton extensible pour toutes actions

**Phase Logique Métier Saisonnière Intégrée (terminée ✅)**

- ✅ **Règles température étendues** : temperatureMin/Max dans table Action (15°C ouverture, 3-8°C hivernal)
- ✅ **89 relations ActionPeriode** : Chaque action liée aux bonnes périodes apicoles wallonnes
- ✅ **20 restrictions ActionWeatherRestriction** : Actions ouverture interdites par pluie/vent/orage
- ✅ **Base données enterprise-grade** : Toutes règles REGLES_METIER_APICOLES.md intégrées
- ✅ **Infrastructure filtrage intelligent** : Préparation mode "Saison/Expert" pour masquage actions

**Décisions techniques importantes**

- ✅ **Pattern TypeScript React moderne** : Props interface respectant préférences développeur
- ✅ **Callback pattern optimal** : Communication composant parent↔enfant avec React best practices
- ✅ **Colonnes température directes** : temperatureMin/Max dans Action (1 valeur = 1 colonne)
- ✅ **Seed métier exhaustif** : 109 relations période/météo avec règles apicoles wallonnes validées
- ✅ **Architecture évolutive** : Infrastructure complète pour filtrage contextuel futur

**Impact majeur :** **Interface apicole fonctionnelle** avec 18 actions MUST HAVE, logiques métier saisonnières intégrées, architecture TypeScript moderne, préparation solide pour sauvegarde visites et mode filtrage intelligent.

**Prochaine étape :** Finalisation sauvegarde complète visites avec API backend + implémentation filtrage saisonnier

Bien à vous,  
Mignon François

---

### Phase 7 : Séparation environnements dev/prod (terminée ✅)
1. **Variables d'environnement Vite** : Frontend adaptatif avec VITE_API_BASE_URL
2. **Séparation des bases de données** : mellisync_dev (local) vs mellisyncdb (prod)
3. **Architecture TypeScript enterprise** : Compilation locale + JavaScript en production
4. **Pipeline CI/CD optimisé** : Compilation TypeScript automatique avant Docker build
5. **Configuration multi-environnement** : .env.local (dev) + .env.production (prod)
6. **Traefik routing fonctionnel** : API accessible via api.mellisync.192.168.1.50.nip.io
7. **Seed automatique idempotent** : Données de base créées à chaque déploiement

### Phase 8 : Optimisation architecture réseau (terminée ✅)
1. **Résolution problème NAT hairpinning** : Solution /etc/hosts pour accès local aux domaines DuckDNS
2. **Architecture réseau unifiée** : Un seul domaine DuckDNS (HTTPS) pour tous les environnements
3. **Simplification infrastructure** : Suppression routes .nip.io HTTP redondantes
4. **Configuration multi-plateforme** : /etc/hosts WSL + Windows hosts pour développement
5. **Optimisation Traefik** : Cleanup routes locales inutiles, focus HTTPS uniquement

### Décisions techniques phase 7-8
- **Abandon ES modules pour CommonJS** : Simplification imports sans extensions .js
- **Variables d'environnement Vite** : import.meta.env.VITE_API_BASE_URL selon contexte
- **Séparation stricte dev/prod** : Bases de données complètement indépendantes
- **Seed idempotent avec upsert()** : Sécurité des redéploiements sans duplication données
- **Architecture client-side moderne** : Compréhension React browser-side vs server-side
- **DNS unifié** : DuckDNS partout, /etc/hosts pour résolution locale NAT
- **HTTPS-only** : Abandon HTTP local, sécurité maximale même en développement

### Réalisations détaillées Phase 7-8

**Variables d'environnement multi-couches** :
- Frontend Vite : `.env.local` (dev) + `.env.production` (prod) avec `VITE_API_BASE_URL`
- Backend Node.js : `.env` (dev) vs variables docker-compose (prod)
- Bases de données séparées : `mellisync_dev` (localhost) vs `mellisyncdb` (docker)

**Pipeline TypeScript enterprise** :
- Développement : TypeScript direct avec `tsx --watch`
- Production : Compilation automatique `tsc` → `dist/` → JavaScript optimisé
- CI/CD : Compilation intégrée dans GitHub Actions avant Docker build
- Seed cross-environment : `tsx` (dev) vs `node dist/` (prod)

**Architecture réseau unifiée** :
- Domaines développement : `localhost:5173` (frontend) + `localhost:3000` (backend)
- Domaines production : `mellisync.francoiscloud.duckdns.org` (web) + `api.mellisync.francoiscloud.duckdns.org` (API)
- Résolution NAT : `/etc/hosts` redirection locale vers IP privée (192.168.1.50)
- Protocol unifié : HTTPS partout (dev local via /etc/hosts, prod via Let's Encrypt)

**Debugging et résolution problèmes réseau** :
- Identification problème Mixed Content (HTTPS→HTTP bloqué par navigateurs)
- Diagnostic NAT hairpinning (routeur ne redirige pas trafic externe→interne)
- Solution /etc/hosts dual-platform (WSL Ubuntu + Windows 11)
- Simplification Traefik (suppression routes redondantes .nip.io)

### Phase 9 : Simplification frontend React (terminée ✅)
1. **Abandon Material-UI** : Suppression complète des composants Material-UI du code
2. **React pur + HTML basique** : Retour à des composants React simples avec HTML natif
3. **CRUD ruchers complet** : CREATE, READ, DELETE fonctionnels avec navigation contextuelle
4. **Navigation React Router** : 3 routes propres (/, /ruchers, /ruchers/nouveau)
5. **Convention bilingue établie** : URLs françaises (/ruchers) + code anglais (Apiaries)
6. **Controlled components** : Gestion état React avec useState/useEffect/useNavigate
7. **Styling minimal** : Quelques classes Tailwind basiques (border, flex, gap)

### Phase 10 : Architecture API & Base de données évoluée (en cours 🔄)
1. **Schema Prisma étendu** : Ajout enum ACQUISITION pour TranshumanceReason avec valeur par défaut
2. **Migration PostgreSQL dual-phase** : Résolution contrainte enum PostgreSQL (ACQUISITION ajouté)
3. **Architecture API flat + RBAC** : Décision routes flat plutôt que nested selon Zalando Guidelines
4. **Convention REST moderne** : Routes /api/hives (flat) avec filtrage RBAC au lieu de /api/apiaries/{id}/hives
5. **Strategy MVP → RBAC** : Approche itérative avec userId=1 temporaire puis authentification complète

### Décisions techniques phase 10
- **Routes flat RBAC** : /api/hives avec middleware RBAC vs routes nested complexes
- **PostgreSQL enum evolution** : Migration dual-phase obligatoire pour ajout valeurs enum
- **Zalando Guidelines adoption** : "Implicit Filtering" + "Top-Level Resource Access" appliqués
- **MVP-first approach** : CRUD fonctionnel d'abord, authentification ensuite
- **Prisma best practices 2025** : Services statiques + enum management + relations optimisées

### Décisions métier phase 10
- **Enum ACQUISITION default** : Nouvelle ruche = acquisition par défaut (logique métier)
- **Transhumance reason evolution** : Support états ruche depuis achat jusqu'aux déplacements
- **RBAC strategy** : Sécurité par propriétaire (user.id) plutôt que par contexte rucher
- **API consistency** : Même logique sécurité pour apiaries et hives (ownership-based)

### Phase 11 : Routes flat RBAC + Debug Express (terminée ✅)
1. **HiveService RBAC complet** : Méthodes findAllByUser avec filtrage Prisma complexe (User → Apiary → ApiaryHive → Hive)
2. **Routes flat fonctionnelles** : `/api/hives` avec RBAC automatique côté service 
3. **Frontend adapté** : Suppression paramètres apiary.id, appel direct `/api/hives` avec filtrage backend
4. **Styling Tailwind complet** : Interface utilisateur moderne et propre (NavBar, pages, formulaires)
5. **Debug route DELETE critique** : Résolution problème Express.js avec paramètres trait d'union
6. **Documentation technique** : NAMING_CONVENTIONS.md corrigé avec limitations Express vs Zalando

### Décisions techniques phase 11
- **Routes Express pragmatiques** : `:id` au lieu de `:apiary-id` (limitation technique Express.js)
- **URLs finales conformes** : `/api/apiaries/123` reste standard REST malgré paramètres simples
- **Requêtes Prisma complexes** : Maîtrise relations many-to-many avec filtrage imbriqué
- **Séparation frontend/backend** : URLs françaises (`/ruchers`) vs APIs anglaises (`/api/apiaries`)
- **RBAC by-design** : Filtrage automatique au niveau service, pas de vérifications manuelles

### Réalisations détaillées Phase 11

**Architecture RBAC opérationnelle** :
- HiveService avec méthodes `findAllByUser()` utilisant relations Prisma complexes
- Filtrage automatique via `apiary_hives.some.apiary.userId` 
- Pattern Controller → Service → Prisma respecté avec RBAC transparent
- Routes flat `/api/hives` fonctionnelles remplaçant routes nested

**Interface utilisateur finalisée** :
- Styling Tailwind CSS complet sur tous composants (NavBar, Dashboard, Apiaries, NewApiary, Apiary)
- Design moderne minimal : cards, buttons, forms avec hover effects et transitions
- Frontend React pur fonctionnel : CRUD ruchers + affichage ruches par utilisateur
- Navigation contextuelle fluide entre pages

**Résolution problème technique critique** :
- Debug route DELETE bloquée : identification limitation Express.js avec paramètres trait d'union
- Solution pragmatique : `:id` simple vs `:apiary-id` complexe (non supporté)
- URLs finales restent conformes REST/Zalando : `/api/apiaries/123` 
- Documentation mise à jour expliquant différence syntaxe Express vs standards REST

**Stack technique validée** :
- Backend : Express + Prisma + PostgreSQL + TypeScript + RBAC services
- Frontend : React + React Router + Tailwind CSS + Axios
- Architecture : Routes flat + Services statiques + Controlled components
- Patterns : MVC moderne, separation of concerns, need-driven development

### Phase 12 : CRUD ruches complet + Interface stylisée (terminée ✅)
1. **Architecture RBAC ruches complète** : HiveController avec create/findAllByApiary + vérification ownership
2. **Routes flat avec query parameters** : `/api/hives?apiaryId=123` pour filtrage par rucher
3. **HiveService createByApiary/findAllByApiary** : Logique métier séparée du controller + relations ApiaryHive
4. **Frontend CRUD ruches fonctionnel** : NewHive avec constantes locales + navigation contextuelle
5. **Interface utilisateur moderne** : Formulaire NewHive stylisé Tailwind identique à NewApiary
6. **Filtrage frontend opérationnel** : Chaque rucher affiche ses propres ruches uniquement

### Décisions techniques phase 12
- **Routes flat + query params** : `/api/hives?apiaryId=X` plutôt que `/api/apiaries/:id/hives` pour cohérence
- **RBAC by-service** : Vérification ownership automatique dans HiveController avant toute opération
- **Constantes frontend locales** : HIVE_TYPES, FRAME_COUNTS, HIVE_STATUS directement dans composant (pas d'API)
- **Navigation contextuelle** : `useParams()` pour récupérer apiaryId depuis URL + redirect vers ruche créée
- **Architecture MVC respectée** : Controller → Service → Prisma avec séparation responsabilités claire

### Réalisations détaillées Phase 12

**Backend API ruches fonctionnel** :
- HiveController avec méthodes create() et findAllByApiary() incluant vérification RBAC
- HiveService avec createByApiary() créant Hive + relation ApiaryHive automatiquement
- Routes flat `/api/hives` avec query parameters pour filtrage côté backend
- Gestion erreurs complète avec status codes appropriés (400, 403, 500)

**Frontend React ruches** :
- Composant NewHive avec useState, useParams, useNavigate pour création contextuelle
- Constantes locales pour types/cadres/statuts avec labels français affichés
- Formulaire controlled components avec handleSubmit/handleChange pattern établi
- Page Apiary avec fetchHives filtré par apiaryId + affichage conditionnel

**Interface utilisateur finalisée** :
- Styling Tailwind CSS uniforme entre NewApiary et NewHive (max-w-2xl, cards, focus states)
- Labels descriptifs français + placeholders pertinents pour UX optimale
- Boutons styled avec hover effects + transitions smooth
- Architecture responsive mobile-first respectée

**Architecture données opérationnelle** :
- Relations Prisma Hive ↔ ApiaryHive ↔ Apiary fonctionnelles avec contraintes
- Filtrage automatique ruches par propriétaire via relations many-to-many complexes
- Valeurs par défaut enum synchronisées frontend/backend (DADANT, FRAME_10, ACTIVE)
- Navigation URL cohérente `/ruchers/123/ruches/nouvelle` → `/ruchers/123/ruches/456`

### Phase 13 : Extension champs ruches + UX feedback (terminée ✅)
1. **Champs ruches étendus** : Ajout color (String) + yearBuilt (String) dans schema Prisma et frontend
2. **Migration base données** : Modification yearBuilt DateTime → String pour simplicité année
3. **Formulaire NewHive complet** : 6 champs (nom, type, cadres, statut, couleur, année) avec validation
4. **UX feedback utilisateur** : Alert() navigateur après création ruche avec nom confirmé
5. **Cohérence routes** : Correction navigation /ruchers/:id/ruches/:id (pluriel uniforme)
6. **Documentation sources** : Création SOURCES.md avec tracking RFC 7231, Zalando Guidelines, Prisma, GitHub Flow

### Décisions techniques phase 13
- **yearBuilt String vs DateTime** : Simplicité saisie année "2024" vs complexité date complète
- **Alert() vs toast libraries** : Feedback immédiat simple pour MVP, évolution possible vers react-hot-toast
- **Routes plurielles uniformes** : /ruchers/.../ruches/... pour cohérence linguistique française
- **Color String libre** : Saisie texte libre vs enum couleurs pour flexibilité terrain
- **SOURCES.md proactif** : Documentation systématique pour dossier technique TFE

### Réalisations détaillées Phase 13

**Schema Prisma évolué** :
- Ajout `color String` et `yearBuilt String` au modèle Hive
- Migration PostgreSQL pour conversion type DateTime → String
- Cohérence frontend/backend avec champs obligatoires

**Interface utilisateur enrichie** :
- Formulaire NewHive 6 champs complets avec labels français descriptifs
- Input text couleur avec placeholder "ex: Bleue, Rouge, Naturelle"
- Input text année avec placeholder "ex: 2024" (plus simple que date picker)
- Styling Tailwind uniforme avec focus states et transitions

**Feedback utilisateur opérationnel** :
- Navigation automatique vers ruche créée avec ID backend
- Alert() navigateur confirmant création avec nom ruche
- Pattern navigate() + alert() pour feedback immédiat simple

**Documentation technique systématique** :
- SOURCES.md créé avec URLs officielles (RFC 7231, Zalando, Prisma, GitHub Flow)
- Tracking précis fichiers/lignes utilisation sources
- Règle CLAUDE.md ajoutée pour documentation proactive nouvelles sources

### Phase 14 : Workflow Documentation TFE + Modélisation Visites (terminée ✅)
1. **Prisma ERD Generator** : Installation + configuration génération automatique ERD (Modèle Conceptuel)
2. **Prisma DBML Generator** : Installation + génération automatique MLD (Modèle Logique) 
3. **Génération MPD** : Script SQL automatique (Modèle Physique) via `prisma migrate diff`
4. **TsUML2** : Installation + génération automatique diagrammes de classes TypeScript
5. **Workflow Documentation** : Code-first modeling → 3 niveaux Merise automatiques + UML
6. **Modèles Visit/VisitAction** : Schema Prisma avec relations Hive(1)→Visit(N)→VisitAction(N)
7. **Migration base données** : Tables `visits` et `visitActions` créées avec relations

### Décisions techniques phase 14
- **Documentation automatique** : Prisma generators + TsUML2 pour cohérence garantie code ↔ doc
- **Workflow moderne 2025** : Génération automatique vs dessin manuel (gain temps/qualité)
- **3 niveaux Merise** : ERD (conceptuel) + MLD (logique) + MPD (physique) depuis 1 source
- **Relations visites** : onDelete Restrict (Hive→Visit) vs Cascade (Visit→VisitAction) 
- **API météo différée** : Données codées en dur pour MVP, vraie API externe plus tard
- **Convention naming** : camelCase entités simples vs snake_case tables jointure

### Réalisations détaillées Phase 14

**Workflow Documentation TFE établi** :
- Generators Prisma configurés pour génération auto ERD/MLD/MPD à chaque migration
- TsUML2 installé pour diagrammes de classes automatiques depuis TypeScript
- SOURCES.md enrichi avec références académiques (Méthode Merise, PlantUML, TsUML2)
- Code-first modeling : 1 source Prisma → 3 vues Merise synchronisées

**Modélisation Visites opérationnelle** :
- Table `visits` : date, température, météo, notes + FK hiveId avec onDelete Restrict
- Table `visitActions` : type, value (JSON), notes + FK visitId avec onDelete Cascade  
- Relations 1:N correctement définies : Hive→Visit→VisitAction
- Types d'actions MUST HAVE identifiés : presence-reine, couvain-frais, reserves, etc.

**Architecture technique validée** :
- Prisma schema étendu avec 2 nouveaux modèles + relations complexes
- Migration PostgreSQL réussie avec contraintes référentielles
- Generators automatiques fonctionnels (ERD + MLD synchronisés)
- Documentation technique complète pour TFE (standards académiques)

**Préparation fonctionnalités core** :
- Base données prête pour implémentation panel apicole "1 tap = 1 action"
- Structure VisitAction flexible (value JSON) pour différents types données
- Architecture RBAC héritée applicable aux visites (filtrage par user→apiary→hive)

### Phase 15 : Système visites complet "1 tap = 1 action" (terminée ✅)
1. **Architecture ActionDefinition normalisée** : Table séparée avec 18 actions MUST HAVE + règles métier complètes
2. **Migration + Seeding complet** : Base de données avec actions, périodes, restrictions météo/température
3. **Frontend NewVisit fonctionnel** : Interface "1 tap = 1 action" inspirée panel.html avec 18 boutons dynamiques
4. **Mode Saison/Expert opérationnel** : Filtrage intelligent selon période apicole + conditions météo/température
5. **Documentation métier exhaustive** : REGLES_METIER_APICOLES.md avec calendrier wallon détaillé (8 périodes)
6. **API ActionDefinition** : Route GET /api/action-definitions avec Controller/Service complets

### Décisions techniques phase 15
- **Architecture normalisée** : ActionDefinition séparée avec JSON pour options/règles (évolutivité maximale)
- **Calendrier apicole wallon** : 8 périodes officielles avec règles métier documentées
- **Filtrage intelligent** : Mode Saison masque actions inadaptées selon date/météo/température réelles
- **Interface inspirée panel.html** : Système "1 tap = 1 action" avec types toggle/cycle/counter/weight
- **18 actions MUST HAVE finales** : Incluant contrôle visuel réserves (vs soupesée) pour exhaustivité

### Réalisations détaillées Phase 15

**Base de données métier** :
- Table ActionDefinition avec 18 actions MUST HAVE seedées
- Champs JSON : options, periods, tempRange, weatherRestrictions
- Relations normalisées : Visit → VisitAction → ActionDefinition
- Règles métier complètes selon expertise apicole wallonne

**Interface utilisateur avancée** :
- Composant NewVisit avec 18 boutons d'actions dynamiques
- Filtrage Mode Saison : masque actions selon période/météo/température
- Indicateur visuel : "Période: traitement été | Actions visibles: 12/18"
- Types d'actions : toggle (Oui/Non), cycle (Faible/Moyenne/Forte), counter (+1), weight (+0.5kg)

**Logique métier opérationnelle** :
- Fonction getCurrentPeriod() : calcul période selon calendrier wallon
- Fonction shouldShowAction() : filtrage selon 3 critères (période, température, météo)
- 8 périodes apicoles : hiver → fin_hiver → miellée_printemps → inter_miellée → pré_traitement → traitement_été → préparation_hiver → traitement_hiver

**Documentation technique complète** :
- REGLES_METIER_APICOLES.md : 18 actions détaillées + calendrier apicole wallon
- Chaque période documentée : caractéristiques, actions typiques, conditions
- Sources tracées : panel.html + Guide apicole annuel Wallonie
- Architecture évolutive prête pour ajouts V1/V2

### Phase 16 : Architecture BDD normalisée complète (terminée ✅)
1. **Abandon JSON dénormalisé** : Refactoring complet de l'architecture ActionDefinition vers tables relationnelles pures
2. **Normalisation Prisma 3NF** : Action, Option, Periode, WeatherRestriction avec tables de jointure many-to-many
3. **27 options complètes MVP** : Toutes options panel.html + User Stories MUST HAVE seedées (toggle, cycle, treatments varroa)
4. **Relations optimisées** : ActionOption, ActionPeriode, ActionWeatherRestriction avec clés composites
5. **Seed architecture évolutive** : `complete_normalized_actions_with_must_have_options` complet
6. **API Service complexe** : Requête Prisma avec 3 niveaux de jointures (Action → tables relations → données)

### Décisions techniques phase 16
- **Architecture DB pure** : Abandon JSON pour relations SQL classiques (performance + évolutivité)
- **Clés composites** : `@@id([actionId, optionId])` pour tables jointure sans ID superflu
- **Naming conventions Prisma** : PascalCase models, snake_case tables, camelCase fields
- **18 actions MUST HAVE** : Panel.html + User Stories croisés pour options exhaustives
- **Test interface minimal** : NewVisit simplifié pour valider architecture normalisée
- **Convention DB/Code cohérente** : Underscore réservé aux tables jointure uniquement

### Réalisations détaillées Phase 16

**Base données normalisée 3NF** :
- Tables principales : Action (18), Option (27), Periode (8), WeatherRestriction (6)
- Tables jointure : action_option, action_periode, action_weather_restriction
- Seed complet avec toutes relations 18 actions MVP (toggle, cycle, counter, weight)
- Migration PostgreSQL sans perte données + documentation SOURCES.md étendue

**Requêtes Prisma optimisées** :
- Service `findAllWithRelations()` avec 3 niveaux include imbriqués
- Structure retour normalisée : `{ action_options: [{ option: { label } }] }`
- Performance optimisée vs anciennes requêtes JSON multiples
- Architecture évolutive pour ajout options/périodes/restrictions V2

**Test interface opérationnel** :
- NewVisit minimal affiche 18 actions + options relationnelles
- Validation architecture : chaque action récupère ses options via jointures
- Console.log confirme structure données correcte depuis API normalisée
- Préparation interface "1 tap = 1 action" avec données relationnelles pures

### Phase 17 : Pipeline CI/CD sécurisé + Architecture Prisma multi-schéma (terminée ✅)
1. **Problème CI/CD identifié** : Crash pipeline avec prisma-erd-generator (Puppeteer/Chromium en production)
2. **Solution Prisma officielle 2025** : Architecture multi-schéma selon best practices validées Context7
3. **Schémas séparés** : schema.prisma (dev complet) vs schema.runtime.prisma (prod client-only)
4. **Scripts package.json optimisés** : prisma:generate (runtime), prisma:dev:generate (complet), prisma:erd (docs)
5. **Pipeline CI/CD sécurisé** : deploy.yml avec toggle GENERATE_ERD + génération conditionnelle ERD
6. **SOURCES.md enrichi** : Documentation architecture multi-schéma + problème résolu tracé

### Décisions techniques phase 17
- **Architecture multi-schéma Prisma** : Dev (avec generators docs) vs Prod (client uniquement)
- **Scripts npm spécialisés** : Pointage explicite --schema= selon environnement
- **Pipeline prod-safe** : Aucun risque crash Puppeteer/Chromium + contrôle ERD par ENV
- **Best practices 2025** : Solution officielle Prisma pour gestion generators conditionnels
- **Documentation proactive** : SOURCES.md mis à jour avec architecture implémentée

### Réalisations détaillées Phase 17

**Architecture Prisma enterprise-grade** :
- schema.runtime.prisma validé : client uniquement, modèles complets, relations intactes
- Scripts package.json : prisma:generate → schema.runtime.prisma (prod-safe)
- Pipeline GitHub Actions : npm run prisma:generate + job ERD conditionnel
- Variable environnement : GENERATE_ERD=false (prod) vs true (dev)

**Problème critique résolu** :
- Crash CI/CD avec @mermaid-js/mermaid-cli + Puppeteer identifié
- Solution officielle Prisma multi-schema implémentée
- Architecture validée par Context7 + documentation officielle
- SOURCES.md enrichi avec problème tracé + solution documentée

**Workflow développement optimisé** :
- Dev : npx prisma generate (schema.prisma par défaut, avec ERD)
- Prod : npm run prisma:generate (schema.runtime.prisma, client seulement)
- Docs : npm run prisma:erd (génération ERD à la demande)
- CI/CD : Zero-risk deployment avec architecture séparée

### Phase 18 : Architecture boutons simplifiée "1 tap = 1 action" (terminée ✅)
1. **Simplification types boutons** : Réduction de 4 à 2 types (CYCLE, INCREMENT) pour logique unifiée
2. **Migration incrementStep** : Champ Decimal nullable ajouté à la table Action (NULL pour CYCLE, valeur pour INCREMENT)
3. **Seed optimisé** : Actions mises à jour avec actionType "CYCLE"/"INCREMENT" et coefficients adaptés terrain
4. **Logique frontend claire** : CYCLE parcourt action_options avec modulo, INCREMENT ajoute incrementStep
5. **Test bouton unique fonctionnel** : Prototype NewVisit avec bouton "Présence reine" cyclant "Non" ↔ "Oui"
6. **Architecture composant préparée** : Logique ActionButton prête pour réutilisation sur tous boutons

### Décisions techniques phase 18
- **2 types boutons seulement** : CYCLE (options prédéfinies) vs INCREMENT (compteur configurable)
- **incrementStep NULL pour CYCLE** : Champ inutile pour parcours d'options, requis seulement pour compteurs
- **Coefficients terrain optimisés** : Abeilles mortes +10, varroas +5, poids +0.5kg selon usage réel
- **Modulo pour boucle** : `(index + 1) % length` pour cycle infini sur options disponibles
- **Composant ActionButton future** : Un bouton = une action complète avec état isolé
- **Schema runtime synchronisé** : Maintien cohérence dev/prod après chaque migration

### Réalisations détaillées Phase 18

**Base données simplifiée** :
- Migration incrementStep nullable : CYCLE = NULL, INCREMENT = coefficient métier
- Seed unifié avec 18 actions finales (11 CYCLE, 7 INCREMENT)
- Types ActionType cohérents : suppression toggle/cycle/counter/weight redondants
- Coefficients calibrés usage terrain : mortalité +10, chute varroa +5, poids +0.5kg

**Prototype bouton fonctionnel** :
- État React isolated : currentIndex pour CYCLE, currentValue pour INCREMENT
- Logique clic unified : modulo pour boucle vs addition simple
- Affichage dynamique : action_options[index] vs valeur incrémentée
- Test réussi : "Présence reine" alterne "Non" → "Oui" → "Non"

**Architecture évolutive validée** :
- Composant ActionButton conceptualisé : props action, état isolé, logique complète
- Pattern réutilisable : `actions.map(action => <ActionButton action={action} />)`
- Séparation responsabilités : NewVisit gère données, ActionButton gère interactions
- Préparation interface complète : 18 boutons avec logiques métier différenciées

### Phase 19 : Interface "1 tap = 1 action" complète + Logique métier saisonnière (terminée ✅)
1. **ActionButton TypeScript complet** : Interface props typée, logique CYCLE/INCREMENT opérationnelle
2. **Callback parent-enfant maîtrisé** : Remontée valeurs ActionButton → NewVisit avec état collecté
3. **Architecture Prisma métier étendue** : Ajout temperatureMin/temperatureMax dans table Action
4. **Seed complet règles apicoles** : 89 relations ActionPeriode + 20 restrictions ActionWeatherRestriction
5. **Base données enterprise-grade** : Toutes règles métier REGLES_METIER_APICOLES.md intégrées
6. **Préparation filtrage intelligent** : Infrastructure complète pour masquage actions selon contexte

### Décisions techniques phase 19
- **TypeScript props pattern** : `props: ActionButtonProps` respectant préférence utilisateur vs destructuring
- **Callback inline recommandé** : `onValueChange={(value) => {}}` vs fonction séparée pour simplification
- **Colonnes température directes** : temperatureMin/Max dans Action vs table jointure (1 valeur = 1 colonne)
- **Seed métier exhaustif** : 18 actions avec restrictions température + 109 relations période/météo seedées
- **Convention camelCase respectée** : temperatureMin/Max cohérent avec actionType, incrementStep

### Réalisations détaillées Phase 19

**Interface "1 tap = 1 action" finalisée** :
- 18 boutons ActionButton avec logiques CYCLE (modulo) et INCREMENT (addition)
- Collecte état parent dans visitActions : `{ [actionId]: value }` pour sauvegarde future
- TypeScript interfaces propres avec props validation complète
- Communication parent↔enfant maîtrisée avec callbacks React best practices

**Logique métier saisonnière intégrée** :
- Règles température : 15°C minimum pour ouverture ruche, 3-8°C traitement hivernal
- 89 relations ActionPeriode : chaque action liée aux bonnes périodes apicoles wallonnes
- 20 restrictions météo : actions ouverture ruche interdites par pluie/vent/orage
- Base données prête pour filtrage intelligent frontend selon contexte réel

**Architecture évolutive validée** :
- Schema Prisma dual (dev + runtime) mis à jour avec nouvelles colonnes
- Seed idempotent avec upsert() pour relations many-to-many complexes
- Infrastructure complète pour mode "Saison/Expert" avec masquage actions inadaptées

### Phase 20 : Architecture Backend/Frontend séparée selon standards 2025 (terminée ✅)
1. **Consultation Context7** : Toss Frontend Fundamentals + FastAPI Best Architecture pour séparation responsabilités
2. **Décision architecture critique** : Calcul période apicole + API météo côté backend (business logic layer)
3. **Standards officiels 2025** : "Date/time logic belongs in business layer, not presentation layer"
4. **Architecture 3-tiers appliquée** : api (view) → service (business logic) → model (data)
5. **Route intelligente /api/actions?filter=current** : Backend filtre actions selon période/météo/température + retourne contexte complet
6. **Frontend complètement transformé** : NewVisit.tsx + ActionButton.tsx simplifiés, logique shouldDisplay() supprimée

### Décisions techniques phase 20
- **Backend intelligent complet** : getCurrentPeriod() + getCurrentWeather() + filterActionsByRules() dans ActionService
- **API météo MVP** : Valeurs simulées (18°C, "Ensoleillé") pour développement/test, TODO production OpenWeatherMap
- **Frontend ultra-léger** : ActionButton sans props météo/température/expertMode, toujours rendu (actions pré-filtrées)
- **Architecture enterprise validée** : Business logic (backend) vs Presentation logic (frontend) selon Toss + FastAPI
- **Mode toggle instantané** : Expert (toutes actions) vs Normal (actions filtrées) avec 1 requête différente
- **SOURCES.md enrichi** : Standards officiels documentés avec patterns implémentés + justifications décision

### Réalisations détaillées Phase 20

**Backend intelligent fonctionnel** :
- ActionService.findForVisit() avec 4 étapes : récupération DB → calcul contexte → filtrage métier → response structurée
- getCurrentPeriod() selon Guide apicole Wallonie : 22 août = "traitement_été" calculé automatiquement
- filterActionsByRules() avec 4 filtres : période saisonnière + température min/max + restrictions météo
- Test validé : 18 actions totales → 13 actions filtrées pour période août + température 18°C

**Frontend transformé** :
- NewVisit.tsx : endpoint intelligent selon mode (?filter=current vs sans filtre) + affichage contexte période/météo
- ActionButton.tsx : interface simplifiée sans props filtrage, logique shouldDisplay() complètement supprimée
- Architecture display-only : si ActionButton rendu = action autorisée par définition backend
- Props allégées : currentTemperature/currentWeather/expertMode supprimées, backend gère tout

**Architecture finale opérationnelle** :
- GET /api/actions?filter=current : Retourne { currentPeriod, currentTemperature, currentWeather, actions[] }
- GET /api/actions : Retourne actions[] (mode expert, toutes actions sans filtre)
- 1 seule route, 2 modes, logique métier entièrement côté serveur selon standards officiels 2025

### Phase 21 : Système sauvegarde visites complet "1 tap = enregistrement" (terminée ✅)
1. **Architecture VisitController + VisitService** : POST /api/visits avec validation hiveId + visitActions
2. **Transaction Prisma atomique** : Création Visit + toutes VisitActions en une opération (tout ou rien)
3. **Valeurs par défaut automatiques** : ActionButton envoie valeurs initiales au mount (CYCLE=première option, INCREMENT=0)
4. **Interface sauvegarde complète** : NewVisit.tsx avec saveVisit(), gestion loading, feedback utilisateur
5. **Navigation workflow bouclée** : Redirection automatique vers page ruche après sauvegarde réussie
6. **URL params synchronisés** : Routes App.tsx (:hive-id) vs useParams NewVisit.tsx cohérents

### Décisions techniques phase 21
- **Séparation responsabilités controller** : VisitController dédié vs réutilisation HiveController (SRP respecté)
- **Transaction Prisma enterprise** : $transaction() garantit atomicité création Visit + 13 VisitActions simultanées
- **Valeurs par défaut côté enfant** : ActionButton useEffect au mount vs logique parent (React best practices)
- **Interface TypeScript stricte** : CreateVisitData avec { hiveId: number, visitActions: Record<string, string|number> }
- **Navigation UX optimisée** : useNavigate() redirection automatique vs bouton retour manuel
- **Routes REST cohérentes** : POST /api/visits (domaine visits) vs POST /api/hives/:id/visits (nested)

### Réalisations détaillées Phase 21

**Backend sauvegarde enterprise** :
- VisitService.create() avec 4 étapes : créer Visit → préparer VisitActions → createMany() → retour complet avec relations
- Validation controller : hiveId required + visitActions object type + gestion erreurs 400/500
- Transaction atomique : échec creation = rollback automatique (intégrité données garantie)
- Response enrichie : Visit + VisitActions + Action details + Hive info pour confirmation

**Frontend workflow complet** :
- ActionButton auto-initialization : useEffect([]) envoie valeur par défaut au parent automatiquement  
- NewVisit.tsx saveVisit() : récupération params URL + POST API + loading state + error handling
- Interface utilisateur bouclée : "Enregistrement..." → Alert succès → Redirection page ruche
- Navigation params : useParams<{"hive-id", "apiary-id"}> synchronisé avec routes App.tsx

**Workflow utilisateur final** :
- URL : /ruchers/123/ruches/456/visites/nouvelle → Nouvelle visite pour ruche 456
- Actions pré-filtrées : Backend retourne seulement actions autorisées période/météo
- Saisie intuitive : Clic boutons modifie valeurs, valeurs par défaut déjà présentes
- Sauvegarde 1-tap : "Enregistrer visite" → Transaction backend → Redirection ruche
- UX mobile-optimized : Workflow complet sans navigation manuelle requise

### Phase 22 : Génération PDF fiches visite officielles (terminée ✅)
1. **Template React PDF professionnel** : VisitPDFTemplate.tsx avec en-tête, identification, actions, signatures
2. **Backend Puppeteer intégré** : Route `/api/visits/:id/pdf` avec React SSR → HTML → PDF A4
3. **Workflow utilisateur bouclé** : Clic "PDF" historique → téléchargement automatique fiche officielle 
4. **Corrections UX multiples** : Suppression émojis incompatibles, cohérence numéros visite, données rucher/localisation
5. **Architecture relations Prisma** : Résolution ApiaryHive → Apiary pour données complètes ruchers
6. **Recherche API météo** : Comparaison Open-Meteo vs OpenWeatherMap vs WeatherAPI pour intégration future

### Décisions techniques phase 22
- **Puppeteer backend vs jsPDF frontend** : Rendu serveur pour consistance cross-browser + template React réutilisable
- **Styles inline vs Tailwind** : CSS inline optimal pour PDF (pas de build Tailwind backend requis)
- **Relations Prisma complexes** : Via ApiaryHive junction table pour récupérer nom/adresse rucher actuel
- **Numérotation visite par ruche** : Tri chronologique + findIndex() pour position correcte vs ID global
- **Open-Meteo choix API** : Gratuit 10k calls/jour, pas de clé API, open-source vs alternatives limitées
- **Template serveur séparé** : src/components côté server vs client pour isolation SSR

### Réalisations détaillées Phase 22

**Système PDF enterprise** :
- Template VisitPDFTemplate.tsx professionnel : sections identification, conditions, actions, observations, signature
- Architecture Puppeteer : React.createElement() → renderToStaticMarkup() → page.setContent() → page.pdf()
- Format A4 avec marges : top 20mm, right/left 15mm, bottom 20mm pour impression optimale
- Headers HTTP corrects : Content-Type application/pdf + Content-Disposition attachment filename

**Résolution données complètes** :
- Requête Prisma 3-niveaux : Visit → VisitAction → Action + Hive → ApiaryHive → Apiary
- Calcul visitNumber par ruche : allVisitsForHive.sort(date).findIndex() pour numérotation 1,2,3...
- Interface TypeScript cohérente : apiary_hives[0].apiary.{name,address,city} vs anciennes structures
- Formatage français : toLocaleDateString('fr-FR') avec weekday/month/day/hour/minute complets

**Interface utilisateur finalisée** :
- Bouton "PDF" historique visites avec window.open() vers route backend API
- Suppression émojis template : compatibilité polices standard sans caractères spéciaux
- Cohérence numérotation : visitNumber utilisé header + footer vs visit.id global
- UX download direct : téléchargement automatique sans preview (workflow optimisé mobile)

**Recherche technique API météo** :
- Comparaison Open-Meteo (10k free, no API key) vs OpenWeatherMap (60/min limit) vs WeatherAPI
- Décision Open-Meteo : optimal pour MVP avec 10k calls/jour + données température/conditions complètes
- Architecture prête : ActionService.getCurrentWeather() déjà structuré pour intégration API réelle

### Phase 23 : Intégration API météo Open-Meteo temps réel (terminée ✅)
1. **WeatherService complet** : Géocodage automatique adresse → GPS + météo temps réel via API Open-Meteo
2. **Géocodage transparent** : Création rucher stocke latitude/longitude automatiquement selon ville
3. **Météo contextualisée par rucher** : Chaque rucher affiche sa propre météo locale au lieu de données par défaut
4. **Stratégie fallback géocodage** : Si adresse complète échoue, utilise ville seule pour fiabilité
5. **Sélecteur villes belges** : Dropdown 25 villes principales pour éviter erreurs saisie utilisateur
6. **Données PDF météo temps réel** : Fiches visite avec vraie température/météo du rucher au moment génération

### Décisions techniques phase 23
- **Open-Meteo API gratuite** : 10k calls/jour sans clé API vs alternatives limitées/payantes
- **Géocodage ville uniquement** : Plus fiable que adresse complète, suffisant précision ruchers
- **Coordonnées GPS stockées** : latitude/longitude en DB pour éviter appels répétés
- **ActionService getCurrentWeather(apiaryId)** : Utilise coordonnées spécifiques rucher vs défaut Bruxelles
- **Dropdown contraignant** : Liste villes validées vs champ libre source erreurs
- **Architecture 3-tier respectée** : APIs externes dans couche service selon Node.js Best Practices

### Réalisations détaillées Phase 23

**WeatherService production** :
- Méthode geocodeAddress() avec fallback ville si adresse complète échoue
- getCurrentWeather() avec coordonnées GPS → température + condition météo WMO
- Gestion erreurs robuste avec fallback données par défaut (18°C, "Non disponible")
- Migration Prisma latitude/longitude Decimal nullable pour toutes coordonnées mondiales

**Intégration transparente** :
- ApiaryService.create() appelle géocodage automatiquement lors création rucher
- ActionService.getCurrentWeather(apiaryId) utilise coordonnées stockées vs Bruxelles par défaut
- Frontend NewVisit.tsx envoie apiaryId dans URL → météo spécifique rucher affiché
- VisitController génération PDF utilise vraie météo moment visite vs données hardcodées

**UX amélioration significative** :
- Formulaire NewApiary avec dropdown 25 villes belges (Bruxelles, Liège, Anvers, Charleroi...)
- Chaque rucher affiche météo locale correcte : Namur 19°C vs Liège 18°C
- Suppression bouton supprimer rucher pour éviter contraintes clés étrangères complexes
- Interface météo temps réel : température + condition (Ensoleillé, Couvert, Pluie...)

**Architecture finale opérationnelle** :
- Workflow complet : Créer rucher → Géocodage automatique → Création visite → Météo spécifique → PDF avec vraies données
- Base données enrichie : coordonnées GPS + historique météo contextuel par visite
- APIs externes intégrées selon standards enterprise avec fallback robustes

### Phase 24 : Optimisation UX labels périodes + émojis météo (terminée ✅)
1. **Émojis météo contextuels** : Ajout émojis appropriés dans WeatherService (☀️ Soleil, ☁️ Couvert, 🌧️ Pluie, etc.)
2. **Labels périodes utilisateur** : Conversion "traitement_été" → "Traitement d'été" pour interface élégante
3. **Centralisation logique backend** : ActionService.getCurrentPeriod() retourne directement labels utilisateur
4. **Suppression duplication frontend** : Élimination PERIOD_LABELS côté client, une seule source vérité backend
5. **UX cohérente frontend/PDF** : Labels élégants dans interface + fiches PDF générées
6. **Architecture DRY appliquée** : Logique conversion centralisée, maintenance simplifiée

### Décisions techniques phase 24
- **Émojis météo WMO standardisés** : Mapping codes Open-Meteo → émojis contextuels (☀️🌤️⛅☁️🌫️🌦️🌧️❄️⛈️)
- **Labels backend-first** : getCurrentPeriod() retourne "Traitement d'été" vs "traitement_été" technique
- **Suppression duplication** : PERIOD_LABELS supprimés frontend + visitController (DRY principle)
- **TypeScript tsconfig JSX** : Configuration "jsx": "react-jsx" backend pour template PDF React
- **Architecture centralisée** : Backend génère labels utilisateur → Frontend affiche direct → PDF cohérent

### Réalisations détaillées Phase 24

**Interface météo enrichie** :
- Conditions avec émojis contextuels : "☁️ Couvert", "☀️ Ciel dégagé", "🌧️ Pluie modérée"
- Affichage périodes élégant : "📅 Traitement d'été • 🌡️ 19°C • ☁️ Couvert"
- PDF fiches visite cohérentes avec mêmes labels/émojis que interface

**Refactoring architecture labels** :
- ActionService.getCurrentPeriod() source unique vérité avec 8 périodes wallonnes
- Suppression logique duplication frontend/backend (PERIOD_LABELS éliminés)
- Architecture DRY respectée : modification labels = 1 seul endroit backend

**Configuration TypeScript JSX** :
- tsconfig.json backend étendu : "jsx": "react-jsx" + include "**/*.tsx"
- Support React Server-Side Rendering pour génération PDF
- Template VisitPDFTemplate.tsx fonctionnel avec CSS-in-JS côté serveur

### Phase 25 : Système authentification sécurisé enterprise-grade (terminée ✅)
1. **Architecture cookies HttpOnly sécurisée** : JWT stocké dans cookies sécurisés (httpOnly, secure, sameSite strict)
2. **AuthService production** : Bcrypt 12 rounds + JWT 24h + gestion cookies automatique + variables environnement
3. **Middleware authentification complet** : Extraction cookies + validation JWT + injection req.user + gestion erreurs
4. **Controllers RBAC opérationnels** : Remplacement userId hardcodé par req.user.id avec vérifications ownership
5. **Routes API sécurisées** : Middleware authenticateToken appliqué à toutes routes protégées
6. **Seed automatisé sécurisé** : Admin + François avec mots de passe hashés + upsert intelligent
7. **CORS configuré** : credentials: true pour cookies cross-origin + origin configuré environnement

### Décisions techniques phase 25
- **Cookies HttpOnly vs localStorage** : Protection XSS selon Node.js Best Practices (Trust 9.6)
- **SameSite strict + Secure** : Protection CSRF + HTTPS obligatoire (défense multicouche)
- **Architecture stateless JWT** : Token auto-contenu vs sessions serveur pour scalabilité
- **Middleware pattern Express** : authenticateToken réutilisable + req.user injection standardisée
- **RBAC + Ownership combinés** : Rôles (ADMIN/BEEKEEPER) + filtrage données utilisateur
- **Cookie-parser integration** : Middleware Express natif pour parsing cookies sécurisé
- **Environment-aware CORS** : Frontend URL configurable dev/prod via variables environnement

### Réalisations détaillées Phase 25

**Backend authentification enterprise** :
- AuthService avec méthodes register/login retournant user (pas token exposé)
- Cookies sécurisés : mellisync_auth avec options complètes sécurité
- AuthController adapté : responses sans tokens + cookies automatiques
- Middleware auth : extraction cookies + validation + user injection + error handling

**Sécurisation routes API complète** :
- Toutes routes métier protégées : /api/apiaries, /api/hives, /api/actions, /api/visits
- Controllers mis à jour : userId dynamique req.user.id vs hardcodé
- ApiaryService étendu : findAllByUser() pour filtrage RBAC automatique
- Route profil ajoutée : GET /api/auth/me pour données utilisateur courant

**Infrastructure sécurisée opérationnelle** :
- CORS configuré : origin + credentials pour cookies cross-domain
- Seed production : hashage automatique mots de passe + upsert mise à jour
- Utilisateurs test : admin@mellisync.com (ADMIN) + francois@mellisync.com (BEEKEEPER)
- Architecture prête : frontend peut implémenter login/register + session management

**Standards sécurité respectés** :
- Node.js Best Practices : cookies HttpOnly + bcrypt + JWT + middleware patterns
- Architecture multicouche : TLS (transport) + HttpOnly (XSS) + SameSite (CSRF)  
- RBAC enterprise : rôles + ownership + filtrage automatique
- Code-first security : sécurité intégrée architecture vs ajout post-développement


## 🚀 Évolutions futures (post-MVP)

### Système prérequis actions avancé
**Concept** : Actions dépendantes avec logique intra/inter-visites
- **Intra-visite** : "Confirmer présence reine" → débloque → "Évaluer vitalité reine"
- **Inter-visites** : "Poser languette varroa" → maintient → "Compter varroas languette" jusqu'à "Enlever languette"
- **Architecture** : Table HiveState pour tracking états persistants + ActionPrerequisite avec types SAME_VISIT/HIVE_STATE
- **Impact UX** : Guide progressif utilisateur avec déblocage actions contextuelles

### Gamification apicole ("Cookie Clicker" style)
**Concept** : Interface addictive avec feedback visuel satisfaisant
- **Effets visuels** : +1 animations, particules, transitions satisfaisantes sur actions importantes
- **Sons apicoles** : Bzzzz abeilles, récolte miel, confirmations audio
- **Progression visible** : Compteurs ruche, achievements, déblocage actions
- **Dopamine design** : Chaque action importante = récompense visuelle immédiate
- **Librairies** : Framer Motion, react-spring pour animations fluides

### Phase 26 : Interface authentification frontend React + Configuration Axios optimisée (terminée ✅)
1. **Pages authentification Material-UI** : Login/Register avec formulaires simples, validation, gestion erreurs
2. **Gestion état authentification** : App.tsx avec useEffect auth check, protection routes automatique, loading states
3. **Configuration Axios globale** : axiosConfig.ts avec baseURL, withCredentials, intercepteurs requête/réponse
4. **Migration complète Fetch → Axios** : Tous appels API utilisant config centralisée + URLs relatives simplifiées
5. **Intercepteurs debug** : Logs automatiques requêtes/réponses, gestion centralisée erreurs 401
6. **Workflow auth complet** : Login → cookies HttpOnly → navigation protégée → logout fonctionnel
7. **Documentation technique** : SOURCES.md enrichi avec justification Axios vs Fetch (cookies, intercepteurs, DX)

### Décisions techniques phase 26
- **Axios vs Fetch choix documenté** : Intercepteurs natifs, withCredentials global, gestion erreurs automatique
- **Pages auth Material-UI** : Card + TextField cohérent avec architecture existante
- **Protection routes React Router** : Conditional rendering App.tsx selon état authentification
- **Configuration centralisée** : axiosConfig.ts source unique vérité (baseURL, credentials, logging)
- **URLs relatives** : `/api/auth/login` vs `http://localhost:3000...` pour maintenabilité
- **Intercepteurs production-ready** : Logs debug + gestion 401 centralisée (préparation refresh token)
- **Workflow RESTful** : POST login/register → GET /auth/me verification → POST logout

### Réalisations détaillées Phase 26

**Interface authentification React complete** :
- Login.tsx avec email/password, validation, error states, loading
- Register.tsx avec confirmation mot de passe, validation cohérente
- Navigation inter-pages avec React Router Link (Login ↔ Register)
- Gestion erreurs backend : affichage error.response.data.error dans Alert Material-UI

**Protection routes automatique** :
- App.tsx checkAuth() au mount avec axios.get('/api/auth/me')
- Conditional rendering : routes auth si non connecté, app complète si connecté
- Loading state pendant vérification authentification initiale
- NavBar bouton déconnexion avec axios.post('/api/auth/logout')

**Configuration Axios enterprise-grade** :
- axiosConfig.ts avec axios.defaults globaux (baseURL, withCredentials)
- Intercepteur requête avec logs debug toutes requêtes
- Intercepteur réponse avec gestion centralisée erreurs + logs
- Migration 8+ fichiers : imports axios → axiosConfig + URLs simplifiées
- Suppression duplication `{ withCredentials: true }` grâce config globale

**Architecture HTTP client optimisée** :
- Plus d'URLs hardcodées : axios.post('/api/auth/login') vs fetch('http://localhost:3000...')
- Logs automatiques : `[AXIOS] POST /api/auth/login` + `[AXIOS] 201 /api/auth/login`
- Gestion erreurs centralisée : detection 401 → log "Token expired" (futur refresh automatique)
- DX améliorée : debugging réseau facilité + consistency requêtes

### Fonctionnalités V2/V3 planifiées

#### Types visites selon calendrier apicole
**Concept** : Classification automatique visites selon période
- **Types** : Visite printemps, été, automne, hivernage
- **Auto-détection** : Date visite → période → type automatique  
- **Affichage PDF** : "Type de visite : Visite d'automne" dans fiche
- **Règles métier** : Chaque type = actions recommandées différentes
- **Implementation** : Extension ActionService.getCurrentPeriod() → visit type mapping

*Dernière étape* : **Interface authentification frontend + Axios config optimisée !** Login/Register Material-UI fonctionnels, gestion état auth dans App.tsx, protection routes automatique. Configuration Axios globale avec intercepteurs, baseURL centralisée, withCredentials automatique. Frontend-backend auth workflow complet opérationnel.