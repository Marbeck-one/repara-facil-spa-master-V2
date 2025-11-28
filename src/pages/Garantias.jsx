import React, { useState } from "react";
import { getGarantiaById } from "../api/garantiasService"; // <--- Importante

export default function Garantias() {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const consultar = async (e) => {
    e.preventDefault();
    if (!codigo) return;

    setLoading(true);
    setResultado(null);
    setError("");

    try {
      // LLAMADA REAL A LA API
      const data = await getGarantiaById(codigo);
      
      const hoy = new Date();
      const fin = new Date(data.fechaFin);
      const diasRestantes = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
      const esVigente = diasRestantes >= 0;

      setResultado({
        estado: esVigente ? "Vigente" : "Vencida",
        dias: diasRestantes > 0 ? diasRestantes : 0,
        detalles: data.detalles,
        servicio: data.servicio ? data.servicio.descripcionProblema : "Servicio General"
      });

    } catch (err) {
      console.error(err);
      setError("No encontramos ninguna garantía con ese código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-primary fw-bold">Consulta de Garantías</h2>
      <div className="card shadow-sm p-4 border-0" style={{ maxWidth: "600px" }}>
        <form onSubmit={consultar} className="row g-2 mb-3">
          <div className="col-md-8">
            <input
              className="form-control"
              placeholder="Ingresa ID (ej: 1)"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              type="number"
            />
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Buscando..." : "Consultar"}
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {resultado && (
          <div className={`alert ${resultado.estado === "Vigente" ? "alert-success" : "alert-secondary"} mt-3`}>
            <h4 className="fw-bold">Garantía {resultado.estado}</h4>
            <p className="mb-1">Servicio: {resultado.servicio}</p>
            <p className="mb-0">Días restantes: {resultado.dias}</p>
          </div>
        )}
      </div>
    </div>
  );
}