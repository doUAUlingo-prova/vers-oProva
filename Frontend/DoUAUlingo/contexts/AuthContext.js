import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:8080";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "E-mail ou senha inválidos.",
        };
      }

      setToken(data.token);
      setUsuario(data.usuario || data.user || {
        email: email,
        nome: data.nome || "Usuário",
      });
      setIsAuthenticated(true);

      return {
        success: true,
        token: data.token,
      };
    } catch (error) {
      return {
        success: false,
        message: "Erro ao conectar com o servidor.",
      };
    }
  };

  const register = async (nome, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Erro ao cadastrar usuário.",
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: "Erro ao conectar com o servidor.",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        logout,
        isAuthenticated,
        token,
        usuario,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa estar dentro do AuthProvider");
  }

  return context;
};