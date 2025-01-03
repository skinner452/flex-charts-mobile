import { UseQueryOptions } from "@tanstack/react-query";

export const defaultQueryOptions: Partial<UseQueryOptions<any>> = {
  staleTime: 1000 * 60 * 10, // 10 minutes
};
