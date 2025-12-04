import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import heroImage from "../assets/tecnico_electrodomestico.png";
import { getTecnicos } from "../api/tecnicosService";
import { getServicios } from "../api/serviciosService";

export default function Home() {
  const navigate = useNavigate();
  
  // Estados para datos reales
  const [tecnicos, setTecnicos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatosPublicos();
  }, []);

  const cargarDatosPublicos = async () => {
    try {
      // Cargamos datos del backend
      const [techRes, servRes] = await Promise.all([
        getTecnicos(),
        getServicios()
      ]);

      // Tomamos solo los primeros 3 para mostrar en el inicio
      setTecnicos(techRes.slice(0, 3));
      
      // Si la API de servicios devuelve un array directo, lo usamos. 
      // Si devuelve un objeto con .data, lo ajustamos (tu api/servicios parece devolver array directo).
      const listaServicios = Array.isArray(servRes) ? servRes : servRes.data || [];
      setServicios(listaServicios.slice(0, 3));

    } catch (error) {
      console.error("Error cargando home:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section d-flex align-items-center">
        <div className="container-fluid px-4 px-lg-5 hero-inner">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 hero-text re-fade-up">
              <p className="badge bg-light text-primary mb-3 rounded-pill px-3 py-2">
                <i className="bi bi-wrench-adjustable me-2"></i>
                Servicio técnico experto
              </p>
              <h1 className="display-4 fw-bold text-white mb-3">
                Expertos en reparaciones <br/>
                <span className="text-warning">al instante.</span>
              </h1>
              <p className="lead text-white-50 mb-4">
                Conectamos a los mejores técnicos certificados con tus necesidades del hogar. 
                Rápido, seguro y garantizado.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <button
                  className="btn btn-primary btn-lg shadow-lg px-4"
                  onClick={() => navigate("/agenda")}
                >
                  Agendar Visita
                </button>
                <button
                  className="btn btn-outline-light btn-lg px-4"
                  onClick={() => navigate("/servicios")}
                >
                  Ver Servicios
                </button>
              </div>
            </div>

            <div className="col-lg-6 hero-image-wrapper re-float d-none d-lg-block">
              <div className="hero-image-card rounded-4 overflow-hidden shadow-lg" style={{maxWidth: '600px'}}>
                <img
                  src={heroImage}
                  alt="Técnico Profesional"
                  className="img-fluid w-100"
                  style={{objectFit: 'cover', height: '100%'}}
                />
                <div className="hero-badge shadow bg-white text-dark p-3 rounded-3 position-absolute bottom-0 start-0 m-4 d-flex align-items-center gap-3">
                  <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                    <i className="bi bi-shield-check fs-4"></i>
                  </div>
                  <div style={{lineHeight: '1.2'}}>
                    <div className="fw-bold">Garantía Total</div>
                    <small className="text-muted">En todos los trabajos</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FRANJA DE CONFIANZA */}
      <section className="trust-strip py-5 bg-white border-bottom">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="p-3">
                <i className="bi bi-credit-card-2-front display-6 text-primary mb-3 d-block"></i>
                <h5 className="fw-bold">Pago Seguro</h5>
                <p className="text-muted small">Transacciones protegidas y transparentes.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <i className="bi bi-geo-alt display-6 text-primary mb-3 d-block"></i>
                <h5 className="fw-bold">Cobertura Total</h5>
                <p className="text-muted small">Llegamos a todas las comunas de la región.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <i className="bi bi-clock-history display-6 text-primary mb-3 d-block"></i>
                <h5 className="fw-bold">Atención Rápida</h5>
                <p className="text-muted small">Agenda en minutos, recibe ayuda hoy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS DESTACADOS (REALES) */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="fw-bold mb-1">Nuestros Servicios</h2>
              <p className="text-muted mb-0">Soluciones profesionales para tu hogar</p>
            </div>
            <Link to="/servicios" className="btn btn-outline-primary btn-sm">Ver todos</Link>
          </div>

          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : (
            <div className="row g-4">
              {servicios.length > 0 ? servicios.map((s) => (
                <div className="col-md-4" key={s.id}>
                  <div className="card h-100 border-0 shadow-sm hover-card">
                    <div className="card-body p-4">
                      <div className="mb-3 text-primary">
                        <i className="bi bi-tools fs-2"></i>
                      </div>
                      <h5 className="card-title fw-bold">{s.descripcionProblema}</h5>
                      <p className="card-text text-muted small">
                        Servicio profesional garantizado. Diagnóstico y reparación incluidos.
                      </p>
                      <span className="badge bg-light text-dark border mt-2">{s.estado}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-12 text-center text-muted">No hay servicios destacados por el momento.</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* TÉCNICOS DESTACADOS (REALES) */}
      <section className="py-5 section-dark bg-dark text-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Conoce a nuestros expertos</h2>
            <p className="text-white-50">Profesionales certificados listos para ayudarte</p>
          </div>

          <div className="row g-4">
            {tecnicos.length > 0 ? tecnicos.map((t) => (
              <div className="col-md-4" key={t.id}>
                <div className="card h-100 border-0 bg-secondary bg-opacity-10 text-white">
                  <div className="card-body text-center p-4">
                    <img 
                      src={t.foto || "https://via.placeholder.com/100"} 
                      alt={t.nombre}
                      className="rounded-circle mb-3 border border-3 border-primary"
                      style={{width: '100px', height: '100px', objectFit: 'cover'}}
                      onError={(e) => e.target.src = "https://via.placeholder.com/100"}
                    />
                    <h5 className="fw-bold mb-1">{t.nombre} {t.apellido}</h5>
                    <p className="text-info small mb-2">{t.especialidad}</p>
                    <div className="d-flex justify-content-center gap-1 text-warning small mb-3">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-half"></i>
                    </div>
                    <button className="btn btn-sm btn-light w-100" onClick={() => navigate(`/agenda?tech=${t.id}`)}>
                      Contratar
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-12 text-center text-white-50">Pronto se unirán nuevos técnicos.</div>
            )}
          </div>
          
          <div className="text-center mt-5">
             <Link to="/tecnicos" className="btn btn-outline-light px-4 rounded-pill">Ver todo el equipo</Link>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-5 bg-primary text-white text-center">
        <div className="container">
          <h2 className="fw-bold mb-3">¿Listo para solucionar tu problema?</h2>
          <p className="lead mb-4 text-white-50">No dejes que una avería arruine tu día. Agenda ahora mismo.</p>
          <button className="btn btn-light btn-lg px-5 rounded-pill fw-bold" onClick={() => navigate("/agenda")}>
            Agendar Cita Ahora
          </button>
        </div>
      </section>
    </div>
  );
}