---
marp: true
theme: default
transition: fade 0.8s
paginate: true
backgroundColor: #ffffff
color: #1f2937
size: 16:9
style: |
  /* Thème professionnel bleu/blanc */
  section {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    color: #1f2937;
    font-size: 22px;
    padding: 35px;
    height: 720px;
    width: 1280px;
    box-sizing: border-box;
    overflow: hidden;
    line-height: 1.25;
  }
  
  h1 {
    color: #1e40af;
    border-bottom: 3px solid #3b82f6;
    padding-bottom: 10px;
    margin-bottom: 20px;
    font-size: 2.2em;
    line-height: 1.1;
  }
  
  h2 {
    color: #1e40af;
    font-size: 1.5em;
    margin: 15px 0 10px 0;
    line-height: 1.2;
  }
  
  h3 {
    color: #374151;
    font-size: 1.2em;
    margin: 12px 0 8px 0;
    line-height: 1.2;
  }
  
  /* Animations subtiles */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate {
    animation: fadeIn 0.8s ease-out;
  }
  
  /* Code blocks */
  code {
    background: #f1f5f9;
    color: #475569;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 0.85em;
  }
  
  pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #3b82f6;
    font-size: 0.75em;
    line-height: 1.4;
    margin: 15px 0;
  }
  
  /* Split layout */
  .split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    height: 100%;
    align-items: start;
  }
  
  /* Highlight boxes */
  .highlight {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border: 2px solid #3b82f6;
    border-radius: 10px;
    padding: 20px;
    margin: 15px 0;
    font-weight: 500;
  }
  
  /* Stats */
  .stat {
    text-align: center;
    font-size: 1.4em;
    font-weight: bold;
    color: #1e40af;
    background: rgba(59, 130, 246, 0.1);
    padding: 15px;
    border-radius: 8px;
    margin: 10px 0;
  }
  
  /* Demo section */
  .demo {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: white;
    border-radius: 12px;
    padding: 40px;
    text-align: center;
    margin: 20px 0;
  }
  
  .demo h2 {
    color: #60a5fa;
    font-size: 2em;
  }
  
  /* Lists */
  ul li {
    margin-bottom: 8px;
    line-height: 1.3;
  }
  
  .check-list li::marker {
    content: "✓ ";
    color: #10b981;
    font-weight: bold;
  }
---

# Mellisync
## Digitaliser l'apiculture wallonne

<div class="animate">

**François - TFE 2025**  
*Bachelier Informatique de Gestion*  
**Défense : 20 septembre 2025**

</div>

---

# Problème Métier & Motivation Personnelle

<div class="split">
<div class="left">

## Contexte apicole wallon
- **2000+ apiculteurs** en Wallonie
- Gestion **100% papier/Excel**
- Réglementations **AFSCA complexes**
- **8 périodes apicoles** à respecter

## Solutions existantes inadaptées
- Applications génériques européennes
- **Pas de règles wallonnes** spécifiques
- Interface peu intuitive pour terrain

</div>
<div class="right animate">

## Motivation personnelle

**Passion apiculture avec mon beau-père**
- Suivi du milieu depuis plusieurs années
- Projet d'avoir mes propres ruches
- **Problème vécu** = légitimité du besoin

<div class="highlight">
<strong>Vision :</strong> Créer LA solution pour l'apiculture wallonne
</div>

</div>
</div>

---

# Infrastructure Homelab Production

<div class="split">
<div class="left">

## Choix architectural
**Contrôle total A→Z du développement**
- Serveur Ubuntu dédié 
- Configuration sécurisée manuelle
- Mise en pratique cours système

## Stack infrastructure
- **OS** : Ubuntu Server 22.04 LTS
- **Conteneurisation** : Docker + Docker Compose
- **Reverse Proxy** : Traefik v3
- **SSL** : Let's Encrypt automatique
- **DNS** : DuckDNS (nom de domaine)

</div>
<div class="right animate">

## Sécurisation avancée
```bash
# Hardening sécurité
- SSH keys only (pas de password)
- UFW Firewall configuré
- Fail2ban anti-bruteforce
- Updates automatiques
- Score Lynis : 66/100
```

<div class="stat">
Infrastructure Production-Ready
</div>

</div>
</div>

---

# Pipeline CI/CD Complet

<div class="split">
<div class="left">

## Philosophie DevOps
**Déploiement continu = Itération rapide**
- Modification code → Tests → Prod
- Corrections mises en ligne immédiatement
- Méthode agile appliquée

## Workflow automatisé
```yaml
# GitHub Actions Pipeline
1. Push code → GitHub
2. Tests Jest automatiques  
3. Build TypeScript
4. Build Docker image
5. Push vers Docker Hub
6. SSH vers serveur prod
7. Déploiement automatique
```

</div>
<div class="right animate">

## Configuration technique

**GitHub Actions**
- Tests unitaires (Jest)
- Build multi-stage Docker
- Secrets management sécurisé

**Déploiement SSH**
```bash
# Script déploiement automatique
ssh user@server << 'EOF'
  docker pull francois/mellisync:latest
  docker-compose up -d --no-deps api
EOF
```

<div class="highlight">
<strong>Résultat :</strong> Dev → Prod en 3 minutes
</div>

</div>
</div>

---

# Innovation 1 : Géolocalisation Intelligente

<div class="split">
<div class="left">

## API Nominatim OpenStreetMap
- Saisie "5 rue" → **suggestions temps réel**
- Sélection → **coordonnées GPS automatiques**
- **Debounce 300ms** pour optimiser requêtes
- **Cache local + fallback** si API indisponible

