import prisma from "../src/lib/prisma";

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

  await prisma.user.upsert({
    where: {email: "admin@mellisync.com"},
    update:{},
    create: {
      name: "Admin",
      email: "admin@mellisync.com",
      password: "admin",
      roleId: 1
    }
  });
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
