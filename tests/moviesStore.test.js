import { useMoviesStore } from "@/src/store/useMoviesStore";
import { apiClient } from "@/api/apiClient";
import { DEFAULT_IMAGE } from "@/constants/images";

jest.mock("@/api/apiClient", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("MoviesStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useMoviesStore.setState({
      movies: [],
      loading: true,
      error: null,
    });
  });

  test("loadMovies loads and maps movies correctly", async () => {
    apiClient.get.mockResolvedValue([
      { id: "1", title: "A", posterURL: "http://img.com/1.jpg", imdbId: "tt1" },
      { id: "2", title: "B", posterURL: "INVALID", imdbId: "" },
    ]);

    await useMoviesStore.getState().loadMovies();

    const state = useMoviesStore.getState();
    expect(state.loading).toBe(false);
    expect(state.movies.length).toBe(2);

    expect(state.movies[1].posterURL).toBe(DEFAULT_IMAGE);
    expect(state.movies[1].imdbId).toBe("Unknown IMDb ID");
  });

  test("loadMovies sets error on failure", async () => {
    apiClient.get.mockRejectedValue(new Error("Network"));

    await useMoviesStore.getState().loadMovies();

    const state = useMoviesStore.getState();
    expect(state.error).toBe("Network");
    expect(state.loading).toBe(false);
  });
});
