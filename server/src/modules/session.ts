import Elysia, { t } from "elysia";
import { createSession, removeFileFromSession } from "../services/session";

const sessionRouter = new Elysia({ prefix: "/sessions" })
  .post(
    "/",
    async ({ body }) => {
      const sessionId = await createSession(body.documents);

      return { sessionId };
    },
    {
      body: t.Object({
        documents: t.Files({ minItems: 1, maxItems: 3 }),
      }),
    }
  )
  .delete(
    "/",
    async ({ query }) => {
      const { sessionId } = query;

      await removeFileFromSession(sessionId);

      return {
        message: "Session and associated documents removed successfully",
      };
    },
    {
      query: t.Object({
        sessionId: t.String(),
      }),
    }
  );

export default sessionRouter;
