import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { useBaseQuery } from "@/api/base/useBaseQuery";
import { Workout, WorkoutFilters } from "@/types/workouts";
import { UseQueryOptions } from "@tanstack/react-query";

export const fetchGetWorkoutsQueryKey = (filters?: WorkoutFilters) => {
  const queryKey = ["workouts"] as any[];
  if (filters) queryKey.push(filters);
  return queryKey;
};

export const useGetWorkouts = (
  filters?: WorkoutFilters,
  options?: Partial<UseQueryOptions<Workout[]>>
) => {
  return useBaseQuery({
    ...options,
    queryFn: () =>
      fetchFromAPI<Workout[]>({
        method: "GET",
        endpoint: "workouts",
        params: filters,
      }),
    queryKey: fetchGetWorkoutsQueryKey(filters),
  });
};
