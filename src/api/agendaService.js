import api from "./api";

export async function getAgenda() {
    return api.get("/agenda");
}

export async function getAgendaById(id) {
    return api.get(`/agenda/${id}`);
}

export async function createAgenda(agendaData) {
    return api.post("/agenda", agendaData);
}

export async function cancelarAgenda(id) {
    return api.post(`/agenda/cancelar/${id}`);
}

export async function updateAgenda(id, agendaData) {
    return api.put(`/agenda/${id}`, agendaData);
}

export async function searchAgenda(params) {
    return api.get("/agenda/search", { params });
}
