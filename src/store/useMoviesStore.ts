import { apiClient } from "@/api/apiClient";
import { DEFAULT_IMAGE } from "@/constants/images";
import { Movie, MovieListSchema } from "@/models/Movie";
import { create } from "zustand";

type MovieStore = {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  loadMovies: () => Promise<void>;
};

export const useMoviesStore = create<MovieStore>((set) => ({
  movies: [],
  loading: true,
  error: null,

  loadMovies: async () => {
    set({ loading: true });

    try {
      const movies = await apiClient.get("/comedy", MovieListSchema);

      const mapped: Movie[] = movies.map((m) => ({
        id: m.id,
        title: m.title,
        posterURL:
          typeof m.posterURL === "string" && m.posterURL.startsWith("http")
            ? m.posterURL
            : DEFAULT_IMAGE,
        imdbId: m.imdbId || "Unknown IMDb ID",
      }));

      set({ movies: mapped, loading: false });
    } catch (e: any) {
      set({ error: e.message ?? "Unknown error", loading: false });
      console.error("LoadMovies error:", e);
    }
  },
}));
