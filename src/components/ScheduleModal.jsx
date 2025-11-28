import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { getClientes } from "../api/clientesService"; // <-- Importamos esto
import { createServicio } from "../api/serviciosService"; // <-- Y esto

export default function ScheduleModal({ show, onClose, service, onSuccess }) {
  // Estados del formulario
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar clientes al abrir el modal
  useEffect(() => {
    if (show) {
      getClientes().then((data) => setClientes(data));
      // Pre-llenar la descripción con el nombre del servicio seleccionado
      if (service) setDescripcion(`Solicitud de: ${service.nombre}`);
    }
  }, [show, service]);

  const handleSave = async () => {
    if (!clienteId || !descripcion) {
      alert("Por favor selecciona un cliente y describe el problema.");
      return;
    }

    setLoading(true);
    try {
      // --- CONEXIÓN CON BACKEND ---
      // Enviamos el objeto tal como lo espera Java:
      // Servicio { descripcionProblema: "...", cliente: { id: 1 } }
      await createServicio({
        descripcionProblema: descripcion,
        estado: "PENDIENTE",
        cliente: { id: parseInt(clienteId) } 
      });

      alert("¡Servicio agendado exitosamente en la Base de Datos!");
      if (onSuccess) onSuccess(); // Recargar datos si es necesario
      onClose(); // Cerrar modal
    } catch (error) {
      console.error(error);
      alert("Error al guardar el servicio.");
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agendar: {service.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="g-3">
            {/* 1. SELECCIONAR CLIENTE */}
            <Col md={12}>
              <Form.Label>Seleccionar Cliente</Form.Label>
              <Form.Select 
                value={clienteId} 
                onChange={(e) => setClienteId(e.target.value)}
              >
                <option value="">-- Selecciona un cliente registrado --</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.apellido} ({c.email})
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                ¿No está en la lista? Ve a "Clientes" y regístralo primero.
              </Form.Text>
            </Col>

            {/* 2. DESCRIPCIÓN DEL PROBLEMA */}
            <Col md={12}>
              <Form.Label>Detalle del Problema</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe qué le pasa al equipo..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? "Guardando..." : "Confirmar Cita"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}