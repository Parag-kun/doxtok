import Elysia, { t } from "elysia";
import {
  getChatsBySessionId,
  handleResponseFromRAG,
  QUERY_CHAT_STORE,
} from "../services/chat";
import { cookieValidator } from "../utils/validators";
import { SessionID } from "../utils/crypto";

const chatRouter = new Elysia({ prefix: "/chats" })
  .get(
    "/",
    async ({ cookie: { session } }) => {
      const isLoading = QUERY_CHAT_STORE.has(session.value as SessionID);

      const chats = getChatsBySessionId(session.value);

      return {
        message: "Chats fetched successfully",
        data: { chats },
        isLoading,
      };
    },
    {
      cookie: cookieValidator,
    }
  )
  .post(
    "/",
    async ({ body, cookie: { session } }) => {
      if (QUERY_CHAT_STORE.has(session.value as SessionID)) {
        return {
          message: "A query is already being processed. Please wait.",
          data: null,
        };
      }

      QUERY_CHAT_STORE.add(session.value as SessionID);

      const { question } = body;

      const answer = await handleResponseFromRAG(question, session.value);

      QUERY_CHAT_STORE.delete(session.value as SessionID);

      return { message: "Response", data: { answer } };
    },
    {
      body: t.Object({
        question: t.String(),
      }),

      cookie: cookieValidator,
    }
  );

export default chatRouter;
