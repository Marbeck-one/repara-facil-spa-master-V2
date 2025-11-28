import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "../src/context/AppContext.jsx";
import Register from "../src/pages/Register.jsx";

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
  });

  it("muestra los campos básicos de registro", () => {
    renderWithProviders();

    expect(
      screen.getByLabelText(/Nombre completo/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Confirmar contraseña/i)
    ).toBeInTheDocument();
  });

  it("registra un nuevo cliente en localStorage", () => {
    renderWithProviders();

    fireEvent.change(
      screen.getByLabelText(/Nombre completo/i),
      { target: { value: "Cliente Test" } }
    );
    fireEvent.change(screen.getByLabelText(/Correo/i), {
      target: { value: "cliente@test.cl" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Registrarme/i }));

    const guardados = JSON.parse(
      localStorage.getItem("clientesAuth") || "[]"
    );
    const encontrado = guardados.find(
      (c) => c.email === "cliente@test.cl"
    );

    expect(encontrado).toBeTruthy();
    expect(encontrado.nombre).toBe("Cliente Test");
  });

  it("muestra error si el correo ya está registrado", () => {
    // cliente ya registrado
    localStorage.setItem(
      "clientesAuth",
      JSON.stringify([
        { nombre: "Ya Existe", email: "repetido@test.cl", password: "123456" },
      ])
    );

    renderWithProviders();

    fireEvent.change(
      screen.getByLabelText(/Nombre completo/i),
      { target: { value: "Otro Cliente" } }
    );
    fireEvent.change(screen.getByLabelText(/Correo/i), {
      target: { value: "repetido@test.cl" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Registrarme/i }));

    expect(
      screen.getByText(/El correo ya está registrado/i)
    ).toBeInTheDocument();
  });
});
