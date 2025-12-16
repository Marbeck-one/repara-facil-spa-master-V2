import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../src/pages/Login.jsx";

// 1. Mock de AuthContext
const mockLogin = vi.fn();

vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false
  }),
  // Mock simple del Provider
  AuthProvider: ({children}) => <div>{children}</div> 
}));

// 2. Mock de API
vi.mock("../src/api/api", () => ({
  default: { post: vi.fn() }
}));

// 3. Mock del Router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inicia sesión llamando a la función del contexto", async () => {
    mockLogin.mockResolvedValue({ success: true });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: "cliente@test.cl" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "123456" } });

    // CORREGIDO: Faltaba un paréntesis de cierre aquí
    fireEvent.click(screen.getByRole("button", { name: /Iniciar Sesión/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith("cliente@test.cl", "123456");
    });
  });

  it("maneja error en el login", async () => {
    mockLogin.mockRejectedValue(new Error("Credenciales inválidas"));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: "fail@test.cl" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "wrong" } });

    // CORREGIDO: Faltaba un paréntesis de cierre aquí también
    fireEvent.click(screen.getByRole("button", { name: /Iniciar Sesión/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });
  });
});