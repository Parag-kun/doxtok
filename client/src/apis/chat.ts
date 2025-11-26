import { useMutation, useQuery } from "@tanstack/solid-query";
import doxtokAxios from "../lib/axios";
import type { Chat } from "../utils/entity-types";
import { type QueryClient } from "@tanstack/solid-query";

export type GetChatResBody = {
  data: {
    chats: Chat[];
  };
  isLoading: boolean;
};

export const useGetChatQuery = () => {
  return useQuery(() => ({
    initialData: null,
    queryKey: ["get-chat"],
    queryFn: async () => {
      const res = await doxtokAxios.get("/chats");

      return res.data as GetChatResBody;
    },
  }));
};

export type AskQuestionReqBody = {
  question: string;
};

export const useAskQuestionMutation = (queryClient: QueryClient) => {
  return useMutation(() => ({
    mutationKey: ["ask-question"],
    mutationFn: async ({ question }: AskQuestionReqBody) => {
      const res = await doxtokAxios.post("/chats", { question });

      return res.data.data?.answer as string | null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-chat"],
      });
    },
  }));
};
