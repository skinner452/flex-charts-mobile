import { fetchAuthSession } from "aws-amplify/auth";
import { useCallback } from "react";

export const useAPI = () => {
  const query = useCallback(
    async (method: string, endpoint: string, data: object | null) => {
      const accessToken = (
        await fetchAuthSession()
      ).tokens?.accessToken.toString();

      return fetch(`${process.env.EXPO_PUBLIC_API_URL}/${endpoint}`, {
        method: method,
        body: data ? JSON.stringify(data) : undefined,
        headers: accessToken
          ? {
              Authorization: accessToken,
            }
          : {},
      });
    },
    []
  );

  const get = useCallback(
    (endpoint: string) => query("GET", endpoint, null),
    [query]
  );
  const post = useCallback(
    (endpoint: string, data: object) => query("POST", endpoint, data),
    [query]
  );
  const put = useCallback(
    (endpoint: string, data: object) => query("PUT", endpoint, data),
    [query]
  );
  const del = useCallback(
    (endpoint: string, data: object) => query("DELETE", endpoint, data),
    [query]
  );

  return { get, post, put, del };
};
