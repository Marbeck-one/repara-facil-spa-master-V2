import api from "./api";

// Obtiene la lista de clientes
export async function getClientes() {
  const response = await api.get("/clientes");
  return response.data; // Devuelve el array directamente
}

// Obtiene un cliente por ID
export async function getClienteById(id) {
  const response = await api.get(`/clientes/${id}`);
  return response.data;
}

// Crea un nuevo cliente
export async function createCliente(cliente) {
  const response = await api.post("/clientes", cliente);
  return response.data;
}

// Actualiza un cliente existente
export async function updateCliente(id, cliente) {
  const response = await api.put(`/clientes/${id}`, cliente);
  return response.data;
}

// Elimina un cliente por ID
export async function deleteCliente(id) {
  await api.delete(`/clientes/${id}`);
}