import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/api";
// 1. IMPORTANTE: Agregamos updateTecnico a los imports
import { createTecnico, deleteTecnico, updateTecnico } from "../api/tecnicosService"; 
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function DashboardAdmin() {
  const { username } = useAuth();
  
  // --- ESTADÍSTICAS ---
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalTecnicos: 0,
    totalServicios: 0,
    totalGarantias: 0
  });

  // --- TABLA DE TÉCNICOS ---
  const [tecnicosLista, setTecnicosLista] = useState([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // 2. NUEVO: Estado para controlar si estamos editando
  const [editId, setEditId] = useState(null); // null = creando, ID = editando

  // Estado del Formulario
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
      const [clientesResp, tecnicosResp, serviciosResp, garantiasResp] = await Promise.all([
        api.get("/clientes"),
        api.get("/tecnicos"),
        api.get("/servicios"),
        api.get("/garantias")
      ]);

      setStats({
        totalClientes: clientesResp.data.length,
        totalTecnicos: tecnicosResp.data.length,
        totalServicios: serviciosResp.data.length,
        totalGarantias: garantiasResp.data.length
      });

      setTecnicosLista(tecnicosResp.data);
    } catch (error) {
      console.error("Error cargando el dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- 3. NUEVO: Función para abrir modal en modo CREAR ---
  const handleOpenCreate = () => {
    setEditId(null); // Modo crear
    setFormData(initialFormState); // Limpiar form
    setShowModal(true);
  };

  // --- 4. NUEVO: Función para abrir modal en modo EDITAR ---
  const handleOpenEdit = (tech) => {
    setEditId(tech.id); // Guardamos ID a editar
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

  // --- GUARDAR (Crear o Editar) ---
  const handleSave = async () => {
    if (!formData.nombre || !formData.email || !formData.especialidad) {
      alert("Por favor completa los campos obligatorios (*)");
      return;
    }

    setSaving(true);
    try {
      // Normalizamos la foto (null si está vacía)
      const payload = {
        ...formData,
        foto: formData.foto && formData.foto.trim() !== "" ? formData.foto : null
      };

      if (editId) {
        // --- MODO EDICIÓN ---
        await updateTecnico(editId, payload);
        alert("¡Técnico actualizado correctamente!");
      } else {
        // --- MODO CREACIÓN ---
        await createTecnico(payload);
        alert("¡Técnico creado exitosamente!");
      }
      
      await cargarDatosGenerales(); // Recargar tabla
      setShowModal(false);
      
    } catch (error) {
      console.error("Error guardando técnico:", error);
      alert("Error al guardar. Verifica los datos.");
    } finally {
      setSaving(false);
    }
  };

  // --- ELIMINAR ---
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este técnico?")) {
      try {
        await deleteTecnico(id);
        await cargarDatosGenerales();
      } catch (error) {
        console.error("Error eliminando:", error);
        alert("No se pudo eliminar el técnico.");
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold">🛠️ Panel de Administrador</h1>
          <p className="text-muted mb-0">Bienvenido, <strong>{username}</strong></p>
        </div>
        {/* Usamos handleOpenCreate para limpiar el formulario antes de abrir */}
        <Button variant="primary" size="lg" onClick={handleOpenCreate}>
          <i className="bi bi-person-plus-fill me-2"></i>Nuevo Técnico
        </Button>
      </div>

      {/* --- TARJETAS DE ESTADÍSTICAS --- */}
      <div className="row mb-5">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3 shadow-sm h-100">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5 className="card-title">Clientes</h5>
              <h2 className="display-4 fw-bold">{stats.totalClientes}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3 shadow-sm h-100">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5 className="card-title">Técnicos</h5>
              <h2 className="display-4 fw-bold">{stats.totalTecnicos}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3 shadow-sm h-100">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5 className="card-title">Servicios</h5>
              <h2 className="display-4 fw-bold">{stats.totalServicios}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3 shadow-sm h-100">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <h5 className="card-title">Garantías</h5>
              <h2 className="display-4 fw-bold">{stats.totalGarantias}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* --- TABLA DE GESTIÓN --- */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 border-bottom">
          <h5 className="mb-0 fw-bold text-dark">👨‍🔧 Lista de Técnicos</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Perfil</th>
                <th>Especialidad</th>
                <th>Contacto</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tecnicosLista.length > 0 ? (
                tecnicosLista.map((tech) => (
                  <tr key={tech.id}>
                    <td className="fw-bold">#{tech.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={tech.foto || "https://via.placeholder.com/40"} 
                          alt="Avatar" 
                          className="rounded-circle me-3 border"
                          style={{ width: "40px", height: "40px", objectFit: "cover" }}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
                        />
                        <div>
                          <div className="fw-bold">{tech.nombre} {tech.apellido}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge bg-info text-dark">{tech.especialidad}</span></td>
                    <td>
                      <div className="small fw-semibold">{tech.email}</div>
                      <div className="small text-muted">{tech.telefono}</div>
                    </td>
                    <td>
                      {tech.disponible ? (
                        <span className="badge bg-success">Disponible</span>
                      ) : (
                        <span className="badge bg-secondary">Ocupado</span>
                      )}
                    </td>
                    <td className="text-end">
                      {/* BOTÓN EDITAR */}
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleOpenEdit(tech)}
                        title="Editar técnico"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      {/* BOTÓN ELIMINAR */}
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(tech.id)}
                        title="Eliminar técnico"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="text-muted mb-3">No hay técnicos registrados aún.</div>
                    <Button variant="outline-primary" size="sm" onClick={handleOpenCreate}>
                      Crear el primero
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DE REGISTRO / EDICIÓN --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Editar Técnico" : "Registrar Nuevo Técnico"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" name="nombre" 
                  value={formData.nombre} onChange={handleInputChange} 
                />
              </Col>
              <Col md={6}>
                <Form.Label>Apellido</Form.Label>
                <Form.Control 
                  type="text" name="apellido" 
                  value={formData.apellido} onChange={handleInputChange} 
                />
              </Col>
              <Col md={12}>
                <Form.Label>Email (Usuario de acceso) <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="email" name="email" placeholder="ejemplo@reparafacil.com"
                  value={formData.email} onChange={handleInputChange} 
                  // Si estamos editando, podrías querer deshabilitar el email si es clave primaria lógica
                  // disabled={!!editId} 
                />
              </Col>
              <Col md={6}>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control 
                  type="text" name="telefono" 
                  value={formData.telefono} onChange={handleInputChange} 
                />
              </Col>
              <Col md={6}>
                <Form.Label>Especialidad <span className="text-danger">*</span></Form.Label>
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
                <Form.Label>URL de Foto (Opcional)</Form.Label>
                <Form.Control 
                  type="text" name="foto" placeholder="https://..."
                  value={formData.foto} onChange={handleInputChange} 
                />
              </Col>
              <Col md={12}>
                <Form.Check 
                  type="switch"
                  id="disponible-switch"
                  label="Disponible para servicios"
                  checked={formData.disponible}
                  onChange={(e) => setFormData({...formData, disponible: e.target.checked})}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : (editId ? "Actualizar" : "Crear Técnico")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}