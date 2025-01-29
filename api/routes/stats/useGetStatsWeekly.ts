import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { useBaseQuery } from "@/api/base/useBaseQuery";
import { WeeklyStats, WeeklyStatsParams } from "@/types/stats";
import { UseQueryOptions } from "@tanstack/react-query";

export const fetchGetStatsWeeklyQueryKey = (params?: WeeklyStatsParams) => {
  const queryKey = ["stats", "weekly"] as any[];
  if (params) queryKey.push(params);
  return queryKey;
};

export const useGetStatsWeekly = (
  params?: WeeklyStatsParams,
  options?: Partial<UseQueryOptions<WeeklyStats>>
) => {
  return useBaseQuery({
    ...options,
    queryFn: () =>
      fetchFromAPI<WeeklyStats>({
        method: "GET",
        endpoint: "stats/weekly",
        params,
      }),
    queryKey: fetchGetStatsWeeklyQueryKey(params),
  });
};
