import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Session } from "@/types/sessions";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useGetSessionsQueryKey } from "./useGetSessions";

const endpoint = "sessions";

export const usePostSessions = (
  options?: Partial<UseMutationOptions<Session, Error>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () =>
      fetchFromAPI<Session>({
        method: "POST",
        endpoint: endpoint,
      }),
    onSuccess: (session, ...rest) => {
      // Invalidate the active sessions query
      queryClient.invalidateQueries({
        queryKey: useGetSessionsQueryKey({ isActive: true }),
      });

      options?.onSuccess?.(session, ...rest);
    },
  });
};
