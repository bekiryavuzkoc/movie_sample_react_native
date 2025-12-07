import { BASE_URL } from "@/src/config/config";
import { useTokenStore } from "@/src/config/tokenStore";
import Toast from "react-native-toast-message";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  retry?: number;
  timeout?: number;
}

export type NormalizedError = {
  message: string;
  status: number;
  raw: any;
};

function fetchWithTimeout(url: string, options: any, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    fetch(url, { ...options, signal: controller.signal })
      .then((res) => {
        clearTimeout(id);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(id);
        if (err.name === "AbortError") {
          reject({ message: "Request timeout", status: 408, raw: err });
        } else {
          reject(err);
        }
      });
  });
}

async function refreshAccessToken() {
  const refreshToken = useTokenStore.getState().refreshToken;

  if (!refreshToken) {
    return null;
  }

  try {
    const res = await fetch(BASE_URL + "/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!res.ok) return null;

    const json = await res.json();

    useTokenStore.getState().setTokens(json.accessToken, json.refreshToken);

    return json.accessToken;
  } catch (err) {
    return null;
  }
}

export async function httpRequest(path: string, options: RequestOptions = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    retry = 1,
    timeout = 8000,
  } = options;

  const token = useTokenStore.getState().accessToken;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let lastError: any = null;

  for (let i = 0; i <= retry; i++) {
    try {
      const res: any = await fetchWithTimeout(
        BASE_URL + path,
        {
          method,
          headers: finalHeaders,
          body: body ? JSON.stringify(body) : undefined,
        },
        timeout
      );

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) throw { status: 401, message: "Unauthorized" };

        finalHeaders["Authorization"] = `Bearer ${newToken}`;

        return await httpRequest(path, {
          ...options,
          headers: finalHeaders,
        });
      }

      if (!res.ok) {
        throw {
          status: res.status,
          message: `Request failed (${res.status})`,
          raw: await res.text(),
        };
      }

      return await res.json();
    } catch (err: any) {
      lastError = err;

      const isNetworkError =
        err?.message?.includes("Network") || err?.status === 0;

      if (i < retry && isNetworkError) continue;

      const normalized = normalizeError(err);
      showErrorToast(normalized.message);
      throw normalized;
    }
  }

  const normalized = normalizeError(lastError);
  showErrorToast(normalized.message);
  throw normalized;
}

function normalizeError(err: any): NormalizedError {
  return {
    message: err?.message || "Unknown error",
    status: err?.status || 0,
    raw: err,
  };
}

function showErrorToast(message: string) {
  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
    position: "top",
  });
}
