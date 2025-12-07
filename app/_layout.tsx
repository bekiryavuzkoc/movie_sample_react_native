import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTokenStore } from '@/src/config/tokenStore';
import { useFavouriteStore } from '@/src/features/favouriteStore';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const hydrate = useTokenStore((s) => s.hydrate);
  const hydrated = useTokenStore((s) => s.hydrated);
  const hydrateFav = useFavouriteStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
    hydrateFav();  
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>

        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />

        <Stack.Screen
          name="movie/[id]"
          options={{
          headerTitle: "Movie Detail", 
          headerBackTitle: "",
          headerBackButtonDisplayMode: "minimal",
          headerShadowVisible: false}}
        />

      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </ThemeProvider>
  );
}
