import { PrismaClient } from "../generated/prisma/";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seeding...");

  await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
    },
  });

  await prisma.role.upsert({
    where: { name: "BEEKEEPER" },
    update: {},
    create: {
      name: "BEEKEEPER",
    },
  });

  console.log("✅ Rôles créés");
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
