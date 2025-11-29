// src/routes/RoleRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Componente para proteger rutas según el ROL del usuario
 * 
 * @param {Array} allowedRoles - Roles permitidos (ej: ["ADMIN", "TECNICO"])
 * @param {ReactNode} children - Componente hijo a renderizar si tiene permiso
 */
const RoleRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div>Cargando...</div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Normalizar roles (por si vienen con o sin prefijo "ROLE_")
  const normalizedRole = role?.replace("ROLE_", "");
  const normalizedAllowedRoles = allowedRoles.map(r => r.replace("ROLE_", ""));

  // Si no tiene el rol permitido, redirigir a su dashboard correspondiente
  if (!normalizedAllowedRoles.includes(normalizedRole)) {
    console.warn(`❌ Acceso denegado. Rol actual: ${role}, Roles permitidos: ${allowedRoles.join(", ")}`);
    
    // Redirigir según el rol del usuario
    if (normalizedRole === "ADMIN") {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (normalizedRole === "TECNICO") {
      return <Navigate to="/dashboard/tecnico" replace />;
    } else {
      return <Navigate to="/dashboard/cliente" replace />;
    }
  }

  return children;
};

export default RoleRoute;