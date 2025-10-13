import Elysia, { t } from "elysia";
import {
  addDocumentToSession,
  getFIleUrls,
  removeFileFromSession,
} from "../services/session";
import { getFile } from "../services/file-manager";

const documentsRouter = new Elysia({ prefix: "/documents" })
  .get(
    "/urls",
    ({ query, server }) => {
      const { sessionId } = query;
      const hostname = server!.hostname!;

      const documentUrls = getFIleUrls(hostname, sessionId);

      return { documentUrls };
    },
    {
      query: t.Object({ sessionId: t.String() }),
    }
  )
  .get(
    "/:referenceName",
    async ({ params, query, set }) => {
      const { referenceName } = params;
      const { sessionId } = query;

      const { file, fileRef } = getFile(sessionId, referenceName);

      set.headers[
        "Content-Disposition"
      ] = `inline; filename="${fileRef.originalName}"`;
      set.headers["Content-Type"] = "application/octet-stream";
      set.headers["Content-Length"] = file.size.toString();

      return file.stream();
    },
    {
      params: t.Object({ referenceName: t.String() }),
      query: t.Object({ sessionId: t.String() }),
    }
  )
  .post(
    "/",
    async ({ body }) => {
      const { document, sessionId } = body;

      await addDocumentToSession(document, sessionId);

      return { message: "Document added successfully" };
    },
    {
      body: t.Object({
        sessionId: t.String(),
        document: t.File(),
      }),
    }
  )
  .delete(
    "/:referenceName",
    async ({ query, params }) => {
      const { sessionId } = query;
      const { referenceName } = params;

      await removeFileFromSession(sessionId, referenceName);

      return { message: "Document removed successfully" };
    },
    {
      query: t.Object({
        sessionId: t.String(),
      }),
      params: t.Object({
        referenceName: t.String(),
      }),
    }
  );

export default documentsRouter;
