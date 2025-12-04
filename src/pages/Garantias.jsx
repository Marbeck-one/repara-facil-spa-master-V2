import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Modal, Button, Form } from "react-bootstrap";
import { getGarantias, createGarantia, updateGarantia, deleteGarantia } from "../api/garantiasService";
import { getServicios } from "../api/serviciosService"; 

export default function Garantias() {
  const { role, username } = useAuth(); 
  
  const [garantias, setGarantias] = useState([]);
  const [servicios, setServicios] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); 

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialForm = {
    id: null,
    servicioId: "",
    fechaFin: "",
    estado: "PENDIENTE", 
    observaciones: ""
  };
  const [formData, setFormData] = useState(initialForm);

  const isAdmin = role === 'ROLE_ADMIN' || role === 'ADMIN';
  const isTecnico = role === 'ROLE_TECNICO' || role === 'TECNICO';
  const isCliente = role === 'ROLE_CLIENTE' || role === 'CLIENTE' || (!isAdmin && !isTecnico);

  useEffect(() => {
    if (username) cargarDatos();
  }, [role, username]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [allGarantias, allServicios] = await Promise.all([
        getGarantias(),
        getServicios()
      ]);

      const emailUsuario = username ? username.trim().toLowerCase() : "";
      let filteredGarantias = [];
      
      if (isAdmin) {
        filteredGarantias = allGarantias;
      } else if (isTecnico) {
        filteredGarantias = allGarantias.filter(g => 
          g.servicio?.tecnico?.email && g.servicio.tecnico.email.trim().toLowerCase() === emailUsuario
        );
      } else {
        filteredGarantias = allGarantias.filter(g => 
          g.servicio?.cliente?.email && g.servicio.cliente.email.trim().toLowerCase() === emailUsuario
        );
      }
      setGarantias(filteredGarantias);

      if (isCliente) {
          const misServicios = allServicios.filter(s => 
            s.cliente?.email && s.cliente.email.trim().toLowerCase() === emailUsuario
          );
          setServicios(misServicios);
      } else {
          setServicios(allServicios);
      }

    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularFechaLimite = (fechaInicio) => {
    if (!fechaInicio) return "---";
    const fecha = new Date(fechaInicio);
    fecha.setDate(fecha.getDate() + 30);
    return fecha.toLocaleDateString();
  };

  const handleSave = async () => {
    if (!formData.servicioId && !isEditing) {
      alert("Selecciona un servicio.");
      return;
    }
    setSaving(true);
    try {
      const formatDate = (d) => d.toISOString().split('T')[0];
      const hoy = new Date();
      const hoyStr = formatDate(hoy);

      if (isEditing) {
        await updateGarantia(formData.id, {
            id: formData.id,
            estado: formData.estado,
            detalles: formData.observaciones,
            fechaInicio: hoyStr, // Mantenemos fecha requerida por backend
            fechaFin: formData.fechaFin ? formData.fechaFin : hoyStr
        });
        alert("Actualizado correctamente.");
      } else {
        const finGarantia = new Date();
        finGarantia.setDate(hoy.getDate() + 90);

        const payload = {
            servicio: { id: parseInt(formData.servicioId) },
            fechaInicio: hoyStr,
            fechaFin: formatDate(finGarantia),
            detalles: formData.observaciones || "Solicitud iniciada por cliente",
            estado: "PENDIENTE"
        };
        await createGarantia(payload);
        alert("Solicitud enviada. Tienes respuesta en máx 30 días.");
      }
      cargarDatos();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (g) => {
      setIsEditing(true);
      setFormData({
          id: g.id,
          servicioId: g.servicio?.id,
          fechaFin: g.fechaFin,
          estado: g.estado,
          observaciones: g.detalles
      });
      setShowModal(true);
  };

  const handleDelete = async (id) => {
      if(window.confirm("¿Borrar esta garantía?")) {
          await deleteGarantia(id);
          cargarDatos();
      }
  };

  const getBadge = (estado) => {
      const colors = { PENDIENTE: 'warning', APROBADA: 'success', RECHAZADA: 'danger', FINALIZADA: 'secondary' };
      return <span className={`badge bg-${colors[estado] || 'primary'}`}>{estado}</span>;
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 className="text-primary fw-bold">Garantías</h2>
            <p className="text-muted mb-0">Consulta y gestión de garantías de servicios.</p>
        </div>
        <div className="d-flex gap-2">
            <div className="btn-group">
                <button className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewMode('grid')}>
                    <i className="bi bi-grid-fill"></i>
                </button>
                <button className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewMode('list')}>
                    <i className="bi bi-list-ul"></i>
                </button>
            </div>
            {!isTecnico && (
                <Button variant="success" onClick={() => { setIsEditing(false); setShowModal(true); }}>
                    <i className="bi bi-plus-lg me-2"></i> Solicitar
                </Button>
            )}
        </div>
      </div>

      {garantias.length === 0 ? (
        <div className="alert alert-info text-center">No hay garantías registradas.</div>
      ) : (
        <>
            {/* --- VISTA GRID --- */}
            {viewMode === 'grid' && (
                <div className="row g-4">
                    {garantias.map(g => (
                        <div key={g.id} className="col-md-6 col-lg-4">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-header bg-white d-flex justify-content-between pt-3">
                                    {getBadge(g.estado)}
                                    <small className="text-muted">#{g.id}</small>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title mb-3">{g.servicio?.descripcionProblema || "Servicio sin nombre"}</h5>
                                    <div className="small text-secondary mb-3">
                                        {/* CORRECCIÓN: Ocultar cliente si es vista de cliente */}
                                        {!isCliente && (
                                            <div><strong>Cliente:</strong> {g.servicio?.cliente?.nombre} {g.servicio?.cliente?.apellido}</div>
                                        )}
                                        <div><strong>Técnico:</strong> {g.servicio?.tecnico ? g.servicio.tecnico.nombre : "N/A"}</div>
                                    </div>
                                    <div className="alert alert-light border small mb-0">
                                        <div className="d-flex justify-content-between">
                                            <span>Solicitado:</span>
                                            <strong>{new Date(g.fechaInicio).toLocaleDateString()}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between text-danger mt-1">
                                            <span>Respuesta Máx:</span>
                                            <strong>{calcularFechaLimite(g.fechaInicio)}</strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-white border-top-0 d-flex justify-content-end gap-2 pb-3">
                                    {(isAdmin || isTecnico) && <Button variant="outline-primary" size="sm" onClick={() => handleOpenEdit(g)}>Gestionar</Button>}
                                    {isAdmin && <Button variant="outline-danger" size="sm" onClick={() => handleDelete(g.id)}>Eliminar</Button>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- VISTA LISTA --- */}
            {viewMode === 'list' && (
                <div className="card shadow-sm border-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">ID</th>
                                    <th>Servicio / Cliente</th>
                                    <th>Solicitud</th>
                                    <th>Límite Respuesta (30d)</th>
                                    <th>Estado</th>
                                    <th className="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {garantias.map(g => (
                                    <tr key={g.id}>
                                        <td className="ps-4 fw-bold">#{g.id}</td>
                                        <td>
                                            <div className="fw-bold">{g.servicio?.descripcionProblema}</div>
                                            {!isCliente && (
                                                <small className="text-muted">{g.servicio?.cliente?.nombre} {g.servicio?.cliente?.apellido}</small>
                                            )}
                                        </td>
                                        <td>{new Date(g.fechaInicio).toLocaleDateString()}</td>
                                        <td className="text-danger fw-bold">{calcularFechaLimite(g.fechaInicio)}</td>
                                        <td>{getBadge(g.estado)}</td>
                                        <td className="text-end pe-4">
                                            {(isAdmin || isTecnico) && (
                                                <Button variant="warning" className="me-2 fw-bold" onClick={() => handleOpenEdit(g)}>
                                                    <i className="bi bi-pencil-fill"></i> Editar
                                                </Button>
                                            )}
                                            {isAdmin && (
                                                <Button variant="danger" className="fw-bold" onClick={() => handleDelete(g.id)}>
                                                    <i className="bi bi-trash-fill"></i> Eliminar
                                                </Button>
                                            )}
                                            {isCliente && <span className="text-muted small fst-italic">Ver detalle</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
      )}

      {/* Modal Crear/Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>{isEditing ? "Gestionar" : "Solicitar"} Garantía</Modal.Title></Modal.Header>
        <Modal.Body>
            <Form>
                {!isEditing && (
                    <Form.Group className="mb-3">
                        <Form.Label>Servicio</Form.Label>
                        <Form.Select value={formData.servicioId} onChange={e => setFormData({...formData, servicioId: e.target.value})}>
                            <option value="">-- Selecciona --</option>
                            {servicios.map(s => <option key={s.id} value={s.id}>#{s.id} - {s.descripcionProblema}</option>)}
                        </Form.Select>
                    </Form.Group>
                )}
                {isEditing && (
                    <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="APROBADA">APROBADA</option>
                            <option value="RECHAZADA">RECHAZADA</option>
                            <option value="FINALIZADA">FINALIZADA</option>
                        </Form.Select>
                    </Form.Group>
                )}
                <Form.Group>
                    <Form.Label>Observaciones</Form.Label>
                    <Form.Control as="textarea" rows={3} value={formData.observaciones} onChange={e => setFormData({...formData, observaciones: e.target.value})} />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
            <Button variant="primary" onClick={handleSave} disabled={saving}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}