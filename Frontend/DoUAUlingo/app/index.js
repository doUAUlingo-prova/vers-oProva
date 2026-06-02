// Importa o sistema de navegação do Expo Router.
// Permite navegar entre as telas do aplicativo.
import { useRouter } from "expo-router";

// Importa componentes visuais do React Native.
import {
  Image, // Exibe imagens.
  SafeAreaView, // Evita sobreposição com notch e barra superior.
  ScrollView, // Permite rolagem da tela.
  StyleSheet, // Criação de estilos.
  Text, // Exibição de textos.
  TouchableOpacity, // Botões clicáveis.
  View, // Container visual.
} from "react-native";

// Componente principal da página inicial (Landing Page).
export default function LandingPage() {

  // Hook responsável pela navegação entre telas.
  const router = useRouter();

  // Estrutura visual da tela.
  return (

    // Área segura da aplicação.
    <SafeAreaView style={styles.safe}>

      {/* Container com rolagem */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >

        {/* ================= HEADER ================= */}
        <View style={styles.header}>

          {/* Nome/logo do aplicativo */}
          <Text style={styles.logo}>doUAUlingo</Text>

          {/* Botão para acessar a tela de login */}
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.login}>ENTRAR</Text>
          </TouchableOpacity>

        </View>

        {/* ================= HERO SECTION ================= */}
        <View style={styles.hero}>

          {/* Área circular onde fica a mascote do aplicativo */}
          <View style={styles.mascotCircle}>
            <Image
              source={{
                uri: "https://static.vecteezy.com/system/resources/previews/068/873/860/non_2x/capybara-wearing-graduation-cap-looks-intelligent-and-proud-symbolizing-achievement-and-education-this-charming-animal-captures-essence-of-celebration-and-success-png.png",
              }}
              style={styles.mascotImage}
            />
          </View>

          {/* Botão para criar uma nova conta */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.primaryText}>
              COMEÇAR AGORA
            </Text>
          </TouchableOpacity>

          {/* Botão para usuários que já possuem conta */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.secondaryText}>
              JÁ TENHO UMA CONTA
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ================= ESTILOS =================
const styles = StyleSheet.create({

  // Container principal da tela.
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // Container do ScrollView.
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // Área de conteúdo da tela.
  content: {
    paddingBottom: 30,
  },

  // Cabeçalho superior.
  header: {
    paddingHorizontal: 22,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Logo do aplicativo.
  logo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#58cc02",
    letterSpacing: 1,
  },

  // Texto do botão Entrar.
  login: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1cb0f6",
  },

  // Área principal da Landing Page.
  hero: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  // Círculo que contém a mascote.
  mascotCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#d7ffb8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    borderWidth: 4,
    borderColor: "#58cc02",
    overflow: "hidden",
  },

  // Imagem da mascote.
  mascotImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },

  // Título principal (não utilizado atualmente).
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3c3c3c",
    textAlign: "center",
    lineHeight: 34,
  },

  // Subtítulo (não utilizado atualmente).
  subtitle: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 14,
    lineHeight: 23,
  },

  // Botão principal "Começar Agora".
  primaryButton: {
    width: "100%",
    backgroundColor: "#58cc02",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 34,
    borderBottomWidth: 5,
    borderBottomColor: "#46a302",
  },

  // Texto do botão principal.
  primaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },

  // Botão secundário "Já Tenho Uma Conta".
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

  // Área reservada para cards informativos (não utilizada atualmente).
  cards: {
    marginTop: 32,
    paddingHorizontal: 22,
  },

  // Card individual.
  card: {
    backgroundColor: "#f7f7f7",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },

  // Ícone do card.
  cardIcon: {
    fontSize: 26,
    marginRight: 12,
  },

  // Texto do card.
  cardText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#4b4b4b",
  },

  // Rodapé da página (não utilizado atualmente).
  footer: {
    textAlign: "center",
    marginTop: 24,
    color: "#aaa",
    fontSize: 12,
  },
});