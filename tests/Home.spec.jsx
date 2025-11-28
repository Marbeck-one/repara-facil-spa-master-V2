import { screen } from "@testing-library/react";
import { renderWithProviders } from "./utils.jsx";
import Home from "../src/pages/Home.jsx";

describe("Home page", () => {
  const renderHome = () => renderWithProviders(<Home />);

  test("muestra el título de bienvenida", () => {
    renderHome();

    expect(
      screen.getByRole("heading", { name: /reparafácil spa/i })
    ).toBeInTheDocument();
  });

  test("tiene un botón para ver servicios", () => {
    renderHome();

    const boton = screen.getByRole("button", { name: /ver servicios/i });
    expect(boton).toBeInTheDocument();
  });

  test("renderiza al menos un técnico destacado (por title)", () => {
    renderHome();

    const cards = screen.getAllByTitle(/técnico:/i);
    expect(cards.length).toBeGreaterThan(0);
  });
});
