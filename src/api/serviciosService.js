import api from "./api";

// Listar todos los servicios
export async function getServicios() {
  const response = await api.get("/servicios");
  return response.data;
}

// Crear una nueva solicitud de servicio
export async function createServicio(servicioData) {
  const response = await api.post("/servicios", servicioData);
  return response.data;
}

// Eliminar servicio
export async function deleteServicio(id) {
  await api.delete(`/servicios/${id}`);
}