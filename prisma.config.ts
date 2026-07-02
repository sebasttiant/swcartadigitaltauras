import { defineConfig } from "prisma/config";

// Prisma 7 moved the connection URL out of schema.prisma. The URL here is only
// used by CLI commands that need a live database (migrate, db push, seed);
// application runtime connects through the PrismaPg adapter in src/lib/db.ts.
// `prisma generate` does not need it, so leaving DATABASE_URL unset is fine for
// codegen and only fails the DB-touching commands, which is the desired signal.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
