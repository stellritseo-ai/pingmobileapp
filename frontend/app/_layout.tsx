import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useIconFonts } from "@/src/hooks/use-icon-fonts";
import { useAuthStore } from "@/src/store/authStore";

// Keep the native splash visible from cold start until icon fonts register.
// Required because @expo/vector-icons' componentDidMount fallback fires
// Font.loadAsync against a broken vendor path if any <Icon> mounts before
// the family is registered — which throws on Android Expo Go.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useIconFonts();
  const loadUser = useAuthStore((s) => s.loadUser);

  // Restore persisted user on every cold start (works for deep-linked URLs too)
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // If the CDN is unreachable we fall through on error rather than wedging
  // the app — icons will tofu, but the app still boots.
  if (!loaded && !error) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
