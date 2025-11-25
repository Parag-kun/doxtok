import { Elysia } from "elysia";
import "./lib/llama-index/model";

import sessionRouter from "./modules/session";
import documentsRouter from "./modules/document";
import chatRouter from "./modules/chat";
import cors from "@elysiajs/cors";

const app = new Elysia();

app.get("/", ({ cookie }) => {
  return "DoxTok backend";
});

app
  .use(
    cors({
      credentials: true,
    })
  )
  .onError(({ code, error, set }) => {
    console.error("❌ Error code:", code);

    if (code === "VALIDATION") {
      set.status = 422;

      return {
        message: error.all.map((e) => e.summary).join(", "),
        success: false,
      };
    }

    console.error("❌ Runtime error:", error);
    // @ts-ignore
    console.error("Stack trace:", error.stack);
    set.status = 500;
    // @ts-ignore
    return { message: error.message, success: false };
  })
  .use(sessionRouter)
  .use(documentsRouter)
  .use(chatRouter);

app.listen({ port: 4000 });

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});
