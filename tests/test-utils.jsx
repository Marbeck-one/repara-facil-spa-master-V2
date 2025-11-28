import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppProvider } from "../src/context/AppContext.jsx";

// Render con Router + AppContext
export function renderWithRouter(ui, { route = "/" } = {}) {
  window.history.pushState({}, "Test page", route);

  return render(
    <AppProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AppProvider>
  );
}

// Alias para que los tests que usan "renderWithProviders" funcionen
export function renderWithProviders(ui, options = {}) {
  return renderWithRouter(ui, options);
}
