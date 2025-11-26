import { QueryClient, useMutation, useQuery } from "@tanstack/solid-query";
import doxtokAxios from "../lib/axios";
import type { APIResponse } from "./types";

export const useGetSessionQuery = () => {
  return useQuery(() => ({
    initialData: null,
    queryKey: ["get-session"],
    queryFn: async () => {
      const res = await doxtokAxios.get("/sessions");
      const dateString = res.data.data?.sessionCreatedAt;

      return Date.parse(dateString) ? new Date(dateString) : null;
    },
  }));
};

export type CreateSessionReqBody = {
  documents: File[];
};

export const useCreateSessionMutation = (queryClient: QueryClient) => {
  return useMutation(() => ({
    mutationKey: ["create-session"],
    mutationFn: async ({ documents }: CreateSessionReqBody) => {
      const formdata = new FormData();

      documents.forEach((doc) => {
        formdata.append("documents", doc);
      });

      const res = await doxtokAxios.post("/sessions", formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.data as APIResponse;
    },
    onSuccess: () => {
      window.location.href = "/";
    },
  }));
};

export const useDeleteSessionMutation = (queryClient: QueryClient) => {
  return useMutation(() => ({
    mutationKey: ["delete-session"],
    mutationFn: async () => {
      const res = await doxtokAxios.delete("/sessions");

      return res.data.data as APIResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-session"] });
      queryClient.invalidateQueries({ queryKey: ["get-document-urls"] });
      queryClient.invalidateQueries({ queryKey: ["get-chat"] });
      // Hard reload to clear all cached data
      window.location.reload();
    },
  }));
};
