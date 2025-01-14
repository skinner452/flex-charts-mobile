import { useDialog } from "@/providers/DialogProvider";
import {
  DefaultError,
  QueryClient,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";

// Copied types and parameters from useMutation
export const useBaseMutation = <
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
  queryClient?: QueryClient
) => {
  const { createDialog } = useDialog();

  return useMutation(
    {
      ...options,
      onError: (error) => {
        createDialog({
          title: "Request failed",
          content: (error as DefaultError).message,
          actions: [{ label: "OK" }],
        });
      },
    },
    queryClient
  );
};
