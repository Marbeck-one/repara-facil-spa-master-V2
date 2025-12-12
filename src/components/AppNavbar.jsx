import React, { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { SERVICES } from "../data/mock.js";
import logoRepara from "../assets/logo_reparafacil.png";

export default function AppNavbar() {
  const { counter } = useApp();
  // 1. Extraemos los helpers de roles del contexto
  const { isAuthenticated, username, logout, isCliente, isAdmin, isTecnico } = useAuth();
  
  const [open, setOpen] = useState(false);
  const [openServicios, setOpenServicios] = useState(false);
  const navigate = useNavigate();

  const serviciosMenu = useMemo(() => SERVICES.slice(0, 6), []);

  const goServicio = (id) => {
    navigate("/servicios");
    setOpen(false);
    setOpenServicios(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
          <img
            src={logoRepara}
            alt="ReparaFácil"
            className="me-2"
            style={{ height: "45px", width: "auto" }} // Ajusté la altura para que no rompa el navbar
          />
          <span>ReparaFácil SPA</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`} id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink end to="/" className="nav-link" onClick={() => setOpen(false)}>
                Inicio
              </NavLink>
            </li>

            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link align-baseline px-0 py-2 text-white text-decoration-none"
                onClick={() => setOpenServicios((v) => !v)}
              >
                Servicios
              </button>
              <ul className={`dropdown-menu ${openServicios ? "show" : ""}`}>
                {serviciosMenu.map((s) => (
                  <li key={s.id}>
                    <button className="dropdown-item" onClick={() => goServicio(s.id)}>
                      {s.nombre}
                    </button>
                  </li>
                ))}
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <NavLink to="/servicios" className="dropdown-item" onClick={() => setOpen(false)}>
                    Ver todos los servicios
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Lógica de roles para Agenda/Garantías */}
            <li className="nav-item">
              <NavLink to="/agenda" className="nav-link" onClick={() => setOpen(false)}>
                Agenda
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/garantias" className="nav-link" onClick={() => setOpen(false)}>
                Garantías
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/tecnicos" className="nav-link" onClick={() => setOpen(false)}>
                Técnicos
              </NavLink>
            </li>

            {/* --- SECCIÓN ESPECÍFICA POR ROL --- */}
            
            {/* Solo el ADMIN ve la gestión completa de Clientes */}
            {isAdmin && (
              <li className="nav-item">
                <NavLink to="/clientes" className="nav-link" onClick={() => setOpen(false)}>
                  Gestión Clientes
                </NavLink>
              </li>
            )}

            {/* El CLIENTE ve su propio Panel */}
            {isCliente && (
              <li className="nav-item">
                <NavLink to="/dashboard/cliente" className="nav-link fw-bold text-warning" onClick={() => setOpen(false)}>
                  Mi Panel
                </NavLink>
              </li>
            )}
             
             {/* El TÉCNICO ve su Dashboard */}
            {isTecnico && (
              <li className="nav-item">
                <NavLink to="/dashboard/tecnico" className="nav-link fw-bold text-warning" onClick={() => setOpen(false)}>
                  Mi Dashboard
                </NavLink>
              </li>
            )}

            <li className="nav-item">
              <NavLink to="/contacto" className="nav-link" onClick={() => setOpen(false)}>
                Contacto
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3 text-white">
            {isAuthenticated ? (
              <>
                <span className="fw-semibold">
                  <i className="bi bi-person-circle me-1"></i>
                  {username}
                </span>
                <button onClick={handleLogout} className="btn btn-sm btn-outline-light">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button className="btn btn-sm btn-light" onClick={() => navigate("/login")}>
                Iniciar sesión
              </button>
            )}
          </div>

          {/* Contador global (Solo visible si no es técnico/admin, opcional) */}
          {!isAdmin && !isTecnico && (
            <div className="ms-3 d-flex align-items-center gap-2" data-testid="counter-badge">
              <span className="badge bg-light text-primary">{counter}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}