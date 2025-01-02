import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { getQueryKey } from "@/api/base/queryKey";
import { Workout, WorkoutFilters } from "@/types/workouts";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const endpoint = "workouts";

export const useGetWorkoutsQueryKey = (filters?: WorkoutFilters) =>
  getQueryKey(endpoint, filters);

export const useGetWorkouts = (
  filters?: WorkoutFilters,
  options?: Partial<UseQueryOptions<Workout[]>>
) => {
  return useQuery({
    ...options,
    queryFn: () =>
      fetchFromAPI<Workout[]>({
        method: "GET",
        endpoint,
        params: filters,
      }),
    queryKey: useGetWorkoutsQueryKey(filters),
  });
};
