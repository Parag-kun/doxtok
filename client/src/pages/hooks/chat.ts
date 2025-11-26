import { createEffect, createSignal } from "solid-js";
import { useAskQuestionMutation, useGetChatQuery } from "../../apis/chat";
import { useQueryClient } from "@tanstack/solid-query";

export default function useChat() {
  const queryClient = useQueryClient();

  const getChatQuery = useGetChatQuery();
  const askQuestionMutation = useAskQuestionMutation(queryClient);

  const [isLoading, setIsLoading] = createSignal(false);

  createEffect(() => {
    const data = getChatQuery.data;

    if (data) {
      setIsLoading(data.isLoading);

      data.isLoading &&
        setTimeout(() => {
          getChatQuery.refetch();
        }, 2000);
    } else {
      setIsLoading(true);
    }
  });

  createEffect(() => {
    if (getChatQuery.isLoading) {
      setIsLoading(true);
    }
  });

  const hasChats = () =>
    getChatQuery.data?.data.chats && getChatQuery.data.data.chats.length > 0;

  return { isLoading, getChatQuery, hasChats, askQuestionMutation };
}
