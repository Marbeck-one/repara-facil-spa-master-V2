// tests/Agenda.spec.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as agendaService from "../src/api/agendaService";
import Agenda from "../src/pages/Agenda";

// Estado simulado del contexto
let mockAgenda = [];
const mockSetAgenda = vi.fn();

// Mock del hook useApp del contexto global
vi.mock("../src/context/AppContext.jsx", () => {
  return {
    useApp: () => ({
      agenda: mockAgenda,
      setAgenda: mockSetAgenda,
    }),
  };
});

// Mock del servicio de agenda (getAgenda, cancelarAgenda, etc.)
vi.mock("../src/api/agendaService");

function renderAgenda() {
  return render(
    <MemoryRouter>
      <Agenda />
    </MemoryRouter>
  );
}

describe("Agenda page", () => {
  beforeEach(() => {
    // limpiamos estado entre tests
    mockAgenda = [];
    mockSetAgenda.mockReset();
    vi.clearAllMocks();
  });

  it("muestra mensaje cuando no hay citas", async () => {
    // el backend responde lista vacía
    agendaService.getAgenda.mockResolvedValueOnce([]);

    renderAgenda();

    // esperamos directamente al mensaje final de "sin citas"
    await screen.findByText(/No tienes citas aún\./i);
  });

  it("muestra una fila cuando el backend trae una cita", async () => {
    const citas = [
      {
        id: 1,
        cliente: "Juan Pérez",
        direccion: "Calle Falsa 123",
        fecha: "2025-11-30",
        servicio: "Reparación de lavadora",
        tecnico_nombre: "Tec Uno",
        estado: "Pendiente",
      },
    ];

    // el contexto parte con esa cita cargada
    mockAgenda = citas;
    // y además simulamos que el backend devuelve lo mismo
    agendaService.getAgenda.mockResolvedValueOnce(citas);

    renderAgenda();

    // esperamos que la tabla muestre los datos de la cita
    await screen.findByText("Juan Pérez");
    await screen.findByText("Reparación de lavadora");
  });
});
