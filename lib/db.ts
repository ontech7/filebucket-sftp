import "server-only";

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_POOLING_URL}`;

const adapter = new PrismaNeon({ connectionString });
export const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === "development") global.prisma = prisma;
