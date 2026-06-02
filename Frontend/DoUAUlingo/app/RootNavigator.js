// Importa o componente Stack do Expo Router.
// O Stack é responsável por controlar a navegação entre telas.
import { Stack } from "expo-router";

// Importa o contexto de autenticação.
// Usamos ele para saber se existe um usuário logado.
import { useAuth } from "../contexts/AuthContext";

// Componente responsável por controlar quais telas serão exibidas.
export default function RootNavigator() {

  // Obtém o usuário atualmente autenticado.
  const { usuario } = useAuth();

  return (

    // Cria uma pilha de navegação.
    // headerShown: false remove o cabeçalho padrão das telas.
    <Stack screenOptions={{ headerShown: false }}>

      {/* 
        Se NÃO existir usuário logado:
        Mostra apenas telas públicas.
      */}
      {!usuario ? (
        <>
          {/* Tela inicial */}
          <Stack.Screen name="index" />

          {/* Tela de login */}
          <Stack.Screen name="login" />

          {/* Tela de cadastro */}
          <Stack.Screen name="register" />

          {/* Tela de recuperação de senha */}
          <Stack.Screen name="forgot-password" />
        </>
      ) : (

        /*
          Se existir usuário logado:
          Mostra somente as telas internas do aplicativo.
        */
        <Stack.Screen name="(tabs)" />
      )}

    </Stack>
  );
}