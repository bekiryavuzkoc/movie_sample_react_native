import { apiClient } from "@/api/apiClient";
import { DEFAULT_IMAGE } from "@/constants/images";
import { Movie, MovieSchema } from "@/models/Movie";
import { create } from "zustand";

type MovieDetailStore = {
  movie: Movie | null;
  loading: boolean;
  error: string | null;

  loadMovie: (id: string) => Promise<void>;
  clear: () => void;
};

export const useMovieDetailStore = create<MovieDetailStore>((set) => ({
  movie: null,
  loading: false,
  error: null,

  loadMovie: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const movieData = await apiClient.get(`/comedy/${id}`, MovieSchema);

      const movie: Movie = {
        id: movieData.id,
        title: movieData.title,
        posterURL:
          typeof movieData.posterURL === "string" &&
          movieData.posterURL.startsWith("http")
            ? movieData.posterURL
            : DEFAULT_IMAGE,
        imdbId: movieData.imdbId || "Unknown IMDb ID",
      };

      set({ movie, loading: false });
    } catch (e: any) {
      console.error("loadMovie error:", e);
      set({ error: e.message ?? "Unknown error", loading: false });
    }
  },

  clear: () => set({ movie: null, error: null }),
}));
