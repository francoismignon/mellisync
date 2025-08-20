import prisma from "../src/lib/prisma";

async function main() {
  console.log("🌱 Démarrage du seeding...");
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
  console.log(`✅ ${roles.length} rôles seedés`);

  // Seeding de l'utilisateur admin
  await prisma.user.upsert({
    where: { email: "admin@mellisync.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@mellisync.com",
      password: "admin",
      roleId: 1,
    },
  });
  console.log("✅ 1 utilisateur admin seedé");

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
  console.log(`✅ ${options.length} options seedées`);

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
  console.log(`✅ ${periodes.length} périodes seedées`);

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
  console.log(`✅ ${weatherRestrictions.length} restrictions météo seedées`);

  // Seeding des actions avec la nouvelle architecture
  const actions = [
    { id: 1, label: "Confirmer présence de la reine", actionType: "toggle" },
    { id: 2, label: "Observer couvain frais", actionType: "toggle" },
    { id: 3, label: "Évaluer vitalité de la reine", actionType: "cycle" },
    { id: 4, label: "Estimer force de la ruche", actionType: "cycle" },
    { id: 5, label: "Surface & compacité du couvain", actionType: "cycle" },
    { id: 6, label: "Contrôler réserves (soupesée)", actionType: "weight" },
    { id: 7, label: "Placer pain de candi", actionType: "weight" },
    { id: 8, label: "Nourrissement 50/50", actionType: "weight" },
    { id: 9, label: "Nourrissement lourd (2/3–1/3)", actionType: "weight" },
    { id: 10, label: "Contrôle mortalité extérieure", actionType: "counter" },
    { id: 11, label: "Observer chute naturelle varroa", actionType: "counter" },
    { id: 12, label: "Compter varroas (languette graissée)", actionType: "counter" },
    { id: 13, label: "Poser traitement varroa", actionType: "cycle" },
    { id: 14, label: "Traitement acide oxalique hivernal", actionType: "toggle" },
    { id: 15, label: "Surveiller maladies", actionType: "cycle" },
    { id: 16, label: "Nettoyer plateau de fond", actionType: "toggle" },
    { id: 17, label: "Contrôle moisissures", actionType: "cycle" },
    { id: 18, label: "Contrôle visuel réserves (cadres)", actionType: "cycle" },
  ];

  for (const action of actions) {
    await prisma.action.upsert({
      where: { id: action.id },
      update: {},
      create: action,
    });
  }
  console.log(`✅ ${actions.length} actions seedées`);

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
  console.log(`✅ ${actionOptions.length} relations action-options créées`);
  console.log("🌱 Seeding terminé");
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
