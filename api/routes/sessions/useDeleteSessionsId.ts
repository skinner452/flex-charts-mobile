import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { useGetSessionsQueryKey } from "./useGetSessions";
import { useGetWorkoutsQueryKey } from "../workouts/useGetWorkouts";
import { useGetExercisesIdStatsQueryKey } from "../exercises/useGetExercisesIdStats";
import { useBaseMutation } from "@/api/base/useBaseMutation";

export const useDeleteSessionsId = (
  id: number,
  options?: Partial<UseMutationOptions>
) => {
  const queryClient = useQueryClient();

  return useBaseMutation({
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
