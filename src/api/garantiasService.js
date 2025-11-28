import api from "./api";

// Obtener todas las garantías
export async function getGarantias() {
  const response = await api.get("/garantias");
  return response.data;
}

// Consultar una garantía específica por ID
export async function getGarantiaById(id) {
  // El backend retorna 404 si no existe, lo manejaremos en el componente
  const response = await api.get(`/garantias/${id}`);
  return response.data;
}

// Crear garantía (esto se usaría internamente cuando un técnico finaliza un trabajo)
export async function createGarantia(garantia) {
  const response = await api.post("/garantias", garantia);
  return response.data;
}