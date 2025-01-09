import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useGetSessionsQueryKey } from "./useGetSessions";
import { useGetWorkoutsQueryKey } from "../workouts/useGetWorkouts";
import { useGetExercisesIdStatsQueryKey } from "../exercises/useGetExercisesIdStats";

export const useDeleteSessionsId = (
  id: number,
  options?: Partial<UseMutationOptions>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () =>
      fetchFromAPI({
        method: "DELETE",
        endpoint: `sessions/${id}`,
      }),
    onSuccess: (...rest) => {
      queryClient.invalidateQueries({
        queryKey: useGetSessionsQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: useGetWorkoutsQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: useGetExercisesIdStatsQueryKey(),
      });

      options?.onSuccess?.(...rest);
    },
  });
};
