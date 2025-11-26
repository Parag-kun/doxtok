import { useMutation, useQuery } from "@tanstack/solid-query";
import doxtokAxios from "../lib/axios";
import type { APIResponse } from "./types";

export type DocumentUrlsRes = {
  data: { documentUrls: string[] };
  isLoading: boolean;
};

export const useDocumentUrlsQuery = () => {
  return useQuery(() => ({
    initialData: null,
    queryKey: ["get-document-urls"],
    queryFn: async () => {
      const res = await doxtokAxios.get("/documents/urls");

      return res.data as DocumentUrlsRes;
    },
  }));
};

export type AddDocumentReqBody = {
  document: File;
};

export const useAddDocumentMutation = () => {
  return useMutation(() => ({
    mutationKey: ["add-document"],
    mutationFn: async ({ document }: AddDocumentReqBody) => {
      const formdata = new FormData();
      formdata.append("document", document);

      const res = await doxtokAxios.post("/documents", formdata);

      return res.data.data as APIResponse;
    },
  }));
};

export type DeleteDocumentReqBody = {
  referenceName: string;
};

export const useDeleteDocumentMutation = () => {
  return useMutation(() => ({
    mutationKey: ["delete-document"],
    mutationFn: async ({ referenceName }: DeleteDocumentReqBody) => {
      const res = await doxtokAxios.delete(`/documents/${referenceName}`);

      return res.data.data as APIResponse;
    },
  }));
};
