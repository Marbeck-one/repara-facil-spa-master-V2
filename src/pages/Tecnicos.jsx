import React, { useEffect, useState } from "react";
import TechnicianCard from "../components/TechnicianCard.jsx";
import { getTecnicos } from "../api/tecnicosService.js";

export default function Tecnicos() {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTecnicos()
      .then((data) => {
        // Mapeamos los datos del backend para que coincidan con el componente visual
        const adaptados = data.map((t) => ({
          id: t.id,
          nombre: `${t.nombre} ${t.apellido}`,
          especialidad: t.especialidad,
          rating: 5.0, // Valor por defecto
          // Usamos una imagen genérica si no hay foto
          foto: "https://img.freepik.com/premium-vector/avatar-technician-repairman-service-worker-vector-illustration_1002563-8827.jpg"
        }));
        setTecnicos(adaptados);
      })
      .catch((err) => console.error("Error cargando técnicos:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-5">Cargando técnicos...</div>;
  }

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="mb-4">
          <h2 className="fw-bold text-primary mb-1">
            Nuestros técnicos certificados
          </h2>
          <p className="text-muted mb-0">
            Elige al profesional que necesitas para tu servicio.
          </p>
        </div>

        {tecnicos.length === 0 ? (
          <div className="alert alert-info">
            No hay técnicos registrados en la base de datos aún.
          </div>
        ) : (
          <div className="row g-4">
            {tecnicos.map((t) => (
              <TechnicianCard key={t.id} tech={t} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}