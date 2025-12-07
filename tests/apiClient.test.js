import { apiClient } from "@/api/apiClient";
import { httpRequest } from "@/api/request";
import { z } from "zod";

jest.mock("@/api/request", () => ({
  httpRequest: jest.fn(),
}));

const BadSchema = z.object({
  a: z.string()
});

describe("apiClient", () => {
  const schema = z.object({
    id: z.number(),
    name: z.string(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET calls httpRequest correctly and parses response", async () => {
    httpRequest.mockResolvedValue({ id: 1, name: "test" });

    const res = await apiClient.get("/movie", schema);

    expect(httpRequest).toHaveBeenCalledWith("/movie", { method: "GET" });
    expect(res).toEqual({ id: 1, name: "test" });
  });

  test("POST sends body and parses response", async () => {
    httpRequest.mockResolvedValue({ id: 10, name: "new" });

    const res = await apiClient.post("/movie", schema, { foo: 1 });

    expect(httpRequest).toHaveBeenCalledWith("/movie", {
      method: "POST",
      body: { foo: 1 },
    });
    expect(res).toEqual({ id: 10, name: "new" });
  });

  test("Zod validation error should throw", async () => {
    httpRequest.mockResolvedValue({ id: "not_a_number", name: "x" });

    await expect(apiClient.get("/bad", schema)).rejects.toThrow();
  });

  test("apiClient.get throws on invalid schema", async () => {
    httpRequest.mockResolvedValue({ invalid: true });

    await expect(apiClient.get("/x", BadSchema)).rejects.toThrow();
  });

  test("apiClient.post throws on invalid schema", async () => {
    httpRequest.mockResolvedValue({ nope: 123 });

    await expect(apiClient.post("/x", BadSchema, {})).rejects.toThrow();
  });

  test("apiClient.put throws on invalid schema", async () => {
    httpRequest.mockResolvedValue({ wrong: "value" });

    await expect(apiClient.put("/x", BadSchema, {})).rejects.toThrow();
  });

  test("apiClient.delete throws on invalid schema", async () => {
    httpRequest.mockResolvedValue({ x: 1 });

    await expect(apiClient.delete("/x", BadSchema)).rejects.toThrow();
  });
});
