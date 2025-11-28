import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAgenda, cancelarAgenda } from "../api/agendaService"; // Ya tenías este archivo, lo usaremos

export default function Agenda() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [params] = useSearchParams();

  const techId = params.get("tech") || "";

  // Función para cargar datos
  const cargarAgenda = async () => {
    try {
      setLoading(true);
      const res = await getAgenda(); // Esto retorna la respuesta de Axios
      const data = res.data; // Accedemos a la data real
      
      // Adaptamos la respuesta del Backend (Entities) a lo que la tabla espera ver
      const citasFormateadas = data.map(item => ({
        id: item.id,
        // Intentamos obtener datos anidados con seguridad (?. operator)
        cliente: item.servicio?.cliente ? `${item.servicio.cliente.nombre} ${item.servicio.cliente.apellido}` : "Cliente Desconocido",
        direccion: item.servicio?.cliente?.direccion || "Sin dirección",
        fecha: new Date(item.fechaHoraInicio).toLocaleString(),
        servicio: item.servicio?.descripcionProblema || "Servicio General",
        tecnico_nombre: item.tecnico ? `${item.tecnico.nombre} ${item.tecnico.apellido}` : "Sin asignar",
        tecnico_id: item.tecnico?.id,
        estado: item.estado
      }));

      setCitas(citasFormateadas);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la agenda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAgenda();
  }, []);

  const handleCancelar = async (id) => {
    if (!window.confirm("¿Seguro que deseas cancelar esta cita?")) return;
    try {
      await cancelarAgenda(id); // Asegúrate que tu agendaService tenga delete
      cargarAgenda(); // Recargar la tabla
    } catch (error) {
      alert("Error al cancelar la cita");
    }
  };

  // Filtro visual por técnico (si vienes de la pantalla anterior)
  const citasFiltradas = useMemo(() => {
    if (!techId) return citas;
    return citas.filter((c) => String(c.tecnico_id) === String(techId));
  }, [citas, techId]);

  if (loading) return <div className="text-center p-5">Cargando agenda...</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Agenda de Servicios</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      {!citas || citas.length === 0 ? (
        <div className="alert alert-warning">
          No hay citas agendadas en el sistema.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle shadow-sm">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Dirección</th>
                <th>Fecha</th>
                <th>Servicio</th>
                <th>Técnico</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.map((c, idx) => (
                <tr key={c.id}>
                  <td>{idx + 1}</td>
                  <td>{c.cliente}</td>
                  <td>{c.direccion}</td>
                  <td>{c.fecha}</td>
                  <td>{c.servicio}</td>
                  <td>{c.tecnico_nombre}</td>
                  <td>
                    <span className={`badge ${c.estado === 'DISPONIBLE' ? 'bg-success' : 'bg-secondary'}`}>
                        {c.estado}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleCancelar(c.id)}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}