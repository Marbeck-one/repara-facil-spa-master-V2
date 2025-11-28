import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ServiceCard from "../src/components/ServiceCard.jsx";
import { renderWithProviders } from "./utils.jsx";

describe("ServiceCard (estable)", () => {
  test("muestra nombre y permite 'Agregar' (contador)", async () => {
    const user = userEvent.setup();
    const item = { id: 1, nombre: "Reparación Lavadora", categoria: "electro", precio: 29990 };
    renderWithProviders(<ServiceCard service={item} />);
    expect(screen.getByTestId("service-card")).toBeInTheDocument();
    expect(screen.getByText(/Reparación Lavadora/i)).toBeInTheDocument();

    const btnAgregar = screen.getByRole("button", { name: /agregar/i });
    await user.click(btnAgregar);
    // No esperamos UI específica aquí; el contador se valida en el test de Navbar.
  });
});
