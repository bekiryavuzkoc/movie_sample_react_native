import { z } from "zod";

export const MovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  posterURL: z.any().optional(),
  imdbId: z.string().optional(),
});

export type Movie = {
  id: number;
  title: string;
  posterURL: string;
  imdbId: string;
};

export const MovieListSchema = z.array(MovieSchema);