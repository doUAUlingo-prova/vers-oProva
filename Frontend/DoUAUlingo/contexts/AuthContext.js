// Importa o React e recursos usados para criar e consumir contexto.
// createContext cria um contexto global.
// useContext permite acessar esse contexto.
// useEffect executa algo quando o componente carrega.
// useState armazena estados como usuário e loading.
import React, { createContext, useContext, useEffect, useState } from "react";

// Importa o AsyncStorage.
// Ele é usado para salvar dados localmente no dispositivo,
// como manter o usuário logado mesmo fechando o app.
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cria o contexto de autenticação.
const AuthContext = createContext();

// URL do backend local.
const API_URL = "http://localhost:8080";

// Provider responsável por disponibilizar autenticação para o app inteiro.
export function AuthProvider({ children }) {
  // Estado que armazena o usuário logado.
  const [usuario, setUsuario] = useState(null);

  // Estado que indica se o app ainda está carregando o usuário salvo.
  const [loading, setLoading] = useState(true);

  // Quando o app inicia, tenta carregar o usuário salvo no AsyncStorage.
  useEffect(() => {
    carregarUsuarioSalvo();
  }, []);

  // Função que verifica se existe usuário salvo localmente.
  const carregarUsuarioSalvo = async () => {
    try {
      // Busca o usuário salvo no armazenamento local.
      const usuarioSalvo = await AsyncStorage.getItem("usuario");

      // Se existir usuário salvo, converte de JSON para objeto.
      if (usuarioSalvo) {
        const user = JSON.parse(usuarioSalvo);

        // Busca no backend os dados atualizados desse usuário.
        const response = await fetch(
          `${API_URL}/usuarios/me?email=${encodeURIComponent(user.email)}`
        );

        // Se o backend responder corretamente, atualiza o usuário.
        if (response.ok) {
          const usuarioAtualizado = await response.json();

          setUsuario(usuarioAtualizado);

          // Salva novamente os dados atualizados localmente.
          await AsyncStorage.setItem(
            "usuario",
            JSON.stringify(usuarioAtualizado)
          );
        } else {
          // Se não conseguir atualizar pelo backend,
          // mantém o usuário que estava salvo localmente.
          setUsuario(user);
        }
      }
    } catch (error) {
      console.log("Erro ao carregar usuário:", error);
    } finally {
      // Finaliza o carregamento inicial.
      setLoading(false);
    }
  };

  // Função usada para atualizar os dados do usuário logado.
  // Exemplo: depois de ganhar XP, mudar nível ou streak.
  const atualizarUsuario = async () => {
    try {
      // Se não tiver usuário logado, não faz nada.
      if (!usuario?.email) return;

      // Busca dados atualizados do usuário no backend.
      const response = await fetch(
        `${API_URL}/usuarios/me?email=${encodeURIComponent(usuario.email)}`
      );

      if (response.ok) {
        const usuarioAtualizado = await response.json();

        // Atualiza no estado global.
        setUsuario(usuarioAtualizado);

        // Atualiza também no armazenamento local.
        await AsyncStorage.setItem(
          "usuario",
          JSON.stringify(usuarioAtualizado)
        );
      }
    } catch (error) {
      console.log("Erro ao atualizar usuário:", error);
    }
  };

  // Função de login.
  const login = async (email, senha) => {
    try {
      // Envia e-mail e senha para o backend validar.
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        // Corpo da requisição com os dados de login.
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      // Se o backend retornar erro, login falhou.
      if (!response.ok) {
        const erro = await response.text();
        console.log("Erro no login:", erro);

        return {
          success: false,
          message: "E-mail ou senha inválidos.",
        };
      }

      // Converte a resposta para JSON.
      const data = await response.json();

      // Pega o usuário retornado.
      // Essa lógica aceita diferentes formatos de resposta do backend.
      const user = data.usuario || data.user || data;

      // Salva o usuário no estado global.
      setUsuario(user);

      // Salva o usuário localmente para manter login ativo.
      await AsyncStorage.setItem("usuario", JSON.stringify(user));

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.log("Erro ao fazer login:", error);

      return {
        success: false,
        message: "Erro ao conectar com o servidor.",
      };
    }
  };

  // Função de cadastro.
  const register = async (nome, email, senha) => {
    try {
      // Envia os dados do novo usuário para o backend.
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        // Corpo da requisição com nome, e-mail e senha.
        body: JSON.stringify({
          nome,
          email,
          senha,
        }),
      });

      // Se o cadastro falhar, lança erro.
      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Converte a resposta em JSON.
      const data = await response.json();

      // Pega o usuário retornado.
      const user = data.usuario || data;

      // Salva o usuário no estado global.
      setUsuario(user);

      // Salva localmente.
      await AsyncStorage.setItem("usuario", JSON.stringify(user));

      return user;
    } catch (error) {
      console.log("Erro cadastro:", error);

      throw new Error("Erro ao cadastrar usuário.");
    }
  };

  // Função de logout.
  const logout = async () => {
    // Remove usuário do estado global.
    setUsuario(null);

    // Remove usuário salvo localmente.
    await AsyncStorage.removeItem("usuario");
  };

  return (
    // Disponibiliza os dados e funções para o app inteiro.
    <AuthContext.Provider
      value={{
        usuario,
        setUsuario,
        loading,
        login,
        register,
        logout,
        atualizarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acessar o contexto de autenticação.
// Assim qualquer tela pode usar: const { usuario, login } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}