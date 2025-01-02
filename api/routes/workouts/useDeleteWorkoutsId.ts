import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

const getEndpoint = (id: number) => `workouts/${id}`;

export const useDeleteWorkoutsId = (
  options?: Partial<UseMutationOptions<void, Error, number>>
) => {
  return useMutation({
    ...options,
    mutationFn: (id) =>
      fetchFromAPI({
        method: "DELETE",
        endpoint: getEndpoint(id),
      }),
  });
};
