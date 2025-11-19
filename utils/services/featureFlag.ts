import "server-only";

import { prisma } from "@/lib/db";
import { FeatureName } from "@prisma/client";

export const isFeatureEnabled = async (featureFlag: FeatureName) =>
  prisma.featureFlag.findUnique({
    where: {
      name: featureFlag,
    },
  });
