import React, { useEffect, useState } from "react";
// 1. Importamos useNavigate para poder cambiar de pagina
import { useNavigate } from "react-router-dom"; 
import { getClientes, deleteCliente } from "../api/clientesService.js";

export default function ClientesList() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  
  // 2. Inicializamos el hook de navegación
  const navigate = useNavigate(); 

  const cargar = () => {
    setLoading(true);
    getClientes()
      .then((data) => setClientes(data))
      .catch((err) => console.error("Error cargando clientes", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
  }, []);

  const filtrarClientes = clientes.filter((c) =>
    `${c.nombre} ${c.apellido} ${c.email}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Cargando clientes...</p>
      </div>
    );

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-primary">Gestión de Clientes</h2>
        
        {/* 3. BOTÓN PARA CREAR NUEVO CLIENTE */}
        <button 
          className="btn btn-success" 
          onClick={() => navigate("/clientes/nuevo")}
        >
          <i className="bi bi-plus-lg me-2"></i> Nuevo Cliente
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        className="form-control mb-4"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {filtrarClientes.length === 0 ? (
        <div className="alert alert-warning">No hay resultados</div>
      ) : (
        <table className="table table-hover shadow-sm rounded">
          <thead className="table-primary">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrarClientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre} {c.apellido}</td>
                <td>{c.email}</td>
                <td>{c.telefono}</td>
                <td className="text-center">
                  
                  {/* 4. BOTÓN EDITAR */}
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/clientes/editar/${c.id}`)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      if (window.confirm("¿Eliminar cliente?")) {
                        deleteCliente(c.id).then(() => cargar());
                      }
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}