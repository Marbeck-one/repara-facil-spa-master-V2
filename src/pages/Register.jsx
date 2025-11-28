import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api"; // <-- Importamos Axios configurado

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmar: "",
  });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => { // <-- Hacemos la función async
    e.preventDefault();
    setError("");
    setExito("");

    // Validaciones básicas
    if (!form.email.trim()) {
      setError("El correo es obligatorio.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (form.password !== form.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      // --- LLAMADA AL BACKEND ---
      // Usamos el email como 'username' para el backend
      const response = await api.post("/auth/register", {
        username: form.email, 
        password: form.password
      });

      // Si el backend devuelve el token, lo guardamos (Login automático)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", form.email);
        setExito("¡Registro exitoso! Redirigiendo...");
        
        setTimeout(() => {
          navigate("/"); // Vamos al home ya logueados
          window.location.reload(); // Recarga rápida para actualizar estado auth
        }, 1500);
      }
      
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setError("El usuario ya existe.");
      } else {
        setError("Error al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card p-4 shadow-sm border-0">
            <h3 className="text-center text-success mb-3">Crear Cuenta</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre Completo</label>
                <input
                  name="nombre"
                  className="form-control"
                  value={form.nombre}
                  onChange={handleChange}
                  // Nota: Por ahora el nombre no se guarda en tabla Usuarios, 
                  // solo email y pass. Luego conectaremos tabla Clientes.
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirmar"
                  className="form-control"
                  value={form.confirmar}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <div className="alert alert-danger py-2">{error}</div>}
              {exito && <div className="alert alert-success py-2">{exito}</div>}

              <button type="submit" className="btn btn-success w-100" disabled={loading}>
                {loading ? "Registrando..." : "Registrarme"}
              </button>
            </form>

            <p className="text-center mt-3 mb-0 small">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}