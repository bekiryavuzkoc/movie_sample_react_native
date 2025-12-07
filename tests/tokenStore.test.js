import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTokenStore } from "@/src/config/tokenStore";

describe("TokenStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useTokenStore.setState({
      accessToken: null,
      refreshToken: null,
      hydrated: false,
    });
  });

  test("setTokens sets both access and refresh tokens", async () => {
    jest.spyOn(AsyncStorage, "setItem").mockResolvedValue(undefined);

    await useTokenStore.getState().setTokens("A", "R");

    const s = useTokenStore.getState();
    expect(s.accessToken).toBe("A");
    expect(s.refreshToken).toBe("R");
  });

  test("clearTokens removes both tokens and resets state", async () => {
    jest.spyOn(AsyncStorage, "removeItem").mockResolvedValue(undefined);

    useTokenStore.setState({
      accessToken: "A",
      refreshToken: "R",
    });

    await useTokenStore.getState().clearTokens();

    const s = useTokenStore.getState();
    expect(s.accessToken).toBe(null);
    expect(s.refreshToken).toBe(null);
  });

  test("hydrate loads tokens from AsyncStorage", async () => {
    jest.spyOn(AsyncStorage, "getItem")
      .mockResolvedValueOnce("AA") // accessToken
      .mockResolvedValueOnce("RR"); // refreshToken

    await useTokenStore.getState().hydrate();

    const s = useTokenStore.getState();
    expect(s.accessToken).toBe("AA");
    expect(s.refreshToken).toBe("RR");
    expect(s.hydrated).toBe(true);
  });

  test("hydrate sets null tokens when storage returns null", async () => {
    jest.spyOn(AsyncStorage, "getItem")
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    await useTokenStore.getState().hydrate();

    const s = useTokenStore.getState();
    expect(s.accessToken).toBe(null);
    expect(s.refreshToken).toBe(null);
    expect(s.hydrated).toBe(true);
  });
});
