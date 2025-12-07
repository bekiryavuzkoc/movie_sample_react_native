import { useMovieDetailStore } from "@/src/store/useMovieDetailStore";
import { apiClient } from "@/api/apiClient";
import { DEFAULT_IMAGE } from "@/constants/images";

jest.mock("@/api/apiClient", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("MovieDetailStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useMovieDetailStore.setState({
      movie: null,
      loading: false,
      error: null,
    });
  });

  test("loadMovie loads and maps movie", async () => {
    apiClient.get.mockResolvedValue({
      id: "10",
      title: "MovieX",
      posterURL: "http://image.com/x.jpg",
      imdbId: "tt777",
    });

    await useMovieDetailStore.getState().loadMovie("10");

    const s = useMovieDetailStore.getState();
    expect(s.loading).toBe(false);
    expect(s.movie.title).toBe("MovieX");
  });

  test("loadMovie applies fallback image & imdbId", async () => {
    apiClient.get.mockResolvedValue({
      id: "20",
      title: "BadMovie",
      posterURL: "INVALID",
      imdbId: "",
    });

    await useMovieDetailStore.getState().loadMovie("20");

    const s = useMovieDetailStore.getState();
    expect(s.movie.posterURL).toBe(DEFAULT_IMAGE);
    expect(s.movie.imdbId).toBe("Unknown IMDb ID");
  });

  test("loadMovie handles errors", async () => {
    apiClient.get.mockRejectedValue(new Error("API ERR"));

    await useMovieDetailStore.getState().loadMovie("err");

    const s = useMovieDetailStore.getState();
    expect(s.error).toBe("API ERR");
    expect(s.movie).toBe(null);
  });

  test("clear resets movie + error", () => {
    useMovieDetailStore.setState({
      movie: { id: "1" },
      error: "X",
    });

    useMovieDetailStore.getState().clear();

    const s = useMovieDetailStore.getState();
    expect(s.movie).toBe(null);
    expect(s.error).toBe(null);
  });
});
