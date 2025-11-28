import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "../src/pages/Contact.jsx";
import { renderWithProviders } from "./utils.jsx";

describe("Contacto (estable)", () => {
  test("valida campos y muestra éxito simulado", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Contact />);

    // Envío vacío
    await user.click(screen.getByRole("button", { name: /enviar/i }));
    expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/el correo es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/el mensaje es obligatorio/i)).toBeInTheDocument();

    // Válidos
    await user.type(screen.getByLabelText(/nombre/i), "Ada");
    await user.type(screen.getByLabelText(/correo/i), "ada@example.com");
    await user.type(screen.getByLabelText(/mensaje/i), "Hola");
    await user.click(screen.getByRole("button", { name: /enviar/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/mensaje enviado correctamente/i);
  });
});
