import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const API_URL = "https://x49aok4laf.execute-api.us-east-1.amazonaws.com";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarioSalvo();
  }, []);

  const salvarSessao = async (usuarioData, tokenData = null) => {
    setUsuario(usuarioData);

    if (tokenData) {
      setToken(tokenData);
      await AsyncStorage.setItem("token", tokenData);
    }

    await AsyncStorage.setItem("usuario", JSON.stringify(usuarioData));
  };

  const carregarUsuarioSalvo = async () => {
    try {
      const usuarioSalvo = await AsyncStorage.getItem("usuario");
      const tokenSalvo = await AsyncStorage.getItem("token");

      if (tokenSalvo) {
        setToken(tokenSalvo);
      }

      if (usuarioSalvo) {
        const user = JSON.parse(usuarioSalvo);

        if (user?.email) {
          const response = await fetch(
            `${API_URL}/usuarios/me?email=${encodeURIComponent(user.email)}`
          );

          if (response.ok) {
            const usuarioAtualizado = await response.json();
            setUsuario(usuarioAtualizado);
            await AsyncStorage.setItem(
              "usuario",
              JSON.stringify(usuarioAtualizado)
            );
          } else {
            setUsuario(user);
          }
        } else {
          setUsuario(user);
        }
      }
    } catch (error) {
      console.log("Erro ao carregar usuário salvo:", error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarUsuario = async () => {
    try {
      if (!usuario?.email) return null;

      const response = await fetch(
        `${API_URL}/usuarios/me?email=${encodeURIComponent(usuario.email)}`
      );

      if (!response.ok) {
        console.log("Erro ao atualizar usuário:", await response.text());
        return null;
      }

      const usuarioAtualizado = await response.json();

      setUsuario(usuarioAtualizado);
      await AsyncStorage.setItem(
        "usuario",
        JSON.stringify(usuarioAtualizado)
      );

      return usuarioAtualizado;
    } catch (error) {
      console.log("Erro ao atualizar usuário:", error);
      return null;
    }
  };

  const buscarUsuarioPorEmail = async (email) => {
    const response = await fetch(
      `${API_URL}/usuarios/me?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      console.log("Erro ao buscar usuário:", await response.text());
      return null;
    }

    return await response.json();
  };

  const login = async (email, senha) => {
    try {
      const emailLimpo = email.trim();

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailLimpo,
          senha,
        }),
      });

      if (!response.ok) {
        const erro = await response.text();
        console.log("Erro no login:", erro);

        return {
          success: false,
          message: "E-mail ou senha inválidos.",
        };
      }

      const data = await response.json();

      const tokenRecebido =
        data.token ||
        data.jwt ||
        data.accessToken ||
        data.access_token ||
        null;

      let user =
        data.usuario ||
        data.user ||
        data.usuarioDTO ||
        data.dadosUsuario ||
        null;

      if (!user || !user.email) {
        user = await buscarUsuarioPorEmail(emailLimpo);
      }

      if (!user) {
        return {
          success: false,
          message: "Login feito, mas não foi possível carregar o usuário.",
        };
      }

      await salvarSessao(user, tokenRecebido);

      return {
        success: true,
        user,
        token: tokenRecebido,
      };
    } catch (error) {
      console.log("Erro ao fazer login:", error);

      return {
        success: false,
        message: "Erro ao conectar com o servidor.",
      };
    }
  };

  const register = async (nome, email, senha) => {
    try {
      const emailLimpo = email.trim();

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email: emailLimpo,
          senha,
        }),
      });

      if (!response.ok) {
        const erro = await response.text();
        console.log("Erro cadastro:", erro);

        return {
          success: false,
          message: "Erro ao cadastrar usuário.",
        };
      }

      const data = await response.json();

      const tokenRecebido =
        data.token ||
        data.jwt ||
        data.accessToken ||
        data.access_token ||
        null;

      let user =
        data.usuario ||
        data.user ||
        data.usuarioDTO ||
        data.dadosUsuario ||
        data;

      if (!user || !user.email) {
        user = await buscarUsuarioPorEmail(emailLimpo);
      }

      if (user) {
        await salvarSessao(user, tokenRecebido);
      }

      return {
        success: true,
        user,
        token: tokenRecebido,
      };
    } catch (error) {
      console.log("Erro ao cadastrar:", error);

      return {
        success: false,
        message: "Erro ao conectar com o servidor.",
      };
    }
  };

  const logout = async () => {
    setUsuario(null);
    setToken(null);

    await AsyncStorage.removeItem("usuario");
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        setUsuario,
        token,
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