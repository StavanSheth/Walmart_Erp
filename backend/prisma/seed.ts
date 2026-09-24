import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Phase 1: Minimal infrastructure health record
  await prisma.healthCheck.upsert({
    where: { id: "infra-health-check-001" },
    update: {
      status: "ok"
    },
    create: {
      id: "infra-health-check-001",
      status: "ok"
    }
  });

  console.log("Phase 1 infrastructure seed completed.");
}

main()
  .catch((e) => {
    console.error("Phase 1 seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
