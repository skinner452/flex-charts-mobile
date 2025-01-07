import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Session } from "@/types/sessions";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useGetSessionsQueryKey } from "./useGetSessions";

export const usePostSessions = (
  options?: Partial<UseMutationOptions<Session, Error>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () =>
      fetchFromAPI<Session>({
        method: "POST",
        endpoint: "sessions",
      }),
    onSuccess: (session, ...rest) => {
      queryClient.invalidateQueries({
        queryKey: useGetSessionsQueryKey(),
      });

      options?.onSuccess?.(session, ...rest);
    },
  });
};
