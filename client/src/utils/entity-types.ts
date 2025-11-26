export type Chat = {
  id: number;
  sessionId: string;
  question: string;
  answer: string | null;
  createdAt: Date;
  updatedAt: Date;
};
