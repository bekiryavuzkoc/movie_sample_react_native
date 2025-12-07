import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFavouriteStore } from "@/src/features/favouriteStore";

describe("Favourite Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFavouriteStore.setState({ favourites: [], hydrated: false });
  });

  test("hydrate loads from AsyncStorage", async () => {
    jest.spyOn(AsyncStorage, "getItem").mockResolvedValue(JSON.stringify(["a"]));

    await useFavouriteStore.getState().hydrate();

    expect(useFavouriteStore.getState().favourites).toEqual(["a"]);
    expect(useFavouriteStore.getState().hydrated).toBe(true);
  });

  test("toggle adds favourite", async () => {
    jest.spyOn(AsyncStorage, "setItem").mockResolvedValue(undefined);

    await useFavouriteStore.getState().toggleFavourite("x");

    expect(useFavouriteStore.getState().favourites).toEqual(["x"]);
  });

  test("toggle removes favourite", async () => {
    useFavouriteStore.setState({ favourites: ["x"] });

    jest.spyOn(AsyncStorage, "setItem").mockResolvedValue(undefined);

    await useFavouriteStore.getState().toggleFavourite("x");

    expect(useFavouriteStore.getState().favourites).toEqual([]);
  });
});
