import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Tecnicos from '../src/pages/Tecnicos.jsx';
import { AppProvider } from '../src/context/AppContext.jsx';

// MOCK API
vi.mock("../src/api/tecnicosService", () => ({
  getTecnicos: vi.fn().mockResolvedValue([
    { id: 1, nombre: "Carlos", apellido: "Pérez", especialidad: "Electricidad", foto: "" }
  ]),
}));

function renderWithContext(ui) {
  return render(
    <MemoryRouter>
      <AppProvider>{ui}</AppProvider>
    </MemoryRouter>
  );
}

describe('Técnicos page', () => {
  test('renderiza tarjetas de técnicos', async () => {
    renderWithContext(<Tecnicos />);
    
    await waitFor(() => {
      expect(screen.getByText("Carlos Pérez")).toBeInTheDocument();
    });
  });
});