import React from "react";
import { useNavigate } from "react-router-dom";

export default function TechnicianCard({ tech }) {
  const navigate = useNavigate();
  if (!tech) return null;

  const irAServicios = () => {
    navigate(`/servicios?tech=${encodeURIComponent(tech.id)}&name=${encodeURIComponent(tech.nombre)}`);
  };

  return (
    <div className="col-md-4 mb-4">
      {/* Card clickeable completa */}
      <div
        className="card shadow-sm h-100 border-0 tech-card cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={irAServicios}
        onKeyDown={(e) => (e.key === "Enter" ? irAServicios() : null)}
        title={`Técnico: ${tech.nombre} — click para ver servicios`}
      >
        <div className="overflow-hidden rounded-top">
          <img
            src={tech.foto}
            className="card-img-top tech-photo"
            alt={tech.nombre}
            style={{ height: 220, objectFit: "cover" }}
          />
        </div>

        <div className="card-body text-center">
          <h5 className="card-title mb-1">{tech.nombre}</h5>
          <p className="text-muted mb-2 small">{tech.especialidad}</p>
          {tech.rating && <p className="text-warning mb-3">⭐ {tech.rating}/5</p>}

          {/* Botón explícito (mismo destino que el click a la card) */}
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => { e.stopPropagation(); irAServicios(); }}
          >
            Agendar en servicios
          </button>
        </div>
      </div>
    </div>
  );
}
