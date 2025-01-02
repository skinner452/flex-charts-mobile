import { QueryKey } from "@tanstack/react-query";

export const getQueryKey = (endpoint: string, params?: DataValues) => {
  const queryKey: any[] = [endpoint];
  if (params) {
    queryKey.push(params);
  }
  return queryKey as QueryKey;
};
