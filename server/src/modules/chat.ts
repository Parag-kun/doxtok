import Elysia, { t } from "elysia";
import { getChatsBySessionId } from "../services/chat";

const chatRouter = new Elysia({ prefix: "/chats" })
  .get(
    "/",
    async ({ query }) => {
      const chats = getChatsBySessionId(query.sessionId);

      return {
        message: "Chats fetched successfully",
        data: { chats },
      };
    },
    {
      query: t.Object({
        sessionId: t.String(),
      }),
    }
  )
  .post(
    "/",
    async ({ body }) => {
      return {};
    },
    {
      body: t.Object({
        question: t.String(),
        sessionId: t.String(),
      }),
    }
  );

export default chatRouter;
