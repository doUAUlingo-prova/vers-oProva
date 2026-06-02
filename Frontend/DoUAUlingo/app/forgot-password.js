// Importa o hook de navegação do Expo Router.
// Ele permite trocar de tela, voltar, redirecionar, etc.
import { useRouter } from "expo-router";

// Importa o useState, usado para guardar e atualizar valores na tela.
import { useState } from "react";

// Importa componentes visuais do React Native.
import {
  Alert, // Exibe alertas nativos do celular/navegador.
  Image, // Exibe imagens.
  KeyboardAvoidingView, // Ajusta a tela quando o teclado aparece.
  Platform, // Identifica se está rodando em iOS, Android ou Web.
  SafeAreaView, // Evita que o conteúdo fique em áreas como notch/barra superior.
  StyleSheet, // Cria os estilos da tela.
  Text, // Exibe textos.
  TextInput, // Campo de entrada de texto.
  TouchableOpacity, // Botão clicável.
  View, // Container visual.
} from "react-native";

// URL base da API local.
// Como estamos rodando o backend localmente, usamos localhost na porta 8080.
const API_URL = "http://localhost:8080";

// Componente principal da tela de recuperação de senha.
export default function ForgotPasswordPage() {
  // Cria o objeto router para navegar entre telas.
  const router = useRouter();

  // Estado que armazena o e-mail digitado.
  const [email, setEmail] = useState("");

  // Estado que armazena a nova senha.
  const [novaSenha, setNovaSenha] = useState("");

  // Estado que armazena a confirmação da nova senha.
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Estado usado para exibir mensagem de erro.
  const [error, setError] = useState("");

  // Estado usado para exibir mensagem de sucesso.
  const [success, setSuccess] = useState("");

  // Estado usado para indicar carregamento enquanto a requisição está acontecendo.
  const [loading, setLoading] = useState(false);

  // Função executada quando o usuário clica em "REDEFINIR SENHA".
  const redefinirSenha = async () => {
    // Limpa mensagens antigas antes de validar novamente.
    setError("");
    setSuccess("");

    // Verifica se todos os campos foram preenchidos.
    if (!email || !novaSenha || !confirmarSenha) {
      setError("Preencha todos os campos.");
      return;
    }

    // Validação simples para verificar se o e-mail possui "@". 
    if (!email.includes("@")) {
      setError("Digite um e-mail válido.");
      return;
    }

    // Valida se a nova senha possui no mínimo 6 caracteres.
    if (novaSenha.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    // Confere se a senha e a confirmação são iguais.
    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      // Ativa o estado de carregamento.
      setLoading(true);

      // Faz a requisição PUT para o backend redefinir a senha.
      const response = await fetch(`${API_URL}/usuarios/recuperar-senha`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        // Envia o e-mail e a nova senha no corpo da requisição.
        body: JSON.stringify({
          email,
          novaSenha,
        }),
      });

      // Converte a resposta do backend para JSON.
      const data = await response.json();

      // Se a resposta não for OK, exibe a mensagem de erro retornada pela API.
      if (!response.ok) {
        setError(data.erro || data.message || "Erro ao redefinir senha.");
        return;
      }

      // Se deu certo, exibe mensagem de sucesso.
      setSuccess("Senha redefinida com sucesso!");

      // Mostra um alerta informando que a senha foi redefinida.
      Alert.alert(
        "Sucesso",
        "Sua senha foi redefinida. Agora faça login com a nova senha.",
        [
          {
            text: "Ir para login",

            // Redireciona o usuário para a tela de login.
            onPress: () => router.replace("/login"),
          },
        ]
      );

      // Limpa os campos após o sucesso.
      setEmail("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      // Caso tenha erro de conexão com o servidor, cai aqui.
      console.log("Erro ao recuperar senha:", error);
      setError("Erro ao conectar com o servidor.");
    } finally {
      // Desativa o carregamento no final, dando certo ou erro.
      setLoading(false);
    }
  };

  // Parte visual da tela.
  return (
    // Container seguro para evitar problemas com barra superior/notch.
    <SafeAreaView style={styles.safe}>

      {/* Ajusta a tela quando o teclado aparece, principalmente no iOS. */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        {/* Cabeçalho da tela com nome do app e botão voltar. */}
        <View style={styles.header}>
          <Text style={styles.logoText}>doUAUlingo</Text>

          {/* Botão para voltar para a tela de login. */}
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.backText}>VOLTAR</Text>
          </TouchableOpacity>
        </View>

        {/* Card central com formulário de recuperação de senha. */}
        <View style={styles.card}>

          {/* Área circular onde aparece a imagem/logo do app. */}
          <View style={styles.logoCircle}>
            <Image
              source={{
                uri: "https://static.vecteezy.com/system/resources/previews/068/873/860/non_2x/capybara-wearing-graduation-cap-looks-intelligent-and-proud-symbolizing-achievement-and-education-this-charming-animal-captures-essence-of-celebration-and-success-png.png",
              }}
              style={styles.logoImage}
            />
          </View>

          {/* Título da tela. */}
          <Text style={styles.title}>Recuperar senha</Text>

          {/* Texto explicando o que o usuário deve fazer. */}
          <Text style={styles.subtitle}>
            Digite seu e-mail cadastrado e escolha uma nova senha.
          </Text>

          {/* Campo para digitar o e-mail. */}
          <TextInput
            placeholder="seu@email.com"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Campo para digitar a nova senha. */}
          <TextInput
            placeholder="Nova senha"
            placeholderTextColor="#9ca3af"
            value={novaSenha}
            onChangeText={setNovaSenha}
            style={styles.input}
            secureTextEntry
          />

          {/* Campo para confirmar a nova senha. */}
          <TextInput
            placeholder="Confirmar nova senha"
            placeholderTextColor="#9ca3af"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            style={styles.input}
            secureTextEntry
          />

          {/* Exibe erro somente se existir mensagem de erro. */}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Exibe sucesso somente se existir mensagem de sucesso. */}
          {success ? <Text style={styles.success}>{success}</Text> : null}

          {/* Botão principal para redefinir senha. */}
          <TouchableOpacity
            style={[
              styles.primaryButton,

              // Se estiver carregando, aplica estilo de botão desabilitado.
              loading && styles.disabledButton,
            ]}
            onPress={redefinirSenha}
            disabled={loading}
          >
            <Text style={styles.primaryText}>
              {/* Altera o texto do botão durante o carregamento. */}
              {loading ? "SALVANDO..." : "REDEFINIR SENHA"}
            </Text>
          </TouchableOpacity>

          {/* Botão secundário para voltar ao login. */}
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

// Estilos da tela.
const styles = StyleSheet.create({
  // Container principal seguro.
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // Container interno da tela.
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

  // Texto do logo/nome do app.
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

  // Card central do formulário.
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },

  // Círculo onde fica a imagem da capivara.
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

  // Estilo da imagem.
  logoImage: {
    width: 82,
    height: 82,
    resizeMode: "contain",
  },

  // Título principal.
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3c3c3c",
    textAlign: "center",
    marginBottom: 8,
  },

  // Subtítulo explicativo.
  subtitle: {
    fontSize: 14,
    color: "#777",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 22,
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

  // Mensagem de sucesso.
  success: {
    color: "#58cc02",
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

  // Estilo aplicado quando o botão está desabilitado/carregando.
  disabledButton: {
    opacity: 0.65,
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