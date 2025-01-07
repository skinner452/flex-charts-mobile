import { defaultQueryOptions } from "@/api/base/defaultQueryOptions";
import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Workout, WorkoutFilters } from "@/types/workouts";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useGetWorkoutsQueryKey = (filters?: WorkoutFilters) => {
  const queryKey = ["workouts"] as any[];
  if (filters) queryKey.push(filters);
  return queryKey;
};

export const useGetWorkouts = (
  filters?: WorkoutFilters,
  options?: Partial<UseQueryOptions<Workout[]>>
) => {
  return useQuery({
    ...defaultQueryOptions,
    ...options,
    queryFn: () =>
      fetchFromAPI<Workout[]>({
        method: "GET",
        endpoint: "workouts",
        params: filters,
      }),
    queryKey: useGetWorkoutsQueryKey(filters),
  });
};