## Architecture technique
```javascript
const searchAddress = debounce(async (query) => {
  const results = await nominatim.search(query);
  return results.map(r => ({
    address: r.display_name,
    lat: r.lat, lon: r.lon
  }));
}, 300);
```

</div>
<div class="right animate">

<div class="highlight">
**CAPTURE ATTENDUE :**<br>
Formulaire création rucher
- Champ adresse avec autocomplétion temps réel
- Dropdown suggestions Nominatim
- Coordonnées GPS remplies automatiquement
- Validation géographique wallonne
</div>

**Fini les calculs manuels de distance !**

</div>
</div>

---

# Innovation 2 : QR Codes Bidirectionnels

<div class="split">
<div class="left">

## Transaction atomique Prisma
```sql
-- Pattern "Tout ou rien"
BEGIN;
  INSERT INTO ruche (nom, rucher_id);
  INSERT INTO qr_code (ruche_id, url);
  INSERT INTO relations (ruche, qr);
COMMIT;
```

## Workflow terrain
1. **Créer ruche** → QR automatique
2. **Imprimer + coller** sur ruche physique  
3. **Scanner mobile** → Navigation directe
4. **Actions contextuelles** disponibles

</div>
<div class="right animate">

<div class="highlight">
**CAPTURE ATTENDUE :**<br>
Formulaire nouvelle ruche
- Champs nom/description ruche
- QR code généré en temps réel
- URL complète visible : mellisync.be/ruche/abc123
- Boutons imprimer/régénérer QR
</div>

**Révolution UX terrain !**

</div>
</div>

---

# Innovation 3 : Actions Filtrées Intelligentes

<div class="split">
<div class="left">

## Intelligence métier embarquée
- **89 règles apicoles wallonnes** intégrées
- **8 périodes automatiques** (mars→octobre)
- **Filtrage météo temps réel** (température, pluie, vent)
- Interface qui **pense pour l'apiculteur**

## Logique contextuelle
```javascript
// Actions dynamiques selon contexte
if (temperature > 25) hideAction('nourrir');
if (rainProbability > 60) hideAction('traiter');
if (periode === 'hivernage') showOnly(['inspection']);
```

</div>
<div class="right animate">

<div class="highlight">
**CAPTURE ATTENDUE :**<br>
Interface actions ruche mobile
- Boutons actions contextuelles
- Certains grisés selon météo/période
- Info période apicole visible
- Notifications intelligentes AFSCA
- Interface "1 tap = 1 action"
</div>

**L'app comprend le métier !**

</div>
</div>

---

# Innovation 4 : Scanner QR Mobile

<div class="split">
<div class="left">

## Navigation React Router transparente
- **FAB scanner** omniprésent
- **Scan → redirection** instantanée
- **Pas d'API call**, pas d'attente
- **RBAC backend** automatique

## Technique moderne
```javascript
// qr-scanner + BarcodeDetector API
const scanner = new QrScanner(video, result => {
  // Navigation React Router directe
  navigate(`/ruche/${extractId(result)}`);
}, { highlightScanRegion: true });
```

</div>
<div class="right animate">

<div class="highlight">
**CAPTURE ATTENDUE :**<br>
Interface scanner QR mobile
- Camera preview plein écran
- Zone détection QR centrée
- FAB scanner toujours accessible
- Navigation automatique après scan
- UX optimisée terrain
</div>

**Innovation UX terrain !**

</div>
</div>

---

# Innovation 5 : PDF Officiel AFSCA

<div class="split">
<div class="left">

## Conformité réglementaire automatique
- **Format A4 officiel** AFSCA Belgique
- **Actions horodatées** avec précision GPS
- **Signatures électroniques** intégrées
- **Export prêt contrôles** officiels

## Génération serveur
```javascript
const pdf = await puppeteer.generatePDF({
  format: 'A4',
  template: 'afsca-officiel',
  data: {
    actions: actionsHorodatees,
    geolocalization: coordonneesGPS,
    apiculteur: donneesOfficielles
  }
});
```

</div>
<div class="right animate">

<div class="highlight">
**CAPTURE ATTENDUE :**<br>
PDF généré format A4 officiel
- En-tête AFSCA Belgique
- Tableau actions horodatées précises
- Coordonnées GPS du rucher
- Signature électronique apiculteur
- Format professionnel imprimable
</div>

**Conformité garantie !**

</div>
</div>

---

# Démonstration Live

<div class="demo animate">

## Mellisync en Action

**Validation du workflow complet**  
*Tout ce qu'on vient de voir, en live*

**Durée : 4 minutes**

</div>

---

# Perspectives d'Évolution

<div class="split">
<div class="left">

## Roadmap technique V2
- **Multi-langues** (FR/NL/DE/EN)
- **API publique** pour développeurs
- **IoT ruches connectées** (capteurs)  
- **Analytics prédictives** (IA/ML)
- **App mobile native** (React Native)

## Évolutions métier
- **Export comptabilité** automatique
- **Gestion coopératives** multi-apiculteurs
- **Marketplace miel** intégrée
- **Formation** apiculteurs débutants

</div>
<div class="right animate">

## Commercialisation Wallonie

**Aides publiques identifiées :**
- **Digital Wallonia** : Subventions innovation
- **Sowalfin** : Financement startup
- **BEP** : Accompagnement entrepreneur

**Business Model :**
- **Freemium** : 5 ruches gratuites
- **Premium** : 15€/mois illimité
- **Enterprise** : Coopératives apicoles

<div class="stat">
Marché wallon : 2000+ apiculteurs
</div>

</div>
</div>

---

# Questions ?

<div class="animate">

**François - TFE 2025**  
*Bachelier Informatique de Gestion*

**Mellisync : De la passion à l'innovation**

</div>