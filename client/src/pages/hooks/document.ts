import { createEffect, createSignal } from "solid-js";
import { useCreateSessionMutation } from "../../apis/session";
import { useDocumentUrlsQuery } from "../../apis/document";
import { useQueryClient } from "@tanstack/solid-query";

export default function useDocument() {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = createSignal(true);

  const createSessionMutation = useCreateSessionMutation(queryClient);
  const getDocumentUrlsQuery = useDocumentUrlsQuery();

  createEffect(() => {
    const data = getDocumentUrlsQuery.data;

    if (data) {
      setIsLoading(data.isLoading);

      data.isLoading
        ? setTimeout(() => {
            getDocumentUrlsQuery.refetch();
          }, 2000)
        : queryClient.invalidateQueries({
            queryKey: ["get-chat"],
          });
    } else {
      setIsLoading(false);
    }
  });

  createEffect(() => {
    if (getDocumentUrlsQuery.isLoading) {
      setIsLoading(getDocumentUrlsQuery.isLoading);
    }
  });

  const hasDocuments = () => {
    return (
      getDocumentUrlsQuery.data?.data.documentUrls.length !== undefined &&
      getDocumentUrlsQuery.data.data.documentUrls.length > 0
    );
  };

  return {
    isLoading,
    createSessionMutation,
    getDocumentUrlsQuery,
    hasDocuments,
  };
}
