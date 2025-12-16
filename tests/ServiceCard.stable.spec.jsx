import React from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ServiceCard from "../src/components/ServiceCard.jsx";
import { AppProvider } from "../src/context/AppContext.jsx";

// MOCKS PARA EVITAR ERROR DE RED
vi.mock("../src/api/clientesService", () => ({ getClientes: vi.fn().mockResolvedValue([]) }));
vi.mock("../src/api/tecnicosService", () => ({ getTecnicos: vi.fn().mockResolvedValue([]) }));
vi.mock("../src/api/serviciosService", () => ({ getServicios: vi.fn().mockResolvedValue([]) }));

function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <AppProvider>{ui}</AppProvider>
    </BrowserRouter>
  );
}

describe("ServiceCard (estable)", () => {
  test("muestra nombre y permite 'Agendar Cita'", () => {
    const fakeService = { id: 1, nombre: "Lavadora", precio: 20000 };
    renderWithProviders(<ServiceCard service={fakeService} />);
    
    expect(screen.getByText("Lavadora")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Agendar Cita/i })).toBeInTheDocument();
  });
});