import { ZodType } from "zod";
import { httpRequest } from "./request";

export const apiClient = {
  get: async <T>(path: string, schema: ZodType<T>): Promise<T> => {
    const raw = await httpRequest(path, { method: "GET" });
    return schema.parse(raw);
  },

  post: async <T, B>(
    path: string,
    schema: ZodType<T>,
    body: B
  ): Promise<T> => {
    const raw = await httpRequest(path, {
      method: "POST",
      body,
    });
    return schema.parse(raw);
  },

  put: async <T, B>(
    path: string,
    schema: ZodType<T>,
    body: B
  ): Promise<T> => {
    const raw = await httpRequest(path, {
      method: "PUT",
      body,
    });
    return schema.parse(raw);
  },

  delete: async <T>(path: string, schema: ZodType<T>): Promise<T> => {
    const raw = await httpRequest(path, {
      method: "DELETE",
    });
    return schema.parse(raw);
  },
};
