import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import sessionRouter from "./modules/session";
import { FILE_UPLOAD_DIR } from "./services/file-manager";
import documentsRouter from "./modules/document";

const app = new Elysia();

app.get("/", () => "DoxTok backend");

app
  .use(staticPlugin({ assets: FILE_UPLOAD_DIR, prefix: "/static" }))
  .use(sessionRouter)
  .use(documentsRouter);

app.listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
