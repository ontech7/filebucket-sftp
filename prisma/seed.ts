import { FeatureName, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const flags = [
    {
      name: FeatureName.PLATFORM_AVAILABLE,
      enabled: true,
      description: "Platform available to public",
    },
  ];

  for (const flag of flags) {
    await prisma.featureFlag.upsert({
      where: { name: flag.name },
      update: flag,
      create: flag,
    });
  }

  console.log("Feature flags seed complete!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
