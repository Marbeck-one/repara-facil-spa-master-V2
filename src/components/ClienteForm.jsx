import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// CORREGIDO: Importamos desde ../api/
import {
  createCliente,
  getClienteById,
  updateCliente,
} from "../api/clientesService.js";

export default function ClienteForm() {
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "", // Agregado campo apellido que pide el backend
    email: "",    // Cambiado 'correo' por 'email' para coincidir con backend
    telefono: "",
    direccion: "" // Agregado campo dirección
  });
  const [errores, setErrores] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  // Cargar datos si es edición
  useEffect(() => {
    if (id) {
      getClienteById(id).then((data) => {
        setCliente(data); // El backend devuelve el objeto directo
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!cliente.nombre.trim()) nuevosErrores.nombre = "Requerido";
    if (!cliente.apellido.trim()) nuevosErrores.apellido = "Requerido";
    if (!cliente.email.trim()) nuevosErrores.email = "Requerido";
    if (!cliente.direccion.trim()) nuevosErrores.direccion = "Requerido";
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      if (id) {
        await updateCliente(id, cliente);
      } else {
        await createCliente(cliente);
      }
      navigate("/clientes");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el cliente");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h3>{id ? "Editar Cliente" : "Nuevo Cliente"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nombre</label>
            <input name="nombre" className="form-control" value={cliente.nombre} onChange={handleChange} />
            {errores.nombre && <small className="text-danger">{errores.nombre}</small>}
          </div>
          <div className="mb-3">
            <label>Apellido</label>
            <input name="apellido" className="form-control" value={cliente.apellido} onChange={handleChange} />
            {errores.apellido && <small className="text-danger">{errores.apellido}</small>}
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input name="email" type="email" className="form-control" value={cliente.email} onChange={handleChange} />
            {errores.email && <small className="text-danger">{errores.email}</small>}
          </div>
          <div className="mb-3">
            <label>Teléfono</label>
            <input name="telefono" className="form-control" value={cliente.telefono} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Dirección</label>
            <input name="direccion" className="form-control" value={cliente.direccion} onChange={handleChange} />
             {errores.direccion && <small className="text-danger">{errores.direccion}</small>}
          </div>

          <button type="submit" className="btn btn-primary me-2">Guardar</button>
          <button type="button" onClick={() => navigate("/clientes")} className="btn btn-secondary">Cancelar</button>
        </form>
      </div>
    </div>
  );
}