import api from "./api";

// Obtener todas las garantías
export const getGarantias = async () => {
  const response = await api.get("/garantias");
  return response.data;
};

// Crear una nueva garantía
export const createGarantia = async (data) => {
  const response = await api.post("/garantias", data);
  return response.data;
};

// Actualizar una garantía existente
export const updateGarantia = async (id, data) => {
  const response = await api.put(`/garantias/${id}`, data);
  return response.data;
};

// Eliminar una garantía (Esta es la que te faltaba)
export const deleteGarantia = async (id) => {
  const response = await api.delete(`/garantias/${id}`);
  return response.data;
};