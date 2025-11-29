// src/pages/DashboardCliente.jsx
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
    fetchMisDatos();
  }, []);

  const fetchMisDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener servicios y garantías
      // Nota: Idealmente deberías tener endpoints /servicios/mis-servicios y /garantias/mis-garantias
      // Por ahora traemos todos (no ideal en producción)
      const [serviciosResp, garantiasResp] = await Promise.all([
        api.get("/servicios"),
        api.get("/garantias")
      ]);

      setMisServicios(serviciosResp.data);
      setMisGarantias(garantiasResp.data);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const solicitarNuevoServicio = () => {
    // Redirigir a la página de servicios o abrir modal
    window.location.href = "/servicios";
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">🏠 Mi Panel de Cliente</h1>
          <p className="text-muted">Bienvenido, <strong>{username}</strong></p>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Tarjetas de resumen */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Servicios Activos</h5>
                  <h2 className="display-4">
                    {misServicios.filter(s => 
                      s.estado !== "COMPLETADO" && s.estado !== "CANCELADO"
                    ).length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Servicios Completados</h5>
                  <h2 className="display-4">
                    {misServicios.filter(s => s.estado === "COMPLETADO").length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <h5 className="card-title">Garantías Vigentes</h5>
                  <h2 className="display-4">{misGarantias.length}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Botón para solicitar nuevo servicio */}
          <div className="row mb-4">
            <div className="col-12 text-center">
              <button 
                className="btn btn-primary btn-lg"
                onClick={solicitarNuevoServicio}
              >
                🔧 Solicitar Nuevo Servicio
              </button>
            </div>
          </div>

          {/* Mis servicios */}
          <div className="row">
            <div className="col-12">
              <h3 className="mb-3">📋 Mis Servicios Solicitados</h3>
              
              {misServicios.length === 0 ? (
                <div className="alert alert-info">
                  <p className="mb-0">
                    No has solicitado servicios aún. 
                    <Link to="/servicios" className="alert-link ms-2">
                      Ver servicios disponibles
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Fecha Solicitud</th>
                        <th>Técnico</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misServicios.map((servicio) => (
                        <tr key={servicio.id}>
                          <td>{servicio.id}</td>
                          <td>{servicio.descripcionProblema}</td>
                          <td>
                            <span className={`badge ${
                              servicio.estado === "COMPLETADO" ? "bg-success" :
                              servicio.estado === "EN_PROGRESO" ? "bg-primary" :
                              servicio.estado === "CANCELADO" ? "bg-danger" :
                              "bg-warning"
                            }`}>
                              {servicio.estado}
                            </span>
                          </td>
                          <td>{new Date(servicio.fechaSolicitud).toLocaleDateString()}</td>
                          <td>{servicio.tecnico?.nombre || "Sin asignar"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Mis garantías */}
          <div className="row mt-5">
            <div className="col-12">
              <h3 className="mb-3">🛡️ Mis Garantías</h3>
              
              {misGarantias.length === 0 ? (
                <div className="alert alert-info">
                  No tienes garantías vigentes
                </div>
              ) : (
                <div className="row">
                  {misGarantias.map((garantia) => (
                    <div key={garantia.id} className="col-md-6 mb-3">
                      <div className="card border-success">
                        <div className="card-body">
                          <h5 className="card-title">Garantía #{garantia.id}</h5>
                          <p className="card-text">
                            <strong>Inicio:</strong> {new Date(garantia.fechaInicio).toLocaleDateString()}<br />
                            <strong>Fin:</strong> {new Date(garantia.fechaFin).toLocaleDateString()}<br />
                            <strong>Detalles:</strong> {garantia.detalles}
                          </p>
                          <span className={`badge ${
                            new Date(garantia.fechaFin) > new Date() ? "bg-success" : "bg-secondary"
                          }`}>
                            {new Date(garantia.fechaFin) > new Date() ? "Vigente" : "Expirada"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Accesos rápidos */}
          <div className="row mt-5">
            <div className="col-12">
              <h3 className="mb-3">⚡ Accesos Rápidos</h3>
            </div>
            
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">🔧 Servicios</h5>
                  <p className="card-text">Ver todos los servicios disponibles</p>
                  <Link to="/servicios" className="btn btn-outline-primary">
                    Ver Servicios
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">👨‍🔧 Técnicos</h5>
                  <p className="card-text">Conoce a nuestros técnicos</p>
                  <Link to="/tecnicos" className="btn btn-outline-success">
                    Ver Técnicos
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body text-center">
                  <h5 className="card-title">📞 Contacto</h5>
                  <p className="card-text">¿Necesitas ayuda?</p>
                  <Link to="/contacto" className="btn btn-outline-info">
                    Contactar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}