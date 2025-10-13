import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations", // folder where migrations go
  dialect: "sqlite",
  dbCredentials: {
    url: `file:dev.sqlite`, // or whatever path
  },
});
