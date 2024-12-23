import { isFieldError } from "@/utils/errors";
import { fetchAuthSession } from "aws-amplify/auth";
import { useCallback } from "react";

export const useAPI = () => {
  const query = useCallback(
    async (method: string, endpoint: string, data?: object) => {
      const accessToken = (
        await fetchAuthSession()
      ).tokens?.accessToken.toString();

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/${endpoint}`,
        {
          method: method,
          body: data ? JSON.stringify(data) : undefined,
          headers: {
            Authorization: accessToken ?? "",
            "Content-Type": "application/json",
          },
        }
      );

      let json = {} as any;
      try {
        json = await response.json();
      } catch (e: any) {
        if (e?.message === "JSON Parse error: Unexpected end of input") {
          // No response body, ok
        } else {
          console.error(e);
        }
      }

      if (response.ok) {
        return json;
      } else {
        if (json["error"]) {
          throw new Error(json["error"]);
        } else if (json["errors"] && json["errors"].length > 0) {
          // Just throw the first error
          const error = json["errors"][0];
          if (isFieldError(error)) {
            throw new Error(`${error.path}: ${error.msg}`);
          }
          throw new Error(json["errors"][0]);
        } else {
          throw new Error("An error occurred");
        }
      }
    },
    []
  );

  const get = useCallback(
    (endpoint: string) => query("GET", endpoint),
    [query]
  );
  const post = useCallback(
    (endpoint: string, data?: object) => query("POST", endpoint, data),
    [query]
  );
  const put = useCallback(
    (endpoint: string, data?: object) => query("PUT", endpoint, data),
    [query]
  );
  const del = useCallback(
    (endpoint: string) => query("DELETE", endpoint),
    [query]
  );

  return { get, post, put, del };
};
