import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./utils.jsx";
import Home from "../src/pages/Home.jsx";
import { vi, describe, test, expect, beforeEach } from "vitest";

// --- MOCKS: Evitar errores de red ---
vi.mock("../src/api/tecnicosService", () => ({
  getTecnicos: vi.fn().mockResolvedValue([
    { id: 1, nombre: "Juan", apellido: "Perez", especialidad: "Electricidad", foto: "url" }
  ]),
}));

vi.mock("../src/api/serviciosService", () => ({
  getServicios: vi.fn().mockResolvedValue([
    { id: 1, nombre: "Reparación", precio: 10000 }
  ]),
}));
// ------------------------------------

describe("Home page", () => {
  test("muestra elementos principales y carga datos", async () => {
    renderWithProviders(<Home />);

    // 1. Título principal
    expect(screen.getByRole("heading", { name: /Expertos en reparaciones/i })).toBeInTheDocument();

    // 2. Botón de servicios
    expect(screen.getByRole("button", { name: /ver servicios/i })).toBeInTheDocument();

    // 3. Esperar a que carguen los datos mockeados (Técnicos o Servicios destacados)
    // Buscamos cualquier botón de acción que indique que las cards cargaron
    await waitFor(() => {
        const buttons = screen.getAllByRole("button", { name: /agendar/i });
        expect(buttons.length).toBeGreaterThan(0);
    });
  });
});