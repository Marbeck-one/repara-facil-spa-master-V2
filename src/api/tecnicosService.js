import api from "./api";

export async function getTecnicos() {
  const response = await api.get("/tecnicos");
  return response.data;
}

export async function getTecnicoById(id) {
  const response = await api.get(`/tecnicos/${id}`);
  return response.data;
}

export async function createTecnico(tecnico) {
  const response = await api.post("/tecnicos", tecnico);
  return response.data;
}

export async function deleteTecnico(id) {
  await api.delete(`/tecnicos/${id}`);
}