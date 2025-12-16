import React from "react";
import { describe, test, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppNavbar from "../src/components/AppNavbar.jsx";
import ServiceCard from "../src/components/ServiceCard.jsx";
import { renderWithProviders } from "./utils.jsx";

// 1. Mocks de la API general
vi.mock("../src/api/api", () => ({
  default: { 
    get: vi.fn().mockResolvedValue({ data: [] }), 
    post: vi.fn() 
  }
}));

// 2. MOCKS ESPECÍFICOS (Evitan que el Navbar explote al cargar)
vi.mock("../src/api/clientesService", () => ({
  getClientes: vi.fn().mockResolvedValue([]),
}));
vi.mock("../src/api/tecnicosService", () => ({
  getTecnicos: vi.fn().mockResolvedValue([]),
}));

// 3. Mock Auth
vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({ isAuthenticated: true, role: "CLIENTE", cartCount: 0 }) 
}));

describe("Navbar + contador global (estable)", () => {
  test("Renderiza Navbar y permite click en Agendar Cita", async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <>
        <AppNavbar />
        <ServiceCard service={{ id: 7, nombre: "Secadora", precio: 10000 }} />
      </>
    );

    const badgeWrap = screen.getByTestId("counter-badge");
    const badge = badgeWrap.querySelector(".badge");
    
    // Verificación inicial
    expect(badge.textContent).toBe("0");

    // Buscar botón por su nombre real
    const btnAgendar = screen.getByRole("button", { name: /agendar cita/i });
    expect(btnAgendar).toBeInTheDocument();

    // Simular click
    await user.click(btnAgendar);
    
    // Verificamos que el badge sigue igual (ya que ahora abre un modal) y no hubo errores
    expect(badge.textContent).toBe("0"); 
  });
});