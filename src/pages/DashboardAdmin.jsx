import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // Importamos useNavigate
import api from "../api/api";
import { createTecnico, deleteTecnico, updateTecnico, getTecnicos } from "../api/tecnicosService"; 
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function DashboardAdmin() {
  const { username } = useAuth();
  const navigate = useNavigate(); // Hook para navegación
  
  // --- ESTADÍSTICAS ---
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalTecnicos: 0,
    totalServicios: 0,
    totalGarantias: 0
  });

  // --- GESTIÓN TÉCNICOS ---
  const [tecnicosLista, setTecnicosLista] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  // Estados de UI y Modal
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  // Formulario
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
    cargarDatosGenerales();
  }, []);

  const cargarDatosGenerales = async () => {
    try {
      setLoading(true);
      
      const [clientesResp, listaTecnicos, serviciosResp, garantiasResp] = await Promise.all([
        api.get("/clientes"),
        getTecnicos(), 
        api.get("/servicios"),
        api.get("/garantias")
      ]);

      setStats({
        totalClientes: clientesResp.data.length,
        totalTecnicos: listaTecnicos.length,
        totalServicios: serviciosResp.data.length,
        totalGarantias: garantiasResp.data.length
      });

      setTecnicosLista(listaTecnicos);

    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- ABRIR MODAL (CREAR/EDITAR) ---
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

  // --- GUARDAR ---
  const handleSave = async () => {
    if (!formData.nombre || !formData.email || !formData.especialidad) {
      alert("Por favor completa los campos obligatorios (*)");
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
        alert("¡Técnico actualizado!");
      } else {
        await createTecnico(payload);
        alert("¡Técnico creado!");
      }
      
      await cargarDatosGenerales(); 
      setShowModal(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar. Verifica los datos.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este técnico?")) {
      try {
        await deleteTecnico(id);
        await cargarDatosGenerales();
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudo eliminar.");
      }
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: "80vh"}}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );

  return (
    <div className="container mt-5 mb-5">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold text-dark">🛠️ Panel de Administrador</h1>
          <p className="text-muted mb-0">Bienvenido, <strong>{username}</strong></p>
        </div>
        
        <div className="d-flex gap-2">
           {/* Botones Vista */}
           <div className="btn-group shadow-sm" role="group">
              <button className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-white bg-white text-dark border'}`} onClick={() => setViewMode('grid')}><i className="bi bi-grid-fill"></i></button>
              <button className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-white bg-white text-dark border'}`} onClick={() => setViewMode('list')}><i className="bi bi-list-ul"></i></button>
            </div>
            {/* Botón Crear */}
            <Button variant="success" size="lg" className="shadow-sm" onClick={handleOpenCreate}>
              <i className="bi bi-person-plus-fill me-2"></i>Nuevo Técnico
            </Button>
        </div>
      </div>

      {/* --- SECCIÓN 1: ESTADÍSTICAS CLICABLES --- */}
      <div className="row mb-5 g-3">
        {[
            { title: "Clientes", count: stats.totalClientes, color: "primary", icon: "bi-people", link: "/clientes" },
            { title: "Técnicos", count: stats.totalTecnicos, color: "success", icon: "bi-tools", link: "/tecnicos" },
            { title: "Servicios", count: stats.totalServicios, color: "warning", icon: "bi-clipboard-check", link: "/servicios" },
            { title: "Garantías", count: stats.totalGarantias, color: "info", icon: "bi-shield-check", link: "/garantias" }
        ].map((stat, idx) => (
            <div key={idx} className="col-md-3">
                <div 
                  className={`card text-white bg-${stat.color} shadow-sm h-100 border-0`}
                  style={{ cursor: "pointer", transition: "transform 0.2s ease" }}
                  onClick={() => navigate(stat.link)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  title={`Ir a ${stat.title}`}
                >
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="card-title mb-1 text-uppercase small opacity-75">{stat.title}</h6>
                            <h2 className="display-5 fw-bold mb-0">{stat.count}</h2>
                        </div>
                        <i className={`bi ${stat.icon} display-6 opacity-50`}></i>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* --- SECCIÓN 2: GESTIÓN DE TÉCNICOS --- */}
      <h4 className="mb-3 fw-bold text-secondary">Gestión de Personal</h4>
      
      {tecnicosLista.length === 0 ? (
         <div className="alert alert-info text-center py-5 shadow-sm">No hay técnicos registrados.</div>
      ) : (
        <>
          {/* VISTA GRID */}
          {viewMode === 'grid' && (
            <div className="row g-4">
              {tecnicosLista.map((tech) => (
                <div key={tech.id} className="col-md-6 col-lg-4 d-flex align-items-stretch">
                  <div className="card w-100 shadow-sm border-0 h-100">
                    <div className="bg-light text-center py-3 border-bottom">
                       <img src={tech.foto || "https://via.placeholder.com/100"} alt="Avatar" className="rounded-circle border shadow-sm" style={{ width: "80px", height: "80px", objectFit: "cover" }} onError={(e) => { e.target.src = "https://via.placeholder.com/100"; }} />
                    </div>
                    <div className="card-body text-center pt-3">
                       <h5 className="fw-bold text-dark mb-1">{tech.nombre} {tech.apellido}</h5>
                       <span className="badge bg-info text-dark mb-2">{tech.especialidad}</span>
                       <div className="small text-muted mb-2">{tech.email}</div>
                       {tech.disponible ? <span className="badge bg-success-subtle text-success border border-success">Disponible</span> : <span className="badge bg-secondary-subtle text-secondary border border-secondary">Ocupado</span>}
                    </div>
                    <div className="card-footer bg-white border-top-0 d-flex gap-2 p-3 pt-0">
                       <Button variant="outline-primary" size="sm" className="flex-grow-1" onClick={() => handleOpenEdit(tech)}>Editar</Button>
                       <Button variant="outline-danger" size="sm" className="flex-grow-1" onClick={() => handleDelete(tech.id)}>Eliminar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VISTA LISTA */}
          {viewMode === 'list' && (
            <div className="card shadow border-0 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light text-secondary small text-uppercase">
                    <tr>
                      <th className="ps-4">ID</th>
                      <th>Técnico</th>
                      <th>Especialidad</th>
                      <th>Contacto</th>
                      <th>Estado</th>
                      <th className="text-end pe-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {tecnicosLista.map((tech) => (
                      <tr key={tech.id}>
                        <td className="ps-4 fw-bold">#{tech.id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img src={tech.foto || "https://via.placeholder.com/40"} alt="Avatar" className="rounded-circle me-3 border" style={{ width: "35px", height: "35px", objectFit: "cover" }} />
                            <div className="fw-bold text-dark">{tech.nombre} {tech.apellido}</div>
                          </div>
                        </td>
                        <td><span className="badge bg-light text-dark border fw-normal">{tech.especialidad}</span></td>
                        <td className="small text-secondary">{tech.email}<br/>{tech.telefono}</td>
                        <td>
                           {tech.disponible ? <span className="badge bg-success-subtle text-success rounded-pill">Disponible</span> : <span className="badge bg-secondary-subtle text-secondary rounded-pill">Ocupado</span>}
                        </td>
                        <td className="text-end pe-4">
                           <Button variant="primary" size="sm" className="me-2 px-3" onClick={() => handleOpenEdit(tech)}><i className="bi bi-pencil-square me-1"></i> Editar</Button>
                           <Button variant="danger" size="sm" className="px-3" onClick={() => handleDelete(tech.id)}><i className="bi bi-trash me-1"></i> Eliminar</Button>
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

      {/* --- MODAL --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static" size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold">{editId ? "✏️ Editar Técnico" : "🆕 Registrar Técnico"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="fw-semibold">Nombre *</Form.Label>
                <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-semibold">Apellido</Form.Label>
                <Form.Control type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} />
              </Col>
              <Col md={12}>
                <Form.Label className="fw-semibold">Email (Login) *</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="tecnico@empresa.com" />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-semibold">Teléfono</Form.Label>
                <Form.Control type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-semibold">Especialidad *</Form.Label>
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
                <Form.Label className="fw-semibold">URL Foto</Form.Label>
                <Form.Control type="text" name="foto" placeholder="https://..." value={formData.foto} onChange={handleInputChange} />
              </Col>
              <Col md={12} className="pt-2">
                  <div className="form-check form-switch p-3 bg-light rounded border">
                    <input className="form-check-input ms-0 me-2" type="checkbox" id="disponible-switch" checked={formData.disponible} onChange={(e) => setFormData({...formData, disponible: e.target.checked})} />
                    <label className="form-check-label fw-bold" htmlFor="disponible-switch">Disponible para servicios</label>
                  </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar Cambios"}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}