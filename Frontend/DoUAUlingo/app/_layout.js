// Importa o sistema de navegação baseado em arquivos do Expo Router
import { Stack } from "expo-router";

// Componentes visuais do React Native
import { ActivityIndicator, View } from "react-native";

// Contexto de autenticação (login, usuário logado, logout, etc.)
import { AuthProvider, useAuth } from "../contexts/AuthContext";

// Contexto responsável pelo avatar/foto do usuário
import { AvatarProvider } from "../contexts/AvatarContext";

// Contexto responsável pelas cores e tema da aplicação
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

// Componente responsável por controlar as rotas da aplicação
function RootNavigator() {

  // Obtém o usuário autenticado e o estado de carregamento
  const { usuario, loading } = useAuth();

  // Obtém o tema atual da aplicação
  const { theme } = useTheme();

  // Enquanto verifica se existe um usuário logado,
  // exibe uma tela de carregamento
  if (loading) return (
    <View
      style={{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor: theme.background
      }}
    >
      <ActivityIndicator
        size="large"
        color={theme.primary}
      />
    </View>
  );

  // Define todas as telas disponíveis no aplicativo
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Oculta o cabeçalho padrão
        contentStyle: {
          backgroundColor: theme.background // Aplica o tema nas telas
        }
      }}
    >

      {/* Tela inicial */}
      <Stack.Screen name="index" />

      {/* Tela de login */}
      <Stack.Screen name="login" />

      {/* Tela de cadastro */}
      <Stack.Screen name="register" />

      {/* Tela de recuperação de senha */}
      <Stack.Screen name="forgot-password" />

      {/* Grupo principal de abas após login */}
      <Stack.Screen name="(tabs)" />

    </Stack>
  );
}

// Componente raiz da aplicação
export default function Layout() {
  return (

    // Disponibiliza autenticação para toda a aplicação
    <AuthProvider>

      {/* Disponibiliza tema para toda a aplicação */}
      <ThemeProvider>

        {/* Disponibiliza avatar para toda a aplicação */}
        <AvatarProvider>

          {/* Inicia o sistema de navegação */}
          <RootNavigator />

        </AvatarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}