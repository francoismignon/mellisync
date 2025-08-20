"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../src/lib/prisma"));
async function main() {
    console.log("🌱 Démarrage du seeding...");
    //Seeding des rôles
    const roles = [
        { id: 1, name: "ADMIN" },
        { id: 2, name: "BEEKEEPER" },
    ];
    for (const role of roles) {
        await prisma_1.default.role.upsert({
            where: { name: role.name },
            update: {},
            create: role,
        });
    }
    console.log(`✅ ${roles.length} rôles seedés`);
    // Seeding de l'utilisateur admin
    await prisma_1.default.user.upsert({
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
        await prisma_1.default.option.upsert({
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
        await prisma_1.default.periode.upsert({
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
        await prisma_1.default.weatherRestriction.upsert({
            where: { id: weather.id },
            update: {},
            create: weather,
        });
    }
    console.log(`✅ ${weatherRestrictions.length} restrictions météo seedées`);
    // Seeding des actions avec actionType et incrementStep finaux
    const actions = [
        // CYCLE actions (incrementStep undefined = NULL en DB)
        { id: 1, label: "Confirmer présence de la reine", actionType: "CYCLE" },
        { id: 2, label: "Observer couvain frais", actionType: "CYCLE" },
        { id: 3, label: "Évaluer vitalité de la reine", actionType: "CYCLE" },
        { id: 4, label: "Estimer force de la ruche", actionType: "CYCLE" },
        { id: 5, label: "Surface & compacité du couvain", actionType: "CYCLE" },
        { id: 13, label: "Poser traitement varroa", actionType: "CYCLE" },
        { id: 14, label: "Traitement acide oxalique hivernal", actionType: "CYCLE" },
        { id: 15, label: "Surveiller maladies", actionType: "CYCLE" },
        { id: 16, label: "Nettoyer plateau de fond", actionType: "CYCLE" },
        { id: 17, label: "Contrôle moisissures", actionType: "CYCLE" },
        { id: 18, label: "Contrôle visuel réserves (cadres)", actionType: "CYCLE" },
        // INCREMENT actions avec coefficients optimisés
        { id: 6, label: "Contrôler réserves (soupesée)", actionType: "INCREMENT", incrementStep: 0.5 }, // 0.5kg
        { id: 7, label: "Placer pain de candi", actionType: "INCREMENT", incrementStep: 0.5 }, // 0.5kg
        { id: 8, label: "Nourrissement 50/50", actionType: "INCREMENT", incrementStep: 0.5 }, // 0.5L
        { id: 9, label: "Nourrissement lourd (2/3–1/3)", actionType: "INCREMENT", incrementStep: 1 }, // 1L
        { id: 10, label: "Contrôle mortalité extérieure", actionType: "INCREMENT", incrementStep: 10 }, // 10 abeilles
        { id: 11, label: "Observer chute naturelle varroa", actionType: "INCREMENT", incrementStep: 5 }, // 5 varroas
        { id: 12, label: "Compter varroas (languette graissée)", actionType: "INCREMENT", incrementStep: 1 }, // 1 varroa
    ];
    for (const action of actions) {
        await prisma_1.default.action.upsert({
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
        await prisma_1.default.actionOption.upsert({
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
    await prisma_1.default.$disconnect();
});
//# sourceMappingURL=seed.js.map