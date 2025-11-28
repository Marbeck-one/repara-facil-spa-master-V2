import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import heroImage from "../assets/tecnico_electrodomestico.png"; // se mantiene

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* HERO FULL WIDTH */}
      <section className="hero-section d-flex align-items-center">
        <div className="container-fluid px-4 px-lg-5 hero-inner">
          <div className="row align-items-center">
            {/* Texto */}
            <div className="col-lg-6 mb-4 mb-lg-0 hero-text re-fade-up">
              <p className="badge bg-light text-primary mb-3">
                🔧 Servicio técnico a domicilio
              </p>
              <h1 className="display-5 fw-bold text-white mb-3">
                ReparaFácil SPA
              </h1>
              <p className="lead text-white-50 mb-4">
                Reparamos tus electrodomésticos y servicios del hogar de forma
                rápida, segura y sin salir de tu casa. Agenda en línea y un
                técnico certificado irá a tu domicilio.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/agenda" className="btn btn-warning btn-lg">
                  Ver tu agenda
                </Link>
                {/* Botón (no link) para que el test lo detecte por role="button" */}
                <button
                  type="button"
                  className="btn btn-outline-light btn-lg"
                  onClick={() => navigate("/servicios")}
                >
                  Ver servicios
                </button>
              </div>
              <div className="d-flex gap-4 mt-4 text-white-50 small">
                <div>
                  <span className="fw-semibold text-white">+5000</span>
                  <br />
                  servicios realizados
                </div>
                <div>
                  <span className="fw-semibold text-white">24/7</span>
                  <br />
                  atención online
                </div>
                <div>
                  <span className="fw-semibold text-white">Garantía</span>
                  <br />
                  en todas las reparaciones
                </div>
              </div>
            </div>

            {/* Imagen hero */}
            <div className="col-lg-6 hero-image-wrapper re-float">
              <div className="hero-image-card">
                <img
                  src={heroImage}
                  alt="Técnico reparando electrodoméstico"
                  className="hero-main-image img-fluid"
                />
                <div className="hero-badge shadow">
                  <span className="hero-badge-icon">⭐</span>
                  <div>
                    <div className="small text-white-50">Clientes felices</div>
                    <div className="fw-semibold text-white">4.8 / 5.0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FRANJA DE CONFIANZA */}
      <section className="trust-strip py-4">
        <div className="container">
          <div className="row text-center text-md-start">
            <div className="col-md-4 mb-3 mb-md-0 re-fade-up re-delay-1">
              <h6 className="mb-1 fw-semibold">
                💳 Pago seguro y garantizado
              </h6>
              <p className="mb-0 text-muted small">
                Transferencia, tarjeta o efectivo al finalizar el servicio.
              </p>
            </div>
            <div className="col-md-4 mb-3 mb-md-0 re-fade-up re-delay-2">
              <h6 className="mb-1 fw-semibold">📍 Cobertura por comunas</h6>
              <p className="mb-0 text-muted small">
                Técnicos en distintas zonas para llegar más rápido a tu hogar.
              </p>
            </div>
            <div className="col-md-4 re-fade-up re-delay-3">
              <h6 className="mb-1 fw-semibold">🕒 Agenda en minutos</h6>
              <p className="mb-0 text-muted small">
                Elige día y horario según tu disponibilidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS DESTACADOS */}
      <section className="py-5 section-light">
        <div className="container">
          <div className="text-center mb-4 re-fade-up">
            <h2 className="fw-bold mb-2">Servicios que ofrecemos</h2>
            <p className="text-muted">
              Especialistas en reparaciones del hogar y electrodomésticos.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: "⚡",
                titulo: "Electricidad domiciliaria",
                texto:
                  "Instalaciones, enchufes, diferenciales, cortocircuitos y más.",
              },
              {
                icon: "🔥",
                titulo: "Gasfitería y calefont",
                texto:
                  "Revisión de fugas, cambio de llaves, mantención de calefont.",
              },
              {
                icon: "🧺",
                titulo: "Línea blanca",
                texto:
                  "Lavadoras, refrigeradores, secadoras y otros electrodomésticos.",
              },
            ].map((s, i) => (
              <div
                className="col-md-4 re-fade-up"
                key={s.titulo}
                style={{ animationDelay: `${0.1 * (i + 1)}s` }}
              >
                <div className="service-card h-100 p-4 rounded-4 shadow-sm">
                  <div className="service-icon mb-3">{s.icon}</div>
                  <h5 className="fw-semibold mb-2">{s.titulo}</h5>
                  <p className="text-muted small mb-3">{s.texto}</p>
                  <Link to="/servicios" className="small text-primary">
                    Ver más detalles →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉCNICOS DESTACADOS (para el test del title="Técnico: ...") */}
      <section className="py-5 section-light">
        <div className="container">
          <div className="text-center mb-4 re-fade-up">
            <h2 className="fw-bold mb-2">Técnicos destacados</h2>
            <p className="text-muted">
              Conoce algunos de los profesionales que trabajan con nosotros.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                nombre: "Juan Pérez",
                especialidad: "Electricidad domiciliaria",
              },
              {
                nombre: "María González",
                especialidad: "Reparación de línea blanca",
              },
              {
                nombre: "Carlos López",
                especialidad: "Gasfitería y calefont",
              },
            ].map((tec) => (
              <div className="col-md-4" key={tec.nombre}>
                <div
                  className="card h-100 shadow-sm"
                  title={`Técnico: ${tec.nombre}`}
                >
                  <div className="card-body">
                    <h5 className="card-title">{tec.nombre}</h5>
                    <p className="card-text text-muted small">
                      {tec.especialidad}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-5 section-dark text-white">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 re-fade-up">
              <h2 className="fw-bold mb-3">¿Cómo funciona ReparaFácil?</h2>
              <p className="text-white-50 mb-4">
                Agenda tu servicio en minutos y deja que nuestro equipo se
                encargue del resto.
              </p>

              <ol className="timeline list-unstyled">
                <li className="timeline-step">
                  <span className="bullet">1</span>
                  <div className="step-text">
                    <h6 className="mb-1">Elige el servicio</h6>
                    <p className="text-white-50 small mb-0">
                      Selecciona el tipo de reparación que necesitas desde la
                      web.
                    </p>
                  </div>
                </li>
                <li className="timeline-step">
                  <span className="bullet">2</span>
                  <div className="step-text">
                    <h6 className="mb-1">Agenda fecha y hora</h6>
                    <p className="text-white-50 small mb-0">
                      Indica tu comuna, franja horaria y datos de contacto.
                    </p>
                  </div>
                </li>
                <li className="timeline-step">
                  <span className="bullet">3</span>
                  <div className="step-text">
                    <h6 className="mb-1">Recibe al técnico</h6>
                    <p className="text-white-50 small mb-0">
                      Un técnico certificado te visitará para diagnosticar y
                      reparar.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {/* CTA siempre visible (sin usar useApp para no romper los tests) */}
            <div className="col-lg-6 re-fade-up re-delay-2">
              <div className="cta-box p-4 rounded-4">
                <h5 className="fw-semibold mb-2">¿Listo para agendar?</h5>
                <p className="text-white-50 mb-3">
                  Crea tu cuenta, agenda tu visita y realiza seguimiento desde
                  la misma plataforma.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <button
                    className="btn btn-light"
                    onClick={() => navigate("/register")}
                  >
                    Crear cuenta
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => navigate("/login")}
                  >
                    Ya tengo cuenta
                  </button>
                </div>
                <p className="small text-white-50 mt-3 mb-0">
                  Atención de lunes a sábado, en horario extendido.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
