import { disconnectPrisma } from "../src/common/database/prisma.js";

async function main() {
  // Phase 1 placeholder: No seed records required.
  // Real ERP domain seed system will be introduced in Phase 3.
}

main()
  .catch((e) => {
    console.error("Phase 1 seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await disconnectPrisma();
  });
