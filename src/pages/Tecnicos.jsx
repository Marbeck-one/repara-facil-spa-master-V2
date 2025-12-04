import React, { useEffect, useState } from "react";
import { getTecnicos, createTecnico, updateTecnico, deleteTecnico } from "../api/tecnicosService.js";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

export default function Tecnicos() {
  const { user } = useAuth(); 
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Vista (Grid por defecto) ---
  const [viewMode, setViewMode] = useState('grid'); 

  // --- Estados del Modal ---
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  const initialFormState = {
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    especialidad: "General",
    foto: "",
    disponible: true
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    cargarTecnicos();
  }, []);

  const cargarTecnicos = () => {
    setLoading(true);
    getTecnicos()
      .then((data) => setTecnicos(data))
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData(initialFormState);
    setShowModal(true);
  };

  const handleOpenEdit = (tech) => {
    setEditId(tech.id);
    setFormData({
      nombre: tech.nombre,
      apellido: tech.apellido,
      email: tech.email,
      telefono: tech.telefono,
      especialidad: tech.especialidad,
      foto: tech.foto || "",
      disponible: tech.disponible
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.email || !formData.especialidad) {
      alert("Completa los campos obligatorios (*)");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...formData,
        foto: formData.foto && formData.foto.trim() !== "" ? formData.foto : null
      };
      if (editId) {
        await updateTecnico(editId, payload);
        alert("¡Actualizado correctamente!");
      } else {
        await createTecnico(payload);
        alert("¡Creado correctamente!");
      }
      cargarTecnicos();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este técnico? Irreversible.")) {
      try {
        await deleteTecnico(id);
        cargarTecnicos();
      } catch (error) {
        alert("No se pudo eliminar.");
      }
    }
  };

  if (loading) return <div className="text-center py-5">Cargando...</div>;

  return (
    <section className="py-5 bg-light">
      <div className="container">
        
        {/* --- HEADER --- */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-0">Gestión de Técnicos</h2>
            <p className="text-muted small mb-0">Administra el equipo de profesionales</p>
          </div>

          <div className="d-flex gap-2">
            {/* Switch de Vistas */}
            <div className="btn-group shadow-sm" role="group">
              <button 
                type="button" 
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-white bg-white text-dark border'}`}
                onClick={() => setViewMode('grid')}
                title="Vista Cuadrícula"
              >
                <i className="bi bi-grid-fill"></i>
              </button>
              <button 
                type="button" 
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-white bg-white text-dark border'}`}
                onClick={() => setViewMode('list')}
                title="Vista Lista"
              >
                <i className="bi bi-list-ul"></i>
              </button>
            </div>

            {/* Botón Crear */}
            <Button variant="success" className="shadow-sm" onClick={handleOpenCreate}>
              <i className="bi bi-person-plus-fill me-2"></i>Nuevo
            </Button>
          </div>
        </div>

        {tecnicos.length === 0 ? (
          <div className="alert alert-info text-center py-4 shadow-sm">
            <h4>No hay técnicos registrados</h4>
            <p>Comienza creando el primero con el botón "Nuevo".</p>
          </div>
        ) : (
          <>
            {/* --- VISTA 1: GRID (Tarjetas) --- */}
            {viewMode === 'grid' && (
              <div className="row g-4">
                {tecnicos.map((t) => (
                  // Grid de 3 columnas (col-lg-4)
                  <div key={t.id} className="col-md-6 col-lg-4 d-flex align-items-stretch">
                    <div className="card w-100 shadow-sm border-0 overflow-hidden h-100">
                      
                      {/* Imagen de Cabecera */}
                      <div className="bg-light text-center py-4 border-bottom">
                        <img 
                          src={t.foto || "https://img.freepik.com/premium-vector/avatar-technician-repairman-service-worker-vector-illustration_1002563-8827.jpg"} 
                          alt="Avatar" 
                          className="rounded-circle border shadow-sm"
                          style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                      </div>

                      {/* Cuerpo de la Tarjeta */}
                      <div className="card-body text-center">
                        <h5 className="card-title fw-bold mb-1">{t.nombre} {t.apellido}</h5>
                        <span className="badge bg-info text-dark mb-3">{t.especialidad}</span>
                        
                        <div className="text-muted small mb-3">
                          <div className="mb-1"><i className="bi bi-envelope me-1"></i> {t.email}</div>
                          <div><i className="bi bi-telephone me-1"></i> {t.telefono}</div>
                        </div>

                        {t.disponible ? 
                          <span className="badge bg-success-subtle text-success border border-success px-3 rounded-pill">Disponible</span> : 
                          <span className="badge bg-secondary-subtle text-secondary border border-secondary px-3 rounded-pill">Ocupado</span>
                        }
                      </div>

                      {/* Pie con Botones */}
                      <div className="card-footer bg-white border-top-0 p-3 pt-0">
                        <div className="d-grid gap-2 d-md-flex justify-content-center">
                          <Button variant="outline-primary" size="sm" className="flex-grow-1" onClick={() => handleOpenEdit(t)}>
                            <i className="bi bi-pencil-square me-1"></i> Editar
                          </Button>
                          {/* CORREGIDO: Ahora muestra texto "Eliminar" */}
                          <Button variant="outline-danger" size="sm" className="flex-grow-1" onClick={() => handleDelete(t.id)}>
                            <i className="bi bi-trash me-1"></i> Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* --- VISTA 2: LIST (Tabla) --- */}
            {viewMode === 'list' && (
              <div className="card shadow border-0 overflow-hidden">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-secondary small text-uppercase">
                      <tr>
                        <th className="ps-4 py-3">Profesional</th>
                        <th>Especialidad</th>
                        <th>Contacto</th>
                        <th>Estado</th>
                        <th className="text-end pe-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {tecnicos.map((t) => (
                        <tr key={t.id}>
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center">
                              <img 
                                src={t.foto || "https://img.freepik.com/premium-vector/avatar-technician-repairman-service-worker-vector-illustration_1002563-8827.jpg"} 
                                alt="Avatar" 
                                className="rounded-circle me-3 border"
                                style={{ width: "40px", height: "40px", objectFit: "cover" }}
                              />
                              <div>
                                <div className="fw-bold text-dark">{t.nombre} {t.apellido}</div>
                                <div className="text-muted small" style={{fontSize: "0.8rem"}}>ID: #{t.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border fw-normal">
                              {t.especialidad}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex flex-column small">
                              <span className="text-dark">{t.email}</span>
                              <span className="text-muted">{t.telefono}</span>
                            </div>
                          </td>
                          <td>
                            {t.disponible ? 
                              <span className="badge bg-success-subtle text-success rounded-pill"><i className="bi bi-check-circle me-1"></i>Disponible</span> : 
                              <span className="badge bg-secondary-subtle text-secondary rounded-pill"><i className="bi bi-x-circle me-1"></i>Ocupado</span>
                            }
                          </td>
                          {/* CORREGIDO: Botones visibles y claros */}
                          <td className="text-end pe-4">
                            <div className="d-flex justify-content-end gap-2">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleOpenEdit(t)} 
                                title="Editar datos"
                              >
                                <i className="bi bi-pencil-square me-1"></i> Editar
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDelete(t.id)} 
                                title="Eliminar registro"
                              >
                                <i className="bi bi-trash me-1"></i> Eliminar
                              </Button>
                            </div>
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

        {/* --- MODAL UNIFICADO --- */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static" size="lg">
          <Modal.Header closeButton className="bg-light">
            <Modal.Title className="fw-bold">
              {editId ? "✏️ Editar Técnico" : "🆕 Registrar Nuevo Técnico"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label className="fw-semibold">Nombre <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} />
                </Col>
                <Col md={6}>
                  <Form.Label className="fw-semibold">Apellido</Form.Label>
                  <Form.Control type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} />
                </Col>
                <Col md={12}>
                  <Form.Label className="fw-semibold">Email (Usuario) <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="ejemplo@correo.com" />
                </Col>
                <Col md={6}>
                  <Form.Label className="fw-semibold">Teléfono</Form.Label>
                  <Form.Control type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} />
                </Col>
                <Col md={6}>
                  <Form.Label className="fw-semibold">Especialidad <span className="text-danger">*</span></Form.Label>
                  <Form.Select name="especialidad" value={formData.especialidad} onChange={handleInputChange}>
                    <option value="General">General</option>
                    <option value="Electricidad">Electricidad</option>
                    <option value="Gasfitería">Gasfitería</option>
                    <option value="Electrónica">Electrónica</option>
                    <option value="Computación">Computación</option>
                    <option value="Refrigeración">Refrigeración</option>
                    <option value="Electrodomésticos">Electrodomésticos</option>
                  </Form.Select>
                </Col>
                <Col md={12}>
                  <Form.Label className="fw-semibold">Foto de Perfil (URL)</Form.Label>
                  <Form.Control type="text" name="foto" placeholder="https://..." value={formData.foto} onChange={handleInputChange} />
                  <Form.Text className="text-muted">Pega aquí el enlace de la imagen.</Form.Text>
                </Col>
                <Col md={12} className="pt-2">
                  <div className="form-check form-switch p-3 bg-light rounded border">
                    <input 
                      className="form-check-input ms-0 me-2" 
                      type="checkbox" 
                      id="disponible-switch" 
                      checked={formData.disponible} 
                      onChange={(e) => setFormData({...formData, disponible: e.target.checked})} 
                    />
                    <label className="form-check-label fw-bold" htmlFor="disponible-switch">
                      Disponible para asignar servicios
                    </label>
                  </div>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? <><span className="spinner-border spinner-border-sm me-2"/>Guardando...</> : "Guardar Cambios"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </section>
  );
}