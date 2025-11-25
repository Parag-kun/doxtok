import { t } from "elysia";

export const cookieValidator = t.Cookie({
  session: t.String(),
});
