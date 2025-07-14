import "server-only";

import { prisma } from "@/lib/db";

export const updateAccessLog = async (data: {
  folder: string;
  ip: string;
  userAgent: string;
}) =>
  prisma.accessLog.create({
    data: {
      ip: data.ip,
      userAgent: data.userAgent,
      collection: {
        connect: {
          accessUrl: `/d/${data.folder}`,
        },
      },
    },
  });
