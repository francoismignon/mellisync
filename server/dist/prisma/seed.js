"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../src/lib/prisma"));
async function main() {
    console.log("🌱 Démarrage du seeding...");
    await prisma_1.default.role.upsert({
        where: { name: "ADMIN" },
        update: {},
        create: {
            name: "ADMIN",
        },
    });
    await prisma_1.default.role.upsert({
        where: { name: "BEEKEEPER" },
        update: {},
        create: {
            name: "BEEKEEPER",
        },
    });
    await prisma_1.default.user.upsert({
        where: { email: "admin@mellisync.com" },
        update: {},
        create: {
            name: "Admin",
            email: "admin@mellisync.com",
            password: "admin",
            roleId: 1
        }
    });
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