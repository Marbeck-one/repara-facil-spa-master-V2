import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  const irAServicios = (e) => {
    e.preventDefault();
    navigate("/servicios");
  };

  return (
    <section className="text-center py-5 bg-light">
      <div className="container">
        <h1 className="fw-bold text-primary mb-3">
          Bienvenido a ReparaFácil
        </h1>
        <p className="text-muted mb-4">
          Tu reparación fácil, rápida y segura 🔧
        </p>
        {/* OJO: usamos button para que el test lo reconozca y a la vez navegue */}
        <button
          className="btn btn-primary px-4 py-2"
          onClick={irAServicios}
        >
          Ver servicios
        </button>
      </div>
    </section>
  );
}
