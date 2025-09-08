import prisma from "../src/lib/prisma";
import AuthService from "../src/services/authService";

async function main() {
  console.log("Démarrage du seeding...");
  //Seeding des rôles
  const roles = [
    { id: 1, name: "ADMIN" },
    { id: 2, name: "BEEKEEPER" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
  console.log(`${roles.length} rôles seedés`);

  // Seeding de l'utilisateur admin avec mot de passe hashé
  const hashedAdminPassword = await AuthService.hashPassword("admin");
  await prisma.user.upsert({
    where: { email: "admin@mellisync.com" },
    update: {
      password: hashedAdminPassword // Met à jour avec hash si l'utilisateur existe
    },
    create: {
      name: "Admin",
      email: "admin@mellisync.com",
      password: hashedAdminPassword,
      roleId: 1,
    },
  });
  console.log("1 utilisateur admin seedé (mot de passe hashé)");

  // Seeding de l'utilisateur beekeeper test
  const hashedBeekeeperPassword = await AuthService.hashPassword("francois");
  await prisma.user.upsert({
    where: { email: "francois@mellisync.com" },
    update: {
      password: hashedBeekeeperPassword
    },
    create: {
      name: "François",
      email: "francois@mellisync.com",
      password: hashedBeekeeperPassword,
      roleId: 2, // BEEKEEPER role
    },
  });
  console.log("1 utilisateur beekeeper seedé (François)");

  // Seeding des options complètes (basées sur panel.html + user stories MUST HAVE)
  const options = [
    // Options générales toggle
    { id: 1, label: "Non" },
    { id: 2, label: "Oui" },
    { id: 3, label: "Non fait" },
    { id: 4, label: "Fait" },
    { id: 5, label: "À faire" },
    
    // Options force/qualité
    { id: 6, label: "Faible" },
    { id: 7, label: "Moyenne" },
    { id: 8, label: "Forte" },
    { id: 9, label: "Bonne" },
    { id: 10, label: "Mauvaise" },
    
    // Options spécialisées reine
    { id: 11, label: "Ponte irrégulière" },
    { id: 12, label: "À remplacer" },
    
    // Options état/quantité
    { id: 13, label: "Aucune" },
    { id: 14, label: "Aucun" },
    { id: 15, label: "Légère" },
    { id: 16, label: "Marquée" },
    { id: 17, label: "Insuffisant" },
    { id: 18, label: "Correct" },
    { id: 19, label: "Abondant" },
    
    // Options traitement varroa (action 13)
    { id: 20, label: "Lanières Bayvarol" },
    { id: 21, label: "Lanières amitraz" },
    { id: 22, label: "Thymol" },
    { id: 23, label: "Acide formique" },
    { id: 24, label: "Acide oxalique" },
    
    // Options surveillance maladies (action 15)
    { id: 25, label: "Rien" },
    { id: 26, label: "Suspicion" },
    { id: 27, label: "Signes clairs" },
  ];

  for (const option of options) {
    await prisma.option.upsert({
      where: { id: option.id },
      update: {},
      create: option,
    });
  }
  console.log(`${options.length} options seedées`);

  // Seeding des périodes
  const periodes = [
    { id: 1, label: "hiver" },
    { id: 2, label: "fin_hiver" },
    { id: 3, label: "miellée_printemps" },
    { id: 4, label: "inter_miellée" },
    { id: 5, label: "pré_traitement" },
    { id: 6, label: "traitement_été" },
    { id: 7, label: "préparation_hiver" },
    { id: 8, label: "traitement_hiver" },
  ];

  for (const periode of periodes) {
    await prisma.periode.upsert({
      where: { id: periode.id },
      update: {},
      create: periode,
    });
  }
  console.log(`${periodes.length} périodes seedées`);

  // Seeding des restrictions météo
  const weatherRestrictions = [
    { id: 1, label: "Ensoleillé" },
    { id: 2, label: "Partiellement nuageux" },
    { id: 3, label: "Pluie" },
    { id: 4, label: "Averses" },
    { id: 5, label: "Orage" },
    { id: 6, label: "Vent fort" },
  ];

  for (const weather of weatherRestrictions) {
    await prisma.weatherRestriction.upsert({
      where: { id: weather.id },
      update: {},
      create: weather,
    });
  }
  console.log(`${weatherRestrictions.length} restrictions météo seedées`);

  // Seeding des actions avec actionType, incrementStep et restrictions température selon REGLES_METIER_APICOLES.md
  const actions = [
    // CYCLE actions avec restrictions température (ouverture ruche nécessaire)
    { id: 1, label: "Confirmer présence de la reine", actionType: "CYCLE", temperatureMin: 15 },
    { id: 2, label: "Observer couvain frais", actionType: "CYCLE", temperatureMin: 15 },
    { id: 3, label: "Évaluer vitalité de la reine", actionType: "CYCLE", temperatureMin: 15 },
    { id: 4, label: "Estimer force de la ruche", actionType: "CYCLE" }, // Observation externe, pas de restriction
    { id: 5, label: "Surface & compacité du couvain", actionType: "CYCLE", temperatureMin: 15 },
    { id: 13, label: "Poser traitement varroa", actionType: "CYCLE" }, // Pas de restriction température
    { id: 14, label: "Traitement acide oxalique hivernal", actionType: "CYCLE", temperatureMin: 3, temperatureMax: 8 }, // Conditions spécifiques hiver
    { id: 15, label: "Surveiller maladies", actionType: "CYCLE" }, // Pas de restriction température
    { id: 16, label: "Nettoyer plateau de fond", actionType: "CYCLE" }, // pas de restriction
    { id: 17, label: "Contrôle moisissures", actionType: "CYCLE" }, // Pas de restriction température
    { id: 18, label: "Contrôle visuel réserves (cadres)", actionType: "CYCLE", temperatureMin: 15 }, // Ouverture ruche
    
    // INCREMENT actions (pas de restriction température - interventions externes ou rapides)
    { id: 6, label: "Contrôler réserves (soupesée)", actionType: "INCREMENT", incrementStep: 0.5 }, // 0.5kg - soupesée externe
    { id: 7, label: "Placer pain de candi", actionType: "INCREMENT", incrementStep: 0.5 }, // 0.5kg - intervention rapide
    { id: 8, label: "Nourrissement 50/50", actionType: "INCREMENT", incrementStep: 0.5 }, // 0.5L - intervention rapide
    { id: 9, label: "Nourrissement lourd (2/3–1/3)", actionType: "INCREMENT", incrementStep: 1 }, // 1L - intervention rapide
    { id: 10, label: "Contrôle mortalité extérieure", actionType: "INCREMENT", incrementStep: 10 }, // 10 abeilles - observation externe
    { id: 11, label: "Observer chute naturelle varroa", actionType: "INCREMENT", incrementStep: 5 }, // 5 varroas - plateau de fond
    { id: 12, label: "Compter varroas (languette graissée)", actionType: "INCREMENT", incrementStep: 1 }, // 1 varroa - contrôle plateau
  ];

  for (const action of actions) {
    await prisma.action.upsert({
      where: { id: action.id },
      update: action,
      create: action,
    });
  }
  console.log(`${actions.length} actions seedées`);

  // Seeding des relations ActionOption complètes (18 actions MUST HAVE)
  const actionOptions = [
    // Action 1: Confirmer présence de la reine (toggle: Non, Oui)
    { actionId: 1, optionId: 1 }, // Non
    { actionId: 1, optionId: 2 }, // Oui
    
    // Action 2: Observer couvain frais (toggle: Non, Oui)
    { actionId: 2, optionId: 1 }, // Non
    { actionId: 2, optionId: 2 }, // Oui
    
    // Action 3: Évaluer vitalité reine (cycle: Faible, Ponte irrégulière, Moyenne, Bonne, À remplacer)
    { actionId: 3, optionId: 6 }, // Faible
    { actionId: 3, optionId: 11 }, // Ponte irrégulière
    { actionId: 3, optionId: 7 }, // Moyenne
    { actionId: 3, optionId: 9 }, // Bonne
    { actionId: 3, optionId: 12 }, // À remplacer
    
    // Action 4: Force ruche (cycle: Faible, Moyenne, Forte)
    { actionId: 4, optionId: 6 }, // Faible
    { actionId: 4, optionId: 7 }, // Moyenne
    { actionId: 4, optionId: 8 }, // Forte
    
    // Action 5: Surface couvain (cycle: Mauvaise, Moyenne, Bonne)
    { actionId: 5, optionId: 10 }, // Mauvaise
    { actionId: 5, optionId: 7 }, // Moyenne
    { actionId: 5, optionId: 9 }, // Bonne
    
    // Actions 6-12 : weight/counter (pas d'options nécessaires)
    
    // Action 13: Traitement varroa (cycle: Aucun, Lanières Bayvarol, Lanières amitraz, Thymol, Acide formique, Acide oxalique)
    { actionId: 13, optionId: 14 }, // Aucun
    { actionId: 13, optionId: 20 }, // Lanières Bayvarol
    { actionId: 13, optionId: 21 }, // Lanières amitraz
    { actionId: 13, optionId: 22 }, // Thymol
    { actionId: 13, optionId: 23 }, // Acide formique
    { actionId: 13, optionId: 24 }, // Acide oxalique
    
    // Action 14: Traitement acide oxalique hivernal (toggle: Non fait, Fait)
    { actionId: 14, optionId: 3 }, // Non fait
    { actionId: 14, optionId: 4 }, // Fait
    
    // Action 15: Surveiller maladies (cycle: Rien, Suspicion, Signes clairs)
    { actionId: 15, optionId: 25 }, // Rien
    { actionId: 15, optionId: 26 }, // Suspicion
    { actionId: 15, optionId: 27 }, // Signes clairs
    
    // Action 16: Nettoyer plateau (toggle: À faire, Fait)
    { actionId: 16, optionId: 5 }, // À faire
    { actionId: 16, optionId: 4 }, // Fait
    
    // Action 17: Contrôle moisissures (cycle: Aucune, Légère, Marquée)
    { actionId: 17, optionId: 13 }, // Aucune
    { actionId: 17, optionId: 15 }, // Légère
    { actionId: 17, optionId: 16 }, // Marquée
    
    // Action 18: Contrôle visuel réserves (cycle: Insuffisant, Correct, Abondant)
    { actionId: 18, optionId: 17 }, // Insuffisant
    { actionId: 18, optionId: 18 }, // Correct
    { actionId: 18, optionId: 19 }, // Abondant
  ];

  for (const actionOption of actionOptions) {
    await prisma.actionOption.upsert({
      where: { 
        actionId_optionId: { 
          actionId: actionOption.actionId, 
          optionId: actionOption.optionId 
        } 
      },
      update: {},
      create: actionOption,
    });
  }
  console.log(`${actionOptions.length} relations action-options créées`);

  // Seeding des relations ActionPeriode selon REGLES_METIER_APICOLES.md
  const actionPeriodes = [
    // Action 1: Confirmer présence reine (périodes actives)
    { actionId: 1, periodeId: 3 }, // miellée_printemps
    { actionId: 1, periodeId: 4 }, // inter_miellée
    { actionId: 1, periodeId: 5 }, // pré_traitement
    { actionId: 1, periodeId: 6 }, // traitement_été
    { actionId: 1, periodeId: 7 }, // préparation_hiver
    
    // Action 2: Observer couvain frais (mêmes périodes que présence reine)
    { actionId: 2, periodeId: 3 }, // miellée_printemps
    { actionId: 2, periodeId: 4 }, // inter_miellée
    { actionId: 2, periodeId: 5 }, // pré_traitement
    { actionId: 2, periodeId: 6 }, // traitement_été
    { actionId: 2, periodeId: 7 }, // préparation_hiver
    
    // Action 3: Évaluer vitalité reine (mêmes périodes)
    { actionId: 3, periodeId: 3 }, // miellée_printemps
    { actionId: 3, periodeId: 4 }, // inter_miellée
    { actionId: 3, periodeId: 5 }, // pré_traitement
    { actionId: 3, periodeId: 6 }, // traitement_été
    { actionId: 3, periodeId: 7 }, // préparation_hiver
    
    // Action 4: Force colonie (toutes périodes sauf hiver strict)
    { actionId: 4, periodeId: 2 }, // fin_hiver
    { actionId: 4, periodeId: 3 }, // miellée_printemps
    { actionId: 4, periodeId: 4 }, // inter_miellée
    { actionId: 4, periodeId: 5 }, // pré_traitement
    { actionId: 4, periodeId: 6 }, // traitement_été
    { actionId: 4, periodeId: 7 }, // préparation_hiver
    
    // Action 5: Surface couvain (mêmes que présence reine)
    { actionId: 5, periodeId: 3 }, // miellée_printemps
    { actionId: 5, periodeId: 4 }, // inter_miellée
    { actionId: 5, periodeId: 5 }, // pré_traitement
    { actionId: 5, periodeId: 6 }, // traitement_été
    { actionId: 5, periodeId: 7 }, // préparation_hiver
    
    // Action 6: Contrôler réserves (toute l'année)
    { actionId: 6, periodeId: 1 }, // hiver
    { actionId: 6, periodeId: 2 }, // fin_hiver
    { actionId: 6, periodeId: 3 }, // miellée_printemps
    { actionId: 6, periodeId: 4 }, // inter_miellée
    { actionId: 6, periodeId: 5 }, // pré_traitement
    { actionId: 6, periodeId: 6 }, // traitement_été
    { actionId: 6, periodeId: 7 }, // préparation_hiver
    { actionId: 6, periodeId: 8 }, // traitement_hiver
    
    // Action 7: Placer pain candi (hiver et fin hiver)
    { actionId: 7, periodeId: 1 }, // hiver
    { actionId: 7, periodeId: 2 }, // fin_hiver
    { actionId: 7, periodeId: 7 }, // préparation_hiver
    { actionId: 7, periodeId: 8 }, // traitement_hiver
    
    // Action 8: Nourrissement 50/50 (stimulation)
    { actionId: 8, periodeId: 2 }, // fin_hiver
    { actionId: 8, periodeId: 7 }, // préparation_hiver
    
    // Action 9: Nourrissement lourd (constitution réserves)
    { actionId: 9, periodeId: 1 }, // hiver
    { actionId: 9, periodeId: 2 }, // fin_hiver
    { actionId: 9, periodeId: 7 }, // préparation_hiver
    { actionId: 9, periodeId: 8 }, // traitement_hiver
    
    // Action 10: Mortalité extérieure (toutes sauf hiver strict)
    { actionId: 10, periodeId: 2 }, // fin_hiver
    { actionId: 10, periodeId: 3 }, // miellée_printemps
    { actionId: 10, periodeId: 4 }, // inter_miellée
    { actionId: 10, periodeId: 5 }, // pré_traitement
    { actionId: 10, periodeId: 6 }, // traitement_été
    { actionId: 10, periodeId: 7 }, // préparation_hiver
    
    // Action 11: Chute varroa (contrôle période varroa)
    { actionId: 11, periodeId: 4 }, // inter_miellée
    { actionId: 11, periodeId: 5 }, // pré_traitement
    { actionId: 11, periodeId: 6 }, // traitement_été
    { actionId: 11, periodeId: 7 }, // préparation_hiver
    { actionId: 11, periodeId: 8 }, // traitement_hiver
    { actionId: 11, periodeId: 1 }, // hiver
    
    // Action 12: Compter varroas (mêmes périodes)
    { actionId: 12, periodeId: 4 }, // inter_miellée
    { actionId: 12, periodeId: 5 }, // pré_traitement
    { actionId: 12, periodeId: 6 }, // traitement_été
    { actionId: 12, periodeId: 7 }, // préparation_hiver
    
    // Action 18: Contrôle visuel réserves (mêmes que présence reine)
    { actionId: 18, periodeId: 3 }, // miellée_printemps
    { actionId: 18, periodeId: 4 }, // inter_miellée
    { actionId: 18, periodeId: 5 }, // pré_traitement
    { actionId: 18, periodeId: 6 }, // traitement_été
    { actionId: 18, periodeId: 7 }, // préparation_hiver
  ];

  for (const actionPeriode of actionPeriodes) {
    await prisma.actionPeriode.upsert({
      where: { 
        actionId_periodeId: { 
          actionId: actionPeriode.actionId, 
          periodeId: actionPeriode.periodeId 
        } 
      },
      update: {},
      create: actionPeriode,
    });
  }
  console.log(`${actionPeriodes.length} relations action-périodes créées`);

  // Seeding des relations ActionWeatherRestriction selon REGLES_METIER_APICOLES.md
  const actionWeatherRestrictions = [
    // Actions nécessitant ouverture ruche = interdites par mauvais temps
    // Restrictions: Pluie (3), Averses (4), Orage (5), Vent fort (6)
    
    // Action 1: Confirmer présence reine (ouverture ruche)
    { actionId: 1, weatherRestrictionId: 3 }, // Pluie
    { actionId: 1, weatherRestrictionId: 4 }, // Averses
    { actionId: 1, weatherRestrictionId: 5 }, // Orage
    { actionId: 1, weatherRestrictionId: 6 }, // Vent fort
    
    // Action 2: Observer couvain (ouverture prolongée)
    { actionId: 2, weatherRestrictionId: 3 }, // Pluie
    { actionId: 2, weatherRestrictionId: 4 }, // Averses
    { actionId: 2, weatherRestrictionId: 5 }, // Orage
    { actionId: 2, weatherRestrictionId: 6 }, // Vent fort
    
    // Action 3: Évaluer vitalité reine (ouverture ruche)
    { actionId: 3, weatherRestrictionId: 3 }, // Pluie
    { actionId: 3, weatherRestrictionId: 4 }, // Averses
    { actionId: 3, weatherRestrictionId: 5 }, // Orage
    { actionId: 3, weatherRestrictionId: 6 }, // Vent fort
    
    // Action 5: Surface couvain (inspection cadres)
    { actionId: 5, weatherRestrictionId: 3 }, // Pluie
    { actionId: 5, weatherRestrictionId: 4 }, // Averses
    { actionId: 5, weatherRestrictionId: 5 }, // Orage
    { actionId: 5, weatherRestrictionId: 6 }, // Vent fort
    
    // Action 18: Contrôle visuel réserves (ouverture ruche)
    { actionId: 18, weatherRestrictionId: 3 }, // Pluie
    { actionId: 18, weatherRestrictionId: 4 }, // Averses
    { actionId: 18, weatherRestrictionId: 5 }, // Orage
    { actionId: 18, weatherRestrictionId: 6 }, // Vent fort
    
    // Note: Actions 4,6,7,8,9,10,11,12,13,14,15,16,17 = interventions externes/rapides = pas de restrictions météo
  ];

  for (const actionWeatherRestriction of actionWeatherRestrictions) {
    await prisma.actionWeatherRestriction.upsert({
      where: { 
        actionId_weatherRestrictionId: { 
          actionId: actionWeatherRestriction.actionId, 
          weatherRestrictionId: actionWeatherRestriction.weatherRestrictionId 
        } 
      },
      update: {},
      create: actionWeatherRestriction,
    });
  }
  console.log(`${actionWeatherRestrictions.length} relations action-météo créées`);
  console.log("Seeding terminé");
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
