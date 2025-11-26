import { useMutation, useQuery } from "@tanstack/solid-query";
import toast from "solid-toast";

export const useAppQuery = useQuery;

export const useAppMutation = (...params: Parameters<typeof useMutation>) => {
  const [optionsFn, queryClientFn] = params;

  const options = optionsFn();

  return useMutation(
    () => ({
      ...options,
      onSuccess: (...params) => {
        toast.success("Success!");

        options.onSuccess?.(...params);
      },
      onError: (...params) => {
        toast.error("Error!");

        options.onError?.(...params);
      },
    }),
    queryClientFn
  );
};
