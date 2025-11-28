import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "../src/context/AppContext.jsx";
import Login from "../src/pages/Login.jsx";

function renderWithProviders() {
  return render(
    <BrowserRouter>
      <AppProvider>
        <Login />
      </AppProvider>
    </BrowserRouter>
  );
}

describe("Login (inicio de sesión de cliente)", () => {
  beforeEach(() => {
    localStorage.clear();
    // simulamos que ya hay un cliente registrado
    localStorage.setItem(
      "clientesAuth",
      JSON.stringify([
        { nombre: "Cliente Test", email: "cliente@test.cl", password: "123456" },
      ])
    );
  });

  it("permite iniciar sesión con credenciales correctas", () => {
    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/Correo/i), {
      target: { value: "cliente@test.cl" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    // se debe haber guardado el usuario logueado
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    expect(usuario).not.toBeNull();
    expect(usuario.email).toBe("cliente@test.cl");
  });

  it("muestra error con credenciales incorrectas", () => {
    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/Correo/i), {
      target: { value: "cliente@test.cl" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "mala" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(
      screen.getByText(/Credenciales incorrectas/i)
    ).toBeInTheDocument();

    const usuario = localStorage.getItem("usuario");
    expect(usuario).toBeNull();
  });
});
