import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FavouriteState = {
  favourites: string[];
  hydrated: boolean;

  hydrate: () => Promise<void>;
  toggleFavourite: (id: string) => Promise<void>;
};

export const useFavouriteStore = create<FavouriteState>((set, get) => ({
  favourites: [],
  hydrated: false,

  hydrate: async () => {
    const stored = await AsyncStorage.getItem("favourites");

    set({
      favourites: stored ? JSON.parse(stored) : [],
      hydrated: true,
    });
  },

  toggleFavourite: async (id) => {
    const current = get().favourites;

    const updated = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];

    await AsyncStorage.setItem("favourites", JSON.stringify(updated));
    set({ favourites: updated });
  },
}));
