// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Next.js dev server melakukan hot-reload modul, yang bisa membuat banyak
// instance PrismaClient baru jika tidak di-cache. Pola singleton di bawah
// adalah rekomendasi resmi Prisma untuk Next.js.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
