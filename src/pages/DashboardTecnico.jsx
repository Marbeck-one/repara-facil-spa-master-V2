// src/pages/DashboardTecnico.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

export default function DashboardTecnico() {
  const { username } = useAuth();
  const [misServicios, setMisServicios] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMisDatos();
  }, []);

  const fetchMisDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener servicios y agenda
      // Nota: Idealmente deberías tener un endpoint /servicios/mis-servicios
      // Por ahora traemos todos y filtramos en frontend (no ideal en producción)
      const [serviciosResp, agendaResp] = await Promise.all([
        api.get("/servicios"),
        api.get("/agendas")
      ]);

      setMisServicios(serviciosResp.data);
      setAgenda(agendaResp.data);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoCompletado = async (servicioId) => {
    try {
      // Actualizar estado del servicio
      await api.put(`/servicios/${servicioId}`, {
        estado: "COMPLETADO"
      });
      
      alert("Servicio marcado como completado");
      fetchMisDatos(); // Recargar datos
    } catch (error) {
      console.error("Error actualizando servicio:", error);
      alert("Error al actualizar el servicio");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">🔧 Panel de Técnico</h1>
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
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <h5 className="card-title">Servicios Pendientes</h5>
                  <h2 className="display-4">
                    {misServicios.filter(s => s.estado === "PENDIENTE").length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">En Progreso</h5>
                  <h2 className="display-4">
                    {misServicios.filter(s => s.estado === "EN_PROGRESO").length}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Completados Hoy</h5>
                  <h2 className="display-4">
                    {misServicios.filter(s => s.estado === "COMPLETADO").length}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Mis servicios asignados */}
          <div className="row">
            <div className="col-12">
              <h3 className="mb-3">📋 Mis Servicios Asignados</h3>
              
              {misServicios.length === 0 ? (
                <div className="alert alert-info">
                  No tienes servicios asignados actualmente
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Fecha Solicitud</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misServicios.map((servicio) => (
                        <tr key={servicio.id}>
                          <td>{servicio.id}</td>
                          <td>{servicio.cliente?.nombre} {servicio.cliente?.apellido}</td>
                          <td>{servicio.descripcionProblema}</td>
                          <td>
                            <span className={`badge ${
                              servicio.estado === "COMPLETADO" ? "bg-success" :
                              servicio.estado === "EN_PROGRESO" ? "bg-primary" :
                              "bg-warning"
                            }`}>
                              {servicio.estado}
                            </span>
                          </td>
                          <td>{new Date(servicio.fechaSolicitud).toLocaleDateString()}</td>
                          <td>
                            {servicio.estado !== "COMPLETADO" && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => marcarComoCompletado(servicio.id)}
                              >
                                ✅ Completar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Mi agenda del día */}
          <div className="row mt-5">
            <div className="col-12">
              <h3 className="mb-3">📅 Mi Agenda de Hoy</h3>
              
              {agenda.length === 0 ? (
                <div className="alert alert-info">
                  No tienes citas programadas para hoy
                </div>
              ) : (
                <div className="row">
                  {agenda.map((cita) => (
                    <div key={cita.id} className="col-md-6 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">
                            {new Date(cita.fechaHora).toLocaleTimeString('es-CL', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </h5>
                          <p className="card-text">
                            <strong>Servicio:</strong> {cita.servicio?.descripcionProblema}<br />
                            <strong>Estado:</strong> {cita.estado}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}