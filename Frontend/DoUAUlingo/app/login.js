import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      router.replace("/");
    } else {
      setError(result.message || "E-mail ou senha inválidos.");
    }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.logoText}>doUAUlingo</Text>

          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.backText}>VOLTAR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.logoCircle}>
            <Image
              source={{
                uri: "https://static.vecteezy.com/system/resources/previews/068/873/860/non_2x/capybara-wearing-graduation-cap-looks-intelligent-and-proud-symbolizing-achievement-and-education-this-charming-animal-captures-essence-of-celebration-and-success-png.png",
              }}
              style={styles.logoImage}
            />
          </View>

          <Text style={styles.title}>Entrar na sua conta</Text>

          <TextInput
            placeholder="seu@email.com"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Sua senha"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryText}>ENTRAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/forgot-password")}
          >
            <Text style={styles.secondaryText}>ESQUECI MINHA SENHA</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.register}>
              Não tem conta?{" "}
              <Text style={styles.registerBold}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
  },

  header: {
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#58cc02",
    letterSpacing: 1,
  },

  backText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1cb0f6",
  },

  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },

  logoCircle: {
    width: 145,
    height: 145,
    borderRadius: 80,
    backgroundColor: "#d7ffb8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    borderWidth: 4,
    borderColor: "#58cc02",
  },

  logoImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3c3c3c",
    textAlign: "center",
    marginBottom: 24,
  },

  input: {
    width: "100%",
    backgroundColor: "#f7f7f7",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 16,
    color: "#333",
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    fontSize: 15,
    fontWeight: "700",
  },

  error: {
    color: "#ff4b4b",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "800",
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#58cc02",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 5,
    borderBottomColor: "#46a302",
  },

  primaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },

  secondaryButton: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 14,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 5,
    borderBottomColor: "#d1d1d1",
  },

  secondaryText: {
    color: "#1cb0f6",
    fontSize: 15,
    fontWeight: "900",
  },

  register: {
    color: "#777",
    textAlign: "center",
    marginTop: 18,
    fontSize: 14,
    fontWeight: "700",
  },

  registerBold: {
    color: "#58cc02",
    fontWeight: "900",
  },
});
}