import { fetchAuthSession } from "aws-amplify/auth";
import { isFieldError } from "../utils/errors";
import {
  DefaultError,
  QueryClient,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type ParamValues = Record<string, string>;
type DataValues = Record<string, string | number | boolean>;

/**
 * Base API function
 */

type APIOptions = {
  method: HTTPMethod;
  endpoint: string;
  data?: DataValues;
  params?: ParamValues;
};

const apiFn = async <DataType>({
  method,
  endpoint,
  data,
  params,
}: APIOptions) => {
  const accessToken = (await fetchAuthSession()).tokens?.accessToken.toString();

  if (params) {
    const formattedParams = Object.keys(params)
      .map((key) => {
        const value = params?.[key] ?? "";
        return `${key}=${value}`;
      })
      .join("&");
    endpoint += "?" + formattedParams;
  }

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
    return json as DataType;
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
};

/**
 * Query hook
 */

type QueryOptions = {
  endpoint: string;
  params?: ParamValues;
  disabled?: boolean;
};

const getQueryKey = (options: QueryOptions) => {
  let key: any[] = [options.endpoint];

  if (options.params) key.push(options.params);
  return key;
};

export const invalidateQuery = (
  queryClient: QueryClient,
  options: QueryOptions
) => {
  const queryKey = getQueryKey(options);
  queryClient.invalidateQueries({ queryKey });
};

export const useAPIQuery = <DataType>(options: QueryOptions) => {
  return useQuery<void, DefaultError, DataType>({
    queryKey: getQueryKey(options),
    queryFn: () =>
      apiFn({
        method: "GET",
        endpoint: options.endpoint,
        params: options.params,
      }),
    enabled: !options.disabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Mutation hook
 */

type MutationHookOptions<DataType> = {
  method: HTTPMethod;
  endpoint: string;
  onError?: (error: DefaultError) => void;
  onSuccess?: (data: DataType) => void;
};

type MutateOptions = {
  id?: number;
  data?: DataValues;
};

export const useAPIMutation = <DataType>(
  hookOptions: MutationHookOptions<DataType>
) => {
  return useMutation<DataType, DefaultError, MutateOptions>({
    mutationFn: (mutateOptions) =>
      apiFn({
        method: hookOptions.method,
        endpoint:
          hookOptions.endpoint +
          (mutateOptions.id ? `/${mutateOptions.id}` : ""),
        data: mutateOptions.data,
      }),
    onError: (error) => {
      console.error(error);
      hookOptions.onError?.(error);
    },
    onSuccess: (data) => {
      hookOptions.onSuccess?.(data);
    },
  });
};
