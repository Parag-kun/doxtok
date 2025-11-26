import { eq } from "drizzle-orm";
import { Chats } from "../lib/drizzle/schema";
import sqlite from "../lib/drizzle/sqlite";
import { getTopKRelevantDocumentsFromVS } from "../lib/llama-index/storage";
import { PromptTemplateHelper, RAG_TEMPLATE } from "../lib/llama-index/prompt";
import { ollama } from "../lib/llama-index/model";
import { SessionID } from "../utils/crypto";

export const QUERY_CHAT_STORE = new Set<SessionID>();

export const getChatsBySessionId = (sessionId: string) => {
  return sqlite
    .select()
    .from(Chats)
    .where(eq(Chats.sessionId, sessionId))
    .all();
};

export const handleResponseFromRAG = async (
  question: string,
  sessionId: string
) => {
  const chat = await sqlite
    .insert(Chats)
    .values({ sessionId, question })
    .returning();

  // IIFE for instant execution
  (async () => {
    const nodes = await getTopKRelevantDocumentsFromVS(question, { sessionId });
    const context = nodes
      // @ts-ignore
      .map((node) => JSON.stringify(node.node.text))
      .join("\n\n");

    const template = new PromptTemplateHelper(RAG_TEMPLATE);
    const prompt = template.format({ context, question });

    const response = await ollama.exec({
      messages: [{ role: "system", content: prompt }],
    });

    const answer = response.newMessages
      .filter((msg) => msg.role === "assistant")
      .map((msg) => msg.content)
      .join("\n\n");

    await sqlite.update(Chats).set({ answer }).where(eq(Chats.id, chat[0].id));

    QUERY_CHAT_STORE.delete(sessionId as SessionID);
  })();
};
