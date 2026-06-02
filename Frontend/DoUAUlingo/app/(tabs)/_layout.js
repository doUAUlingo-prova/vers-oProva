// Importa os ícones do pacote Expo Vector Icons.
// São utilizados nos botões da barra inferior.
import { Ionicons } from "@expo/vector-icons";

// Importa o sistema de navegação por abas do Expo Router.
import { Tabs } from "expo-router";

// Componente responsável por alternar entre tema claro e escuro.
import ThemeToggle from "../../components/ThemeToggle";

// Contexto responsável pelas cores e temas da aplicação.
import { useTheme } from "../../contexts/ThemeContext";

// Componente que define a navegação por abas do aplicativo.
export default function TabsLayout() {

  // Obtém as cores do tema atual.
  const { theme } = useTheme();

  return (

    // Navegação principal por abas.
    <Tabs
      screenOptions={{

        // ================= HEADER =================

        // Cor de fundo do cabeçalho.
        headerStyle: {
          backgroundColor: theme.card,
        },

        // Cor dos textos e ícones do cabeçalho.
        headerTintColor: theme.text,

        // Estilo do título exibido no cabeçalho.
        headerTitleStyle: {
          fontWeight: "900",
        },

        // Botão exibido no canto superior direito.
        // Responsável por alternar entre tema claro e escuro.
        headerRight: () => <ThemeToggle />,

        // ================= TAB BAR =================

        // Estilo da barra inferior de navegação.
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 2,
          borderTopColor: "#e5e5e5",
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },

        // Cor da aba selecionada.
        tabBarActiveTintColor: "#58cc02",

        // Cor das abas não selecionadas.
        tabBarInactiveTintColor: theme.subtext,

        // Estilo do texto das abas.
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "900",
        },
      }}
    >

      {/* ================= DASHBOARD ================= */}

      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Início",

          // Ícone da aba Dashboard.
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* ================= CONQUISTAS ================= */}

      <Tabs.Screen
        name="conquista"
        options={{
          title: "Conquistas",

          // Ícone da aba Conquistas.
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="trophy"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* ================= PERFIL ================= */}

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",

          // Ícone da aba Perfil.
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-circle"
              size={size}
              color={color}
            />
          ),
        }}
      />

    </Tabs>
  );
}