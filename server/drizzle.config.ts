import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/drizzle/schema.ts",
  out: "./src/lib/drizzle/migrations", // folder where migrations go
  dialect: "sqlite",
  dbCredentials: {
    url: `file:dev.sqlite`, // or whatever path
  },
});
