// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  // Iniciamos loading en true para esperar a leer localStorage
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("username");
      
      if (storedToken) {
        console.log("✅ AuthContext: Token encontrado, restaurando sesión.");
        setToken(storedToken);
        setUsername(storedUser);
      } else {
        console.log("ℹ️ AuthContext: No hay token guardado.");
      }
    } catch (error) {
      console.error("❌ Error leyendo localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (userOrEmail, password) => {
    try {
      console.log("Attempting login for:", userOrEmail);
      // Ajusta la ruta si tu backend usa otra (ej: /auth/authenticate)
      const resp = await api.post("/auth/login", { 
        username: userOrEmail, 
        password: password 
      });
      
      const { token } = resp.data;
      if (!token) throw new Error("No se recibió token del servidor");

      setToken(token);
      setUsername(userOrEmail);
      localStorage.setItem("token", token);
      localStorage.setItem("username", userOrEmail);
      console.log("✅ Login exitoso");
      
      return true; // Login OK
    } catch (error) {
      console.error("❌ Error en login:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("🔒 Cerrando sesión...");
    setToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    // Opcional: Limpiar también datos antiguos del otro contexto si estorban
    localStorage.removeItem("usuario"); 
  };

  const value = {
    token,
    username,
    isAuthenticated: !!token, // Doble negación convierte a booleano real
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("❌ useAuth debe usarse dentro de un <AuthProvider>");
  }
  return context;
};