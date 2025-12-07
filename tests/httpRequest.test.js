import { httpRequest } from "@/api/request";
import { useTokenStore } from "@/src/config/tokenStore";
import Toast from "react-native-toast-message";

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

jest.mock("@/src/config/tokenStore", () => ({
  useTokenStore: {
    getState: jest.fn(() => ({
      accessToken: null,
      refreshToken: null,
      setTokens: jest.fn(),
    })),
  },
}));

global.fetch = jest.fn();

function mockFetchResponse(status, json) {
  fetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => json,
    text: async () => JSON.stringify(json),
  });
}

describe("httpRequest()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockReset();
  });

  test("returns JSON on successful request", async () => {
    mockFetchResponse(200, { ok: true });

    const res = await httpRequest("/test", { method: "GET" });

    expect(res).toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("throws timeout error when request exceeds limit", async () => {
    fetch.mockImplementationOnce(
      () =>
        new Promise((_resolve, reject) => {
          setTimeout(() => reject({ name: "AbortError" }), 10);
        })
    );

    await expect(
      httpRequest("/timeout", { timeout: 5 })
    ).rejects.toMatchObject({
      message: "Request timeout",
      status: 408,
    });

    expect(Toast.show).toHaveBeenCalled();
  });

  test("retries on network error", async () => {
    fetch.mockRejectedValueOnce({ message: "Network error" });
    mockFetchResponse(200, { ok: true });

    const res = await httpRequest("/retry", { retry: 1 });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(res).toEqual({ ok: true });
  });

  test("throws normalized error for server error (500)", async () => {
    mockFetchResponse(500, { error: true });

    await expect(httpRequest("/err")).rejects.toMatchObject({
      status: 500,
      message: "Request failed (500)",
    });

    expect(Toast.show).toHaveBeenCalled();
  });


  test("handles 401 by refreshing token then retrying request", async () => {
    useTokenStore.getState.mockReturnValue({
      accessToken: "OLD_TOKEN",
      refreshToken: "REFRESH",
      setTokens: jest.fn(),
    });

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({}),
      text: async () => "",
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        accessToken: "NEW_TOKEN",
        refreshToken: "REFRESH",
      }),
    });

    mockFetchResponse(200, { data: 123 });

    const res = await httpRequest("/auth", { method: "GET" });

    expect(res).toEqual({ data: 123 });
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  test("throws error if refresh token fails", async () => {
    useTokenStore.getState.mockReturnValue({
      accessToken: "OLD",
      refreshToken: "REFRESH",
      setTokens: jest.fn(),
    });

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({}),
      text: async () => "",
    });

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({}),
      text: async () => "",
    });

    await expect(httpRequest("/auth")).rejects.toMatchObject({
      status: 401,
      message: "Unauthorized",
    });

    expect(Toast.show).toHaveBeenCalled();
  });
});
