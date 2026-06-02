// Importa o hook de navegação do Expo Router.
// Usado para mudar de tela dentro do aplicativo.
import { useRouter } from "expo-router";

// Importa o useState, usado para controlar os valores digitados e mensagens da tela.
import { useState } from "react";

// Importa componentes visuais do React Native.
import {
  Image, // Exibe imagens.
  KeyboardAvoidingView, // Ajusta a tela quando o teclado aparece.
  Platform, // Identifica o sistema operacional.
  SafeAreaView, // Evita sobreposição com notch/barra superior.
  StyleSheet, // Cria os estilos da tela.
  Text, // Exibe textos.
  TextInput, // Campo de digitação.
  TouchableOpacity, // Botão clicável.
  View, // Container visual.
} from "react-native";

// Importa o contexto de autenticação.
// É nele que está a função de login do usuário.
import { useAuth } from "../contexts/AuthContext";

// Componente principal da tela de login.
export default function LoginPage() {

  // Estado que armazena o e-mail digitado.
  const [email, setEmail] = useState("");

  // Estado que armazena a senha digitada.
  const [password, setPassword] = useState("");

  // Estado usado para exibir mensagens de erro.
  const [error, setError] = useState("");

  // Pega a função login do contexto de autenticação.
  const { login } = useAuth();

  // Cria o objeto router para navegação.
  const router = useRouter();

  // Função executada quando o usuário clica no botão ENTRAR.
  const handleSubmit = async () => {

    // Limpa mensagens de erro anteriores.
    setError("");

    // Valida se os campos foram preenchidos.
    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    // Chama a função login passando e-mail e senha.
    // Essa função conversa com o backend através do AuthContext.
    const result = await login(email, password);

    // Se o login for bem-sucedido, redireciona para o dashboard.
    if (result.success) {
      router.replace("(tabs)/dashboard");
    } else {

      // Se der erro, exibe a mensagem retornada ou uma mensagem padrão.
      setError(result.message || "E-mail ou senha inválidos.");
    }
  };

  // Parte visual da tela.
  return (
    <SafeAreaView style={styles.safe}>

      {/* Ajusta a tela quando o teclado abre, principalmente no iOS */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        {/* Cabeçalho com logo e botão voltar */}
        <View style={styles.header}>
          <Text style={styles.logoText}>doUAUlingo</Text>

          {/* Volta para a landing page */}
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.backText}>VOLTAR</Text>
          </TouchableOpacity>
        </View>

        {/* Card central do formulário */}
        <View style={styles.card}>

          {/* Círculo com a imagem da mascote */}
          <View style={styles.logoCircle}>
            <Image
              source={{
                uri: "https://static.vecteezy.com/system/resources/previews/068/873/860/non_2x/capybara-wearing-graduation-cap-looks-intelligent-and-proud-symbolizing-achievement-and-education-this-charming-animal-captures-essence-of-celebration-and-success-png.png",
              }}
              style={styles.logoImage}
            />
          </View>

          {/* Título da tela */}
          <Text style={styles.title}>Entrar na sua conta</Text>

          {/* Campo de e-mail */}
          <TextInput
            placeholder="seu@email.com"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Campo de senha */}
          <TextInput
            placeholder="Sua senha"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          {/* Exibe mensagem de erro caso exista */}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Botão para realizar o login */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryText}>ENTRAR</Text>
          </TouchableOpacity>

          {/* Botão para ir para recuperação de senha */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/forgot-password")}
          >
            <Text style={styles.secondaryText}>ESQUECI MINHA SENHA</Text>
          </TouchableOpacity>

          {/* Link para cadastro de novo usuário */}
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

// Estilos da tela.
const styles = StyleSheet.create({

  // Container principal seguro.
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // Container interno.
  container: {
    flex: 1,
    paddingHorizontal: 22,
  },

  // Cabeçalho superior.
  header: {
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Texto do logo.
  logoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#58cc02",
    letterSpacing: 1,
  },

  // Texto do botão voltar.
  backText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1cb0f6",
  },

  // Card central com formulário.
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },

  // Círculo da imagem.
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

  // Imagem da mascote.
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  // Título principal.
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3c3c3c",
    textAlign: "center",
    marginBottom: 24,
  },

  // Estilo dos campos de texto.
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

  // Mensagem de erro.
  error: {
    color: "#ff4b4b",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "800",
  },

  // Botão principal.
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

  // Texto do botão principal.
  primaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },

  // Botão secundário.
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

  // Texto do botão secundário.
  secondaryText: {
    color: "#1cb0f6",
    fontSize: 15,
    fontWeight: "900",
  },

  // Texto do link para cadastro.
  register: {
    color: "#777",
    textAlign: "center",
    marginTop: 18,
    fontSize: 14,
    fontWeight: "700",
  },

  // Parte destacada do texto "Cadastre-se".
  registerBold: {
    color: "#58cc02",
    fontWeight: "900",
  },
});