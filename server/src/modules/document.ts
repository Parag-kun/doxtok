import Elysia, { t } from "elysia";
import {
  addDocumentToSession,
  CREATE_SESSION_STORE,
  getFIleUrls,
  removeFileFromSession,
} from "../services/session";
import { DOCUMENT_OPERATION_STORE, getFile } from "../services/file-manager";
import { cookieValidator } from "../utils/validators";
import { SessionID } from "../utils/crypto";

const documentsRouter = new Elysia({ prefix: "/documents" })
  .get(
    "/urls",
    ({ cookie: { session } }) => {
      console.log("Fetching document URLs for session:", session.value);

      if (
        CREATE_SESSION_STORE.has(session.value as SessionID) ||
        DOCUMENT_OPERATION_STORE.has(session.value as SessionID)
      ) {
        return {
          isLoading: true,
          data: { documentUrls: [] },
        };
      }

      const documentUrls = getFIleUrls(session.value);

      return { data: { documentUrls }, isLoading: false };
    },
    {
      cookie: cookieValidator,
    }
  )
  .get(
    "/:referenceName",
    async ({ params, set, cookie: { session } }) => {
      const { referenceName } = params;

      const { file, fileRef } = getFile(session.value, referenceName);

      set.headers[
        "Content-Disposition"
      ] = `inline; filename="${fileRef.originalName}"`;
      set.headers["Content-Type"] = "application/octet-stream";
      set.headers["Content-Length"] = file.size.toString();

      return file.stream();
    },
    {
      params: t.Object({ referenceName: t.String() }),
      cookie: cookieValidator,
    }
  )
  .post(
    "/",
    async ({ body, cookie: { session } }) => {
      const { document } = body;

      await addDocumentToSession(document, session.value);

      return { message: "Document added successfully" };
    },
    {
      body: t.Object({
        sessionId: t.String(),
        document: t.File(),
      }),
      cookie: cookieValidator,
    }
  )
  .delete(
    "/:referenceName",
    async ({ params, cookie: { session } }) => {
      const { referenceName } = params;

      await removeFileFromSession(session.value, referenceName);

      return { message: "Document removed successfully" };
    },
    {
      params: t.Object({
        referenceName: t.String(),
      }),
      cookie: cookieValidator,
    }
  );

export default documentsRouter;
