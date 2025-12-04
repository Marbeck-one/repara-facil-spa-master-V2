import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/api";

export default function DashboardCliente() {
  const { username } = useAuth();
  const [misServicios, setMisServicios] = useState([]);
  const [misGarantias, setMisGarantias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) fetchMisDatos();
  }, [username]);

  const fetchMisDatos = async () => {
    try {
      setLoading(true);
      const [serviciosResp, garantiasResp] = await Promise.all([
        api.get("/servicios"),
        api.get("/garantias")
      ]);

      // FILTRO ROBUSTO (Ignora mayúsculas/espacios)
      const emailUsuario = username.trim().toLowerCase();

      const misServiciosFiltrados = serviciosResp.data.filter(s => 
        s.cliente && s.cliente.email && s.cliente.email.trim().toLowerCase() === emailUsuario
      );
      
      const misGarantiasFiltradas = garantiasResp.data.filter(g =>
        g.servicio && g.servicio.cliente && g.servicio.cliente.email &&
        g.servicio.cliente.email.trim().toLowerCase() === emailUsuario
      );

      setMisServicios(misServiciosFiltrados);
      setMisGarantias(misGarantiasFiltradas);

    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3">🏠 Mi Panel de Cliente</h1>
          <p className="text-muted mb-0">Bienvenido, <strong>{username}</strong></p>
        </div>
        <Link to="/servicios" className="btn btn-primary shadow-sm">
          <i className="bi bi-plus-lg me-2"></i>Solicitar Servicio
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <>
          {/* Resumen */}
          <div className="row g-4 mb-5">
            <div className="col-md-6">
              <div className="card bg-primary text-white h-100 shadow-sm border-0">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase opacity-75">Servicios Solicitados</h6>
                    <h2 className="display-4 fw-bold mb-0">{misServicios.length}</h2>
                  </div>
                  <i className="bi bi-tools fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-success text-white h-100 shadow-sm border-0">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase opacity-75">Garantías Activas</h6>
                    <h2 className="display-4 fw-bold mb-0">{misGarantias.length}</h2>
                  </div>
                  <i className="bi bi-shield-check fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-dark">📋 Historial de Servicios</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Problema</th>
                    <th>Estado</th>
                    <th>Fecha Solicitud</th>
                    <th>Técnico</th>
                  </tr>
                </thead>
                <tbody>
                  {misServicios.length > 0 ? (
                    misServicios.map((s) => (
                      <tr key={s.id}>
                        <td className="fw-bold">#{s.id}</td>
                        <td>{s.descripcionProblema}</td>
                        <td><span className="badge bg-secondary">{s.estado}</span></td>
                        <td>{new Date(s.fechaSolicitud).toLocaleDateString()}</td>
                        <td>{s.tecnico ? `${s.tecnico.nombre} ${s.tecnico.apellido}` : "---"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="text-center py-4">No tienes servicios registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}