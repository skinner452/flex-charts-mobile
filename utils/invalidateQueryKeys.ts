import { QueryClient } from "@tanstack/react-query";

export const invalidateQueryKeys = (
  queryClient: QueryClient,
  ...queryKeys: string[][]
) => {
  queryKeys.forEach((queryKey) => {
    queryClient.invalidateQueries({
      queryKey,
    });
  });
};
