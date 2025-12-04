import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { getClientes } from "../api/clientesService";
import { getTecnicos } from "../api/tecnicosService";
import { createServicio } from "../api/serviciosService";
import { createAgenda } from "../api/agendaService"; // <--- Importamos servicio de Agenda
import { useAuth } from "../context/AuthContext";

export default function ScheduleModal({ show, onClose, service, onSuccess }) {
  const { username, role } = useAuth();
  
  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  
  const [clienteId, setClienteId] = useState("");
  const [tecnicoId, setTecnicoId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState(""); // Nuevo estado para la fecha
  const [loading, setLoading] = useState(false);

  const esCliente = role === "CLIENTE" || role === "ROLE_CLIENTE";

  useEffect(() => {
    if (show) {
      // Pre-llenar descripción si viene un servicio seleccionado
      if (service) setDescripcion(`Solicitud de: ${service.nombre}`);
      setFechaInicio(""); // Limpiar fecha al abrir

      // Cargar datos necesarios
      getClientes().then((data) => {
        setClientes(data);
        if (esCliente) {
          // Auto-seleccionar al usuario logueado
          const miPerfil = data.find(c => c.email?.trim().toLowerCase() === username?.trim().toLowerCase());
          if (miPerfil) setClienteId(miPerfil.id);
        }
      }).catch(console.error);

      getTecnicos().then((data) => {
        setTecnicos(data.filter(t => t.disponible)); 
      }).catch(console.error);
    }
  }, [show, service, username, esCliente]);

  const handleSave = async () => {
    if (!clienteId || !descripcion) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      // LÓGICA DUAL:
      // 1. Si eligió FECHA -> Creamos AGENDA (Cita confirmada)
      // 2. Si NO eligió FECHA -> Creamos SERVICIO (Solicitud pendiente)
      
      if (fechaInicio) {
        // --- CREAR AGENDA ---
        const fechaInicioISO = new Date(fechaInicio).toISOString();
        const fechaFinDate = new Date(fechaInicio);
        fechaFinDate.setHours(fechaFinDate.getHours() + 2); // Duración por defecto 2hrs

        const payloadAgenda = {
            fechaHoraInicio: fechaInicioISO,
            fechaHoraFin: fechaFinDate.toISOString(),
            estado: "RESERVADO",
            tecnico: tecnicoId ? { id: parseInt(tecnicoId) } : null,
            servicio: {
                descripcionProblema: descripcion,
                estado: "ASIGNADO", // Nace asignado porque tiene fecha
                cliente: { id: parseInt(clienteId) },
                tecnico: tecnicoId ? { id: parseInt(tecnicoId) } : null
            }
        };
        
        await createAgenda(payloadAgenda);
        alert("¡Cita agendada exitosamente!");

      } else {
        // --- CREAR SOLICITUD DE SERVICIO ---
        const payloadServicio = {
            descripcionProblema: descripcion,
            estado: "PENDIENTE",
            cliente: { id: parseInt(clienteId) },
            tecnico: tecnicoId ? { id: parseInt(tecnicoId) } : null
        };
        
        await createServicio(payloadServicio);
        alert("¡Solicitud enviada! Un técnico te contactará para coordinar.");
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error. Verifica que el Backend esté corriendo y actualizado.");
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Agendar: {service.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form>
          <Row className="g-3">
            
            {/* Cliente (Solo si es admin/técnico) */}
            {!esCliente && (
              <Col md={12}>
                <Form.Label className="fw-bold">Cliente</Form.Label>
                <Form.Select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                  <option value="">-- Selecciona --</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
                  ))}
                </Form.Select>
              </Col>
            )}

            {/* Problema */}
            <Col md={12}>
              <Form.Label className="fw-bold">Detalle del Problema</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)} 
              />
            </Col>

            {/* SECCIÓN DE FECHA (OPCIONAL) */}
            <Col md={12}>
                <div className="p-3 bg-light rounded border mt-2">
                    <h6 className="text-primary fw-bold mb-3">
                        <i className="bi bi-calendar-check me-2"></i>¿Cuándo lo necesitas?
                    </h6>
                    <Row>
                        <Col md={6}>
                            <Form.Label className="small fw-bold">Fecha y Hora</Form.Label>
                            <Form.Control 
                                type="datetime-local" 
                                value={fechaInicio} 
                                onChange={(e) => setFechaInicio(e.target.value)} 
                            />
                            <Form.Text className="text-muted" style={{fontSize:"0.75rem"}}>
                                Si lo dejas vacío, quedará como solicitud pendiente.
                            </Form.Text>
                        </Col>
                        <Col md={6}>
                            <Form.Label className="small fw-bold">Técnico Preferido</Form.Label>
                            <Form.Select value={tecnicoId} onChange={(e) => setTecnicoId(e.target.value)}>
                                <option value="">-- Cualquiera --</option>
                                {tecnicos.map((t) => (
                                <option key={t.id} value={t.id}>{t.nombre} {t.apellido}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                </div>
            </Col>

          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button variant="success" onClick={handleSave} disabled={loading}>
          {loading ? "Procesando..." : (fechaInicio ? "Confirmar Cita" : "Enviar Solicitud")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}