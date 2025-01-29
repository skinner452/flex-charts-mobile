import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Session } from "@/types/sessions";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { fetchGetSessionsQueryKey } from "./useGetSessions";
import { useBaseMutation } from "@/api/base/useBaseMutation";
import { invalidateQueryKeys } from "@/utils/invalidateQueryKeys";
import { fetchStatsQueryKey } from "../stats/fetchStatsQueryKey";

export const usePostSessions = (
  options?: Partial<UseMutationOptions<Session, Error>>
) => {
  const queryClient = useQueryClient();

  return useBaseMutation({
    ...options,
    mutationFn: () =>
      fetchFromAPI<Session>({
        method: "POST",
        endpoint: "sessions",
      }),
    onSuccess: (session, ...rest) => {
      invalidateQueryKeys(
        queryClient,
        fetchGetSessionsQueryKey(),
        fetchStatsQueryKey()
      );

      options?.onSuccess?.(session, ...rest);
    },
  });
};
