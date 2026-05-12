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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const router = useRouter();

  const handleRegister = () => {
    setError("");

    if (!name || !email || !vehicle || !password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não são iguais.");
      return;
    }

    router.replace("/login");
  };

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

          <Text style={styles.title}>Criar sua conta</Text>

          <Text style={styles.subtitle}>
            Cadastre-se para acompanhar seu Toyota pelo app
          </Text>

          <TextInput
            placeholder="Seu nome"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

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
            placeholder="Modelo do veículo"
            placeholderTextColor="#9ca3af"
            value={vehicle}
            onChangeText={setVehicle}
            style={styles.input}
          />

          <TextInput
            placeholder="Sua senha"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TextInput
            placeholder="Confirmar senha"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
            <Text style={styles.primaryText}>CADASTRAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.secondaryText}>JÁ TENHO UMA CONTA</Text>
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
    width: 125,
    height: 125,
    borderRadius: 70,
    backgroundColor: "#d7ffb8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    borderWidth: 4,
    borderColor: "#58cc02",
  },

  logoImage: {
    width: 92,
    height: 92,
    resizeMode: "contain",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3c3c3c",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 24,
    lineHeight: 23,
  },

  input: {
    width: "100%",
    backgroundColor: "#f7f7f7",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    color: "#333",
    marginBottom: 12,
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
    marginTop: 8,
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
});