import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { SERVICES } from "../data/mock.js";
import ServiceCard from "../components/ServiceCard.jsx";

export default function Servicios() {
  const { servicios } = useApp();
  const [params] = useSearchParams();

  // Catálogo: usa el central de mock si el contexto viene vacío
  const lista = servicios?.length ? servicios : SERVICES;

  // Técnico preseleccionado desde /tecnicos
  const techId = params.get("tech") || "";
  const techName = params.get("name") || "";

  // -------- Filtros básicos (buscador + categoría) --------
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("todas");

  const categorias = useMemo(() => {
    const set = new Set(lista.map((s) => s.categoria).filter(Boolean));
    return ["todas", ...Array.from(set)];
  }, [lista]);

  const filtrados = useMemo(() => {
    const t = texto.trim().toLowerCase();
    const c = categoria;
    return lista.filter((s) => {
      const coincideTexto =
        !t ||
        s.nombre?.toLowerCase().includes(t) ||
        s.descripcion?.toLowerCase().includes(t);
      const coincideCategoria = c === "todas" || s.categoria === c;
      return coincideTexto && coincideCategoria;
    });
  }, [lista, texto, categoria]);

  return (
    <div className="container">
      <h2 className="mb-3 text-primary">Servicios</h2>

      {/* Banner si viene un técnico preseleccionado */}
      {techName ? (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
          <div>
            <strong>Técnico preseleccionado:</strong> {techName}
            {techId ? <span className="text-muted"> (ID: {techId})</span> : null}
          </div>
          <span className="small text-muted">El servicio quedará asociado a este técnico al agendar.</span>
        </div>
      ) : null}

      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="Buscar por nombre o descripción..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-3">
        {filtrados.length ? (
          filtrados.map((s) => (
            <div key={s.id} className="col-md-6 col-lg-4">
              {/* Pasamos el técnico seleccionado como props al ServiceCard */}
              <ServiceCard service={s} preselectedTech={{ id: techId, name: techName }} />
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-warning mb-0">
              No encontramos servicios con esos filtros.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
