import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const Documents = sqliteTable("Documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("sessionId").notNull(),
  referenceName: text("referenceName").notNull().unique(),
  originalName: text("originalName").notNull(),
});

export const Chats = sqliteTable("Chats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("sessionId").notNull(),
  question: text("question").notNull(),
  answer: text("answer"),
  createdAt: integer("createdAt").notNull(),
  updatedAt: integer("updatedAt").notNull(),
});
