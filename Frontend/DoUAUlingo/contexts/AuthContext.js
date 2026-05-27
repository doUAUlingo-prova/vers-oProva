import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const AuthContext = createContext();

const API_URL = "https://x49aok4laf.execute-api.us-east-1.amazonaws.com";

export function AuthProvider({ children }) {
  const router = useRouter();

  const [usuario, setUsuario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carrega usuário salvo no AsyncStorage
  useEffect(() => {
    const carregarUsuarioSalvo = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem("usuario");
        if (usuarioSalvo) {
          const user = JSON.parse(usuarioSalvo);

          // Busca dados atualizados no backend
          const response = await fetch(
            `${API_URL}/usuarios/me?email=${encodeURIComponent(user.email)}`
          );
          if (response.ok) {
            const usuarioAtualizado = await response.json();
            setUsuario(usuarioAtualizado);
            setIsAuthenticated(true);
            await AsyncStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
          } else {
            setUsuario(user);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.log("Erro ao carregar usuário salvo:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarUsuarioSalvo();
  }, []);

  // Atualiza usuário logado
  const atualizarUsuario = async () => {
    try {
      if (!usuario?.email) return;
      const response = await fetch(
        `${API_URL}/usuarios/me?email=${encodeURIComponent(usuario.email)}`
      );
      if (response.ok) {
        const usuarioAtualizado = await response.json();
        setUsuario(usuarioAtualizado);
        await AsyncStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
      }
    } catch (error) {
      console.log("Erro ao atualizar usuário:", error);
    }
  };

  // Login
  const login = async (email, senha) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const erro = await response.text();
        console.log("Erro no login:", erro);
        return { success: false, message: "E-mail ou senha inválidos." };
      }

      const data = await response.json();
      const user = data.usuario || data.user || data;

      setUsuario(user);
      setIsAuthenticated(true);
      await AsyncStorage.setItem("usuario", JSON.stringify(user));

      // Redireciona para a página principal
      router.replace("/(tabs)");

      return { success: true, user };
    } catch (error) {
      console.log("Erro ao fazer login:", error);
      return { success: false, message: "Erro ao conectar com o servidor." };
    }
  };

  // Cadastro
  const register = async (nome, email, senha) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!response.ok) {
        const erro = await response.text();
        console.log("Erro cadastro:", erro);
        throw new Error("Erro ao cadastrar usuário.");
      }

      const data = await response.json();
      const user = data.usuario || data;

      setUsuario(user);
      setIsAuthenticated(true);
      await AsyncStorage.setItem("usuario", JSON.stringify(user));

      // Redireciona direto para as abas sem passar pelo login
      router.replace("/(tabs)");

      return user;
    } catch (error) {
      console.log("Erro ao registrar:", error);
      throw error;
    }
  };

  const logout = async () => {
    setUsuario(null);
    setIsAuthenticated(false);
    await AsyncStorage.removeItem("usuario");
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        setUsuario,
        isAuthenticated,
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

export function useAuth() {
  return useContext(AuthContext);
}