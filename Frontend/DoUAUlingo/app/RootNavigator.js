import { Stack } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function RootNavigator() {
  const { usuario } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!usuario ? (
        <>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="forgot-password" />
        </>
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}