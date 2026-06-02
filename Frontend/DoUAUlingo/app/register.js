// Importa o hook de navegação do Expo Router.
// Ele permite redirecionar o usuário para outras telas.
import { useRouter } from "expo-router";

// Importa o useState para controlar os valores digitados no formulário.
import { useState } from "react";

// Importa o contexto de autenticação.
// Aqui usamos a função login para logar automaticamente depois do cadastro.
import { useAuth } from "../contexts/AuthContext";

// Importa os componentes visuais usados na tela.
import {
  Image, // Exibe a imagem da mascote.
  KeyboardAvoidingView, // Ajusta a tela quando o teclado aparece.
  Platform, // Verifica se o app está rodando em iOS, Android ou Web.
  SafeAreaView, // Mantém o conteúdo dentro de uma área segura da tela.
  StyleSheet, // Cria os estilos da tela.
  Text, // Exibe textos.
  TextInput, // Campos de digitação.
  TouchableOpacity, // Botões clicáveis.
  View, // Container visual.
} from "react-native";

// URL da API local.
// O backend Spring Boot está rodando localmente na porta 8080.
const API_URL = "http://localhost:8080";

// Componente principal da tela de cadastro.
export default function RegisterPage() {
  // Hook usado para navegar entre telas.
  const router = useRouter();

  // Pega a função de login do AuthContext.
  const { login } = useAuth();

  // Estado que armazena o nome digitado.
  const [name, setName] = useState("");

  // Estado que armazena o e-mail digitado.
  const [email, setEmail] = useState("");

  // Estado que armazena a senha digitada.
  const [password, setPassword] = useState("");

  // Estado que armazena a confirmação da senha.
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estado usado para exibir mensagens de erro.
  const [error, setError] = useState("");

  // Função executada quando o usuário clica em CADASTRAR.
  const handleRegister = async () => {
    // Limpa erro antigo antes de validar novamente.
    setError("");

    // Valida se todos os campos foram preenchidos.
    if (!name || !email || !password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    // Verifica se a senha e a confirmação são iguais.
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      // Envia os dados do novo usuário para o backend.
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        // Converte os dados digitados em JSON.
        // O backend espera os campos nome, email e senha.
        body: JSON.stringify({
          nome: name,
          email,
          senha: password,
        }),
      });

      // Converte a resposta do backend para JSON.
      const data = await response.json();

      // Se o backend retornar erro, mostra a mensagem na tela.
      if (!response.ok) {
        setError(data.erro || "Erro ao cadastrar.");
        return;
      }

      // Após cadastrar, o app tenta logar automaticamente o usuário.
      const loginResponse = await login(email, password);

      // Se o login automático der certo, vai para o dashboard.
      if (loginResponse.success) {
        router.replace("(tabs)/dashboard");
      } else {
        // Caso cadastre, mas o login automático falhe.
        setError("Cadastro concluído, mas não foi possível logar automaticamente.");
      }

    } catch (error) {
      // Caso ocorra erro de conexão com o servidor.
      console.log("Erro no cadastro:", error);
      setError("Erro ao conectar com o servidor.");
    }
  };

  // Parte visual da tela.
  return (
    <SafeAreaView style={styles.safe}>

      {/* Ajusta o conteúdo quando o teclado aparece */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        {/* Cabeçalho com o nome do app e botão voltar */}
        <View style={styles.header}>
          <Text style={styles.logoText}>doUAUlingo</Text>

          {/* Volta para a tela de login */}
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.backText}>VOLTAR</Text>
          </TouchableOpacity>
        </View>

        {/* Card central do formulário */}
        <View style={styles.card}>

          {/* Círculo com a mascote */}
          <View style={styles.logoCircle}>
            <Image
              source={{
                uri: "https://static.vecteezy.com/system/resources/previews/068/873/860/non_2x/capybara-wearing-graduation-cap-looks-intelligent-and-proud-symbolizing-achievement-and-education-this-charming-animal-captures-essence-of-celebration-and-success-png.png",
              }}
              style={styles.logoImage}
            />
          </View>

          {/* Título da tela */}
          <Text style={styles.title}>Criar sua conta</Text>

          {/* Campo para nome do usuário */}
          <TextInput
            placeholder="Nome"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          {/* Campo para e-mail */}
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Campo para senha */}
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          {/* Campo para confirmar senha */}
          <TextInput
            placeholder="Confirmar senha"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
          />

          {/* Exibe erro caso exista alguma mensagem */}
          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}

          {/* Botão principal para criar a conta */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRegister}
          >
            <Text style={styles.primaryText}>CADASTRAR</Text>
          </TouchableOpacity>

          {/* Botão para quem já possui conta */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.secondaryText}>
              JÁ TENHO UMA CONTA
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

  // Card central onde fica o formulário.
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },

  // Círculo da mascote.
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

  // Título da tela.
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
});