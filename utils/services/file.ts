import "server-only";

import { prisma } from "@/lib/db";

export const createFile = async (data: {
  collectionId: string;
  filename: string;
  originalFilename: string;
  mimetype: string;
  size: number;
}) =>
  prisma.file.create({
    data: {
      filename: data.filename,
      originalName: data.originalFilename || "",
      mimeType: data.mimetype || "",
      size: data.size,
      collection: {
        connect: {
          id: data.collectionId,
        },
      },
    },
    select: {
      id: true,
    },
  });

export const getFile = async (data: { filename: string; folder: string }) =>
  prisma.file.findFirst({
    where: {
      filename: data.filename,
      collection: {
        accessUrl: `/d/${data.folder}`,
      },
    },
    select: {
      id: true,
      filename: true,
      originalName: true,
    },
  });

export const getFiles = async (data: { folder: string }) =>
  prisma.file.findMany({
    where: {
      collection: {
        accessUrl: `/d/${data.folder}`,
      },
    },
    select: {
      filename: true,
      originalName: true,
      size: true,
      mimeType: true,
    },
  });
