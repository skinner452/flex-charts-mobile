import { fetchAuthSession } from "aws-amplify/auth";
import { isFieldError } from "./errors";

type FetchOptions = {
  method: HTTPMethod;
  endpoint: string;
  data?: DataValues;
  params?: DataValues;
};

export const fetchFromAPI = async <ResponseData>({
  method,
  endpoint,
  data,
  params,
}: FetchOptions) => {
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
    return json as ResponseData;
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
