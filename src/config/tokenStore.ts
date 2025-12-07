import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TokenState = {
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;

  hydrate: () => Promise<void>;
  setTokens: (access: string, refresh: string) => Promise<void>;
  clearTokens: () => Promise<void>;
};

export const useTokenStore = create<TokenState>((set) => ({
  accessToken: null,
  refreshToken: null,
  hydrated: false,

  hydrate: async () => {
    const access = await AsyncStorage.getItem("accessToken");
    const refresh = await AsyncStorage.getItem("refreshToken");

    set({
      accessToken: access,
      refreshToken: refresh,
      hydrated: true,
    });
  },

  setTokens: async (access, refresh) => {
    await AsyncStorage.setItem("accessToken", access);
    await AsyncStorage.setItem("refreshToken", refresh);

    set({ accessToken: access, refreshToken: refresh });
  },

  clearTokens: async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");

    set({ accessToken: null, refreshToken: null });
  },
}));
