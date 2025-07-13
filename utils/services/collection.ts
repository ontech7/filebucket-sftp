import "server-only";

import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { getExpireDate } from "../date";

export const createCollection = async (data: {
  name?: string;
  folder: string;
  password?: string;
  expireDays: number;
}) =>
  prisma.collection.create({
    data: {
      name: data.name,
      accessUrl: `/d/${data.folder}`,
      password: data.password ? await bcrypt.hash(data.password, 10) : null,
      expiresAt: getExpireDate(data.expireDays),
    },
    select: {
      id: true,
      accessUrl: true,
    },
  });

export const getCollection = async (data: { folder: string }) =>
  prisma.collection.findFirst({
    where: {
      accessUrl: `/d/${data.folder}`,
    },
    select: {
      id: true,
      name: true,
      password: true,
      expiresAt: true,
    },
  });

export const deleteCollection = async (data: { folder: string }) =>
  prisma.collection.delete({
    where: {
      accessUrl: `/d/${data.folder}`,
    },
    select: {
      id: true,
    },
  });

export const getCollections = async () =>
  prisma.collection.findMany({
    select: {
      id: true,
      accessUrl: true,
      expiresAt: true,
    },
  });
