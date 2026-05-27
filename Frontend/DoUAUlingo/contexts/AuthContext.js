import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();
const API_URL = "https://x49aok4laf.execute-api.us-east-1.amazonaws.com";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { carregarUsuarioSalvo(); }, []);

  const carregarUsuarioSalvo = async () => {
    try {
      const usuarioSalvo = await AsyncStorage.getItem("usuario");
      if (usuarioSalvo) {
        const user = JSON.parse(usuarioSalvo);
        const response = await fetch(`${API_URL}/usuarios/me?email=${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const usuarioAtualizado = await response.json();
          setUsuario(usuarioAtualizado);
          await AsyncStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
        } else {
          setUsuario(user);
        }
      }
    } catch (error) { console.log("Erro ao carregar usuário:", error); }
    finally { setLoading(false); }
  };

  const atualizarUsuario = async () => {
    try {
      if (!usuario?.email) return;
      const response = await fetch(`${API_URL}/usuarios/me?email=${encodeURIComponent(usuario.email)}`);
      if (response.ok) {
        const usuarioAtualizado = await response.json();
        setUsuario(usuarioAtualizado);
        await AsyncStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
      }
    } catch (error) { console.log("Erro ao atualizar usuário:", error); }
  };

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
      await AsyncStorage.setItem("usuario", JSON.stringify(user));
      return { success: true, user };
    } catch (error) { console.log("Erro ao fazer login:", error); return { success: false, message: "Erro ao conectar com o servidor." }; }
  };

  const register = async (nome, email, senha) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      const user = data.usuario || data;
      setUsuario(user);
      await AsyncStorage.setItem("usuario", JSON.stringify(user));
      return user;
    } catch (error) {
      console.log("Erro cadastro:", error);
      throw new Error("Erro ao cadastrar usuário.");
    }
  };

  const logout = async () => {
    setUsuario(null);
    await AsyncStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, loading, login, register, logout, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }