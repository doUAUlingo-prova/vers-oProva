import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
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

const API_URL = "https://x49aok4laf.execute-api.us-east-1.amazonaws.com";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const redefinirSenha = async () => {
    setError("");
    setSuccess("");

    if (!email || !novaSenha || !confirmarSenha) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!email.includes("@")) {
      setError("Digite um e-mail válido.");
      return;
    }

    if (novaSenha.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/usuarios/recuperar-senha`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          novaSenha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.erro || data.message || "Erro ao redefinir senha.");
        return;
      }

      setSuccess("Senha redefinida com sucesso!");

      Alert.alert(
        "Sucesso",
        "Sua senha foi redefinida. Agora faça login com a nova senha.",
        [
          {
            text: "Ir para login",
            onPress: () => router.replace("/login"),
          },
        ]
      );

      setEmail("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      console.log("Erro ao recuperar senha:", error);
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.logoText}>doUAUlingo</Text>

          <TouchableOpacity onPress={() => router.push("/login")}>
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

          <Text style={styles.title}>Recuperar senha</Text>

          <Text style={styles.subtitle}>
            Digite seu e-mail cadastrado e escolha uma nova senha.
          </Text>

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
            placeholder="Nova senha"
            placeholderTextColor="#9ca3af"
            value={novaSenha}
            onChangeText={setNovaSenha}
            style={styles.input}
            secureTextEntry
          />

          <TextInput
            placeholder="Confirmar nova senha"
            placeholderTextColor="#9ca3af"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            style={styles.input}
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {success ? <Text style={styles.success}>{success}</Text> : null}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              loading && styles.disabledButton,
            ]}
            onPress={redefinirSenha}
            disabled={loading}
          >
            <Text style={styles.primaryText}>
              {loading ? "SALVANDO..." : "REDEFINIR SENHA"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.secondaryText}>
              LEMBREI MINHA SENHA
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
    width: 115,
    height: 115,
    borderRadius: 60,
    backgroundColor: "#d7ffb8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 4,
    borderColor: "#58cc02",
  },

  logoImage: {
    width: 82,
    height: 82,
    resizeMode: "contain",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3c3c3c",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 22,
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

  success: {
    color: "#58cc02",
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

  disabledButton: {
    opacity: 0.65,
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