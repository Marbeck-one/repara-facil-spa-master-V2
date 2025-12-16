import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Contact from "../src/pages/Contact.jsx";
import { AppProvider } from "../src/context/AppContext.jsx";

// --- FIX: vi.hoisted ---
const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  post: vi.fn(),
}));

vi.mock("../src/context/AuthContext", () => ({
  useAuth: mocks.useAuth,
}));

vi.mock("../src/api/api", () => ({
  default: { post: mocks.post, get: vi.fn() },
}));

describe("Contacto (estable)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useAuth.mockReturnValue({ isAuthenticated: false });
  });

  it("muestra el formulario público", () => {
    render(<AppProvider><Contact /></AppProvider>);
    expect(screen.getByText(/Contáctanos/i)).toBeInTheDocument();
  });

  it("valida campos y muestra éxito", async () => {
    const { container } = render(<AppProvider><Contact /></AppProvider>);
    
    // Selectores directos porque no hay IDs
    const inputs = container.querySelectorAll('input');
    const textarea = container.querySelector('textarea');
    
    fireEvent.change(inputs[0], { target: { value: "Juan" } });
    fireEvent.change(inputs[1], { target: { value: "juan@test.com" } });
    fireEvent.change(textarea, { target: { value: "Ayuda" } });

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => {
      expect(screen.getByText(/¡Mensaje Enviado!/i)).toBeInTheDocument();
    });
  });
});