import React from 'react';
export default function Testimonials() {
  const testimonios = [
    {
      cliente: "Ana Contreras",
      texto: "Excelente servicio, el técnico fue puntual y dejó mi lavadora como nueva.",
      rating: 5
    },
    {
      cliente: "Luis Martínez",
      texto: "Repararon mi refrigerador el mismo día. 100% recomendados.",
      rating: 4
    },
    {
      cliente: "Fernanda Rojas",
      texto: "Fácil de agendar y muy confiables. Volvería a usar el servicio.",
      rating: 5
    }
  ];

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <h2 className="text-center mb-4 text-primary">Opiniones de nuestros clientes 💬</h2>
        <div className="row">
          {testimonios.map((t, i) => (
            <div className="col-md-4 mb-4" key={i}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <p className="fst-italic">“{t.texto}”</p>
                  <p className="text-warning">{"⭐".repeat(t.rating)}</p>
                  <p className="fw-bold mb-0">{t.cliente}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
