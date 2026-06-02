// Importa o hook de navegação do Expo Router.
import { useRouter } from "expo-router";

// Importa o useState para controlar se a sidebar está aberta ou fechada.
import { useState } from "react";

// Importa componentes do React Native.
import {
  Animated, // Usado para criar animação na largura da sidebar.
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Contexto de autenticação.
// Usado para fazer logout.
import { useAuth } from "../contexts/AuthContext";

// Contexto de tema.
// Usado para aplicar as cores do tema atual.
import { useTheme } from "../contexts/ThemeContext";

// Componente da barra lateral.
export default function Sidebar() {
  // Permite navegar entre telas.
  const router = useRouter();

  // Pega a função de logout.
  const { logout } = useAuth();

  // Pega o tema atual.
  const { theme } = useTheme();

  // Controla se a sidebar está aberta ou recolhida.
  const [open, setOpen] = useState(true);

  // Valor animado que controla a largura da sidebar.
  const width = useState(new Animated.Value(230))[0];

  // Função para abrir/fechar a sidebar com animação.
  const toggleSidebar = () => {
    Animated.timing(width, {
      // Se estiver aberta, diminui para 78.
      // Se estiver fechada, aumenta para 230.
      toValue: open ? 78 : 230,
      duration: 220,
      useNativeDriver: false,
    }).start();

    // Atualiza o estado aberto/fechado.
    setOpen(!open);
  };

  return (
    // Container animado da sidebar.
    <Animated.View
      style={[
        styles.sidebar,
        {
          width,
          backgroundColor: theme.card,
        },
      ]}
    >
      {/* Parte superior da sidebar */}
      <View style={styles.topArea}>

        {/* Botão para abrir ou fechar a sidebar */}
        <TouchableOpacity style={styles.toggleButton} onPress={toggleSidebar}>
          <Text style={styles.toggleText}>{open ? "←" : "→"}</Text>
        </TouchableOpacity>

        {/* Logo do app */}
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🦉</Text>

          {/* Mostra o texto apenas quando a sidebar está aberta */}
          {open && <Text style={styles.logoText}>doUAU</Text>}
        </View>
      </View>

      {/* Menu principal */}
      <View style={styles.menu}>

        {/* Item Dashboard */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push("/dashboard")}
        >
          <Text style={styles.icon}>🏠</Text>

          {/* Texto aparece apenas se a sidebar estiver aberta */}
          {open && (
            <Text style={[styles.itemText, { color: theme.text }]}>
              Dashboard
            </Text>
          )}
        </TouchableOpacity>

        {/* Item Conquistas */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push("/conquista")}
        >
          <Text style={styles.icon}>🏆</Text>

          {open && (
            <Text style={[styles.itemText, { color: theme.text }]}>
              Conquistas
            </Text>
          )}
        </TouchableOpacity>

        {/* Item Perfil */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.icon}>👤</Text>

          {open && (
            <Text style={[styles.itemText, { color: theme.text }]}>
              Perfil
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Botão de logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          // Remove o usuário autenticado.
          logout();

          // Redireciona para a tela de login.
          router.replace("/login");
        }}
      >
        <Text style={styles.icon}>🚪</Text>

        {/* Texto aparece apenas se a sidebar estiver aberta */}
        {open && <Text style={styles.logoutText}>Sair</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}

// Estilos da sidebar.
const styles = StyleSheet.create({
  // Container principal da sidebar.
  sidebar: {
    height: "100%",
    paddingTop: 38,
    paddingHorizontal: 10,
    borderRightWidth: 2,
    borderRightColor: "#e5e5e5",
  },

  // Área superior com botão e logo.
  topArea: {
    marginBottom: 24,
  },

  // Botão de abrir/fechar sidebar.
  toggleButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#58cc02",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderBottomWidth: 4,
    borderBottomColor: "#46a302",
  },

  // Texto da seta.
  toggleText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  // Caixa do logo.
  logoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#d7ffb8",
    padding: 10,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#58cc02",
  },

  // Emoji do logo.
  logoEmoji: {
    fontSize: 28,
  },

  // Texto do logo.
  logoText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#58cc02",
  },

  // Área dos itens do menu.
  menu: {
    flex: 1,
    gap: 10,
  },

  // Botão de cada item do menu.
  item: {
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderBottomWidth: 4,
    borderBottomColor: "#d1d1d1",
  },

  // Ícone de cada item.
  icon: {
    fontSize: 24,
    width: 32,
    textAlign: "center",
  },

  // Texto dos itens do menu.
  itemText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "900",
  },

  // Botão de sair.
  logoutButton: {
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe5e5",
    borderWidth: 2,
    borderColor: "#ffb3b3",
    borderBottomWidth: 4,
    borderBottomColor: "#ff8a8a",
    marginBottom: 24,
  },

  // Texto do botão sair.
  logoutText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "900",
    color: "#ff4b4b",
  },
});