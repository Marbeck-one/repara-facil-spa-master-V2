// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.username, formData.password);
      
      // Decodificar el token para obtener el rol
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      console.log("Login exitoso. Rol detectado:", role);
      
      // Redirigir según el rol del usuario
      const normalizedRole = role?.replace("ROLE_", "");
      
      if (normalizedRole === "ADMIN") {
        navigate("/dashboard/admin");
      } else if (normalizedRole === "TECNICO") {
        navigate("/dashboard/tecnico");
      } else if (normalizedRole === "CLIENTE") {
        navigate("/dashboard/cliente");
      } else {
        // Fallback por si el rol no se pudo detectar
        navigate("/");
      }
      
    } catch (err) {
      console.error("Error en login:", err);
      setError(
        err.response?.data?.message || 
        "Usuario o contraseña incorrectos"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">🔐 Iniciar Sesión</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Usuario
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </button>
              </form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="text-muted mb-2">Usuarios de prueba:</p>
                <small className="d-block text-muted">
                  <strong>Admin:</strong> admin / admin123
                </small>
                <small className="d-block text-muted">
                  <strong>Técnico:</strong> tecnico1 / 123456
                </small>
              </div>

              <div className="text-center mt-3">
                <small className="text-muted">
                  ¿No tienes cuenta?{" "}
                  <a href="/register" className="text-decoration-none">
                    Regístrate aquí
                  </a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}