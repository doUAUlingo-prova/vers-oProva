import { Stack } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function RootNavigator() {
  const { usuario, loading } = useAuth();

  // Enquanto carrega os dados do usuário, mostra loading
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#58cc02" />
      </View>
    );
  }

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