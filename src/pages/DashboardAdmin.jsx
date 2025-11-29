// src/pages/DashboardAdmin.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/api";

export default function DashboardAdmin() {
  const { username } = useAuth();
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalTecnicos: 0,
    totalServicios: 0,
    totalGarantias: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Obtener estadísticas de cada endpoint
      const [clientes, tecnicos, servicios, garantias] = await Promise.all([
        api.get("/clientes"),
        api.get("/tecnicos"),
        api.get("/servicios"),
        api.get("/garantias")
      ]);

      setStats({
        totalClientes: clientes.data.length,
        totalTecnicos: tecnicos.data.length,
        totalServicios: servicios.data.length,
        totalGarantias: garantias.data.length
      });
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">🛠️ Panel de Administrador</h1>
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
          {/* Tarjetas de estadísticas */}
          <div className="row mb-5">
            <div className="col-md-3">
              <div className="card text-white bg-primary mb-3">
                <div className="card-body">
                  <h5 className="card-title">Clientes</h5>
                  <h2 className="display-4">{stats.totalClientes}</h2>
                  <Link to="/clientes" className="btn btn-light btn-sm mt-2">
                    Ver todos
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card text-white bg-success mb-3">
                <div className="card-body">
                  <h5 className="card-title">Técnicos</h5>
                  <h2 className="display-4">{stats.totalTecnicos}</h2>
                  <Link to="/tecnicos" className="btn btn-light btn-sm mt-2">
                    Ver todos
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card text-white bg-warning mb-3">
                <div className="card-body">
                  <h5 className="card-title">Servicios</h5>
                  <h2 className="display-4">{stats.totalServicios}</h2>
                  <Link to="/servicios" className="btn btn-light btn-sm mt-2">
                    Ver todos
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card text-white bg-info mb-3">
                <div className="card-body">
                  <h5 className="card-title">Garantías</h5>
                  <h2 className="display-4">{stats.totalGarantias}</h2>
                  <Link to="/garantias" className="btn btn-light btn-sm mt-2">
                    Ver todas
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Accesos rápidos */}
          <div className="row">
            <div className="col-12">
              <h3 className="mb-3">Acciones Rápidas</h3>
            </div>
            
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">👥 Gestión de Clientes</h5>
                  <p className="card-text">Administrar todos los clientes del sistema</p>
                  <Link to="/clientes" className="btn btn-primary">
                    Ir a Clientes
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">🔧 Gestión de Técnicos</h5>
                  <p className="card-text">Administrar técnicos y especialidades</p>
                  <Link to="/tecnicos" className="btn btn-success">
                    Ir a Técnicos
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">📅 Gestión de Agenda</h5>
                  <p className="card-text">Ver y gestionar todas las citas</p>
                  <Link to="/agenda" className="btn btn-warning">
                    Ir a Agenda
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