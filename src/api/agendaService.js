import api from "./api";

// NOTA: El backend usa "/agendas" (plural), así que ajustamos las rutas aquí.

export async function getAgenda() {
    return api.get("/agendas"); 
}

export async function getAgendaById(id) {
    return api.get(`/agendas/${id}`);
}

export async function createAgenda(agendaData) {
    return api.post("/agendas", agendaData);
}

// Para cancelar, verifica si tu backend usa "cancelar" o un delete directo.
// Si tu controller tiene @DeleteMapping("/{id}"), usa api.delete.
// Si tiene un endpoint especial @PostMapping("/cancelar/{id}"), usa este:
export async function cancelarAgenda(id) {
    return api.delete(`/agendas/${id}`); // Lo cambié a delete estándar por si acaso
}

export async function updateAgenda(id, agendaData) {
    return api.put(`/agendas/${id}`, agendaData);
}

export async function searchAgenda(params) {
    return api.get("/agendas/search", { params });
}