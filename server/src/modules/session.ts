import Elysia, { t } from "elysia";
import {
  CREATE_SESSION_STORE,
  createSession,
  getSessionCreationTime,
  removeFileFromSession,
} from "../services/session";
import { cookieValidator } from "../utils/validators";

const sessionRouter = new Elysia({ prefix: "/sessions" })
  .get(
    "/",
    async ({ cookie: { session } }) => {
      const sessionId = session.value;

      const sessionCreatedAt = await getSessionCreationTime(sessionId);

      if (!sessionCreatedAt)
        return {
          success: false,
          message: "Session not found",
        };

      return {
        data: { sessionCreatedAt },
        message: "Session creation time fetched successfully",
        success: true,
      };
    },
    {
      cookie: cookieValidator,
    }
  )
  .post(
    "/",
    async ({ body, cookie: { session } }) => {
      const sessionId = await createSession(body.documents, (sessionId) => {
        session.set({
          value: sessionId,
          httpOnly: true,
        });

        CREATE_SESSION_STORE.add(sessionId);
      });

      CREATE_SESSION_STORE.delete(sessionId);

      return { message: "Session created!" };
    },
    {
      body: t.Object({
        documents: t.Files({ minItems: 1, maxItems: 3 }),
      }),
    }
  )
  .delete(
    "/",
    async ({ cookie: { session } }) => {
      const sessionId = session.value;

      await removeFileFromSession(sessionId);

      session.remove();

      return {
        message: "Session and associated documents removed successfully",
      };
    },
    {
      cookie: cookieValidator,
    }
  );

export default sessionRouter;
