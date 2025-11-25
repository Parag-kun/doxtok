import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const Documents = sqliteTable("Documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("sessionId").notNull(),
  referenceName: text("referenceName").notNull().unique(),
  originalName: text("originalName").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const Chats = sqliteTable("Chats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("sessionId").notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});
