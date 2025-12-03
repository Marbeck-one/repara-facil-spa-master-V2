// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

// Función para decodificar JWT y extraer el payload
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decodificando token:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null); // ROL del usuario
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("username");
      
      if (storedToken) {
        console.log("✅ AuthContext: Token encontrado, restaurando sesión.");
        
        // ✅ DECODIFICAR TOKEN PARA OBTENER ROL
        const decoded = decodeToken(storedToken);
        
        if (decoded && decoded.exp * 1000 > Date.now()) {
          // Token válido
          const userRole = decoded.role || decoded.authorities?.[0]?.replace("ROLE_", "") || "CLIENTE";
          
          setToken(storedToken);
          setUsername(storedUser || decoded.sub);
          setRole(userRole);
          
          // Guardar el rol en localStorage si no estaba
          localStorage.setItem("role", userRole);
          
          console.log("✅ Sesión restaurada. Rol:", userRole);
        } else {
          console.warn("⚠️ Token expirado, limpiando sesión");
          localStorage.clear();
          setToken(null);
          setUsername(null);
          setRole(null);
        }
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
      const resp = await api.post("/auth/login", { 
        username: userOrEmail, 
        password: password 
      });
      
      const { token } = resp.data;
      if (!token) throw new Error("No se recibió token del servidor");

      // ✅ DECODIFICAR TOKEN PARA EXTRAER EL ROL
      const decoded = decodeToken(token);
      console.log("Token decodificado:", decoded);
      
      // Extraer rol limpio (sin "ROLE_")
      const userRole = decoded.role || decoded.authorities?.[0]?.replace("ROLE_", "") || "CLIENTE";
      
      setToken(token);
      setUsername(userOrEmail);
      setRole(userRole);
      
      localStorage.setItem("token", token);
      localStorage.setItem("username", userOrEmail);
      localStorage.setItem("role", userRole);
      
      console.log("✅ Login exitoso. Rol:", userRole);
      
      return true;
    } catch (error) {
      console.error("❌ Error en login:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("🔒 Cerrando sesión...");
    setToken(null);
    setUsername(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("usuario");
  };

  const value = {
    token,
    username,
    role,
    isAuthenticated: !!token,
    isAdmin: role === "ADMIN",
    isTecnico: role === "TECNICO",
    isCliente: role === "CLIENTE",
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("❌ useAuth debe usarse dentro de un <AuthProvider>");
  }
  return context;
};