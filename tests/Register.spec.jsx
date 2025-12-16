import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "../src/context/AppContext.jsx";
import Register from "../src/pages/Register.jsx";

// --- FIX CRÍTICO: Usar vi.hoisted para definir mocks antes de todo ---
const mocks = vi.hoisted(() => ({
  post: vi.fn(),
  useNavigate: vi.fn(),
  reload: vi.fn(),
}));

// Mock API
vi.mock("../src/api/api", () => ({
  default: { post: mocks.post },
}));

// Mock Router
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mocks.useNavigate };
});

// Mock Window Reload
Object.defineProperty(window, "location", {
  configurable: true,
  value: { reload: mocks.reload },
});

function renderWithProviders() {
  return render(
    <BrowserRouter>
      <AppProvider>
        <Register />
      </AppProvider>
    </BrowserRouter>
  );
}

describe("Register (registro de cliente)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("muestra los campos básicos de registro", () => {
    renderWithProviders();
    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
  });

  it("llama a la API y guarda el token tras registro exitoso", async () => {
    mocks.post.mockResolvedValueOnce({
      data: { token: "fake-jwt", username: "cliente@test.cl" },
    });

    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/Nombre completo/i), { target: { value: "Cliente" } });
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: "cliente@test.cl" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /Registrarme/i }));

    await waitFor(() => {
      expect(mocks.post).toHaveBeenCalled();
      expect(localStorage.getItem("token")).toBe("fake-jwt");
    });
  });

  it("muestra error si el correo ya existe", async () => {
    mocks.post.mockRejectedValueOnce({
      response: { status: 400, data: { error: "El usuario ya existe" } },
    });

    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/Nombre completo/i), { target: { value: "Otro" } });
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: "repetido@test.cl" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /Registrarme/i }));

    await waitFor(() => {
      // Ajusta este texto al error que realmente muestre tu componente
      expect(screen.getByText(/El usuario ya existe/i)).toBeInTheDocument();
    });
  });
});