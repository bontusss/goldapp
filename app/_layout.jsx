import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "../store/authstore";
import ToastProvider from "../app/toast-provider";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token, hasCheckedAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  // Handle redirection based on authentication status
  useEffect(() => {
    if (!router.isReady || !hasCheckedAuth) return;

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!inAuthScreen && !isSignedIn) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments, router, hasCheckedAuth]);

  if (!hasCheckedAuth) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color="#F47C20" />
      </View>
    );
  }
  return (
    <RootSiblingParent>
      <SafeAreaProvider>
        <SafeScreen>
          <Stack screenOptions={{ headerShown: false }} />
          <ToastProvider />
        </SafeScreen>
      </SafeAreaProvider>
    </RootSiblingParent>
  );
}
