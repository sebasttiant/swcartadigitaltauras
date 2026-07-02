import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Prisma 7 driver-adapter client. The client is created lazily on first use so
// that importing this module (e.g. during `next build`'s static analysis) never
// requires DATABASE_URL — only actually querying the database does. In dev the
// instance is cached on globalThis to survive HMR and avoid connection storms.

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. The admin/menu database is unavailable.",
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/** Get the shared PrismaClient, constructing it on first use. Server-only. */
export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}
