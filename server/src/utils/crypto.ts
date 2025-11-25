export type SessionID = ReturnType<typeof createSessionId>;

export const createSessionId = () => {
  return crypto.randomUUID();
};
