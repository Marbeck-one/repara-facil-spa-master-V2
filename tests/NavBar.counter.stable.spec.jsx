import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppNavbar from "../src/components/AppNavbar.jsx";
import ServiceCard from "../src/components/ServiceCard.jsx";
import { renderWithProviders } from "./utils.jsx";

describe("Navbar + contador global (estable)", () => {
  test("clic en Agregar incrementa el badge en Navbar", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <AppNavbar />
        <ServiceCard service={{ id: 7, nombre: "Secadora" }} />
      </>
    );

    const badgeWrap = screen.getByTestId("counter-badge");
    const badge = badgeWrap.querySelector(".badge");
    expect(badge.textContent).toBe("0");

    await user.click(screen.getByRole("button", { name: /agregar/i }));
    expect(badge.textContent).toBe("1");

    await user.click(screen.getByRole("button", { name: /agregar/i }));
    expect(badge.textContent).toBe("2");
  });
});
