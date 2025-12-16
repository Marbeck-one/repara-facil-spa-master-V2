import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest'; // Importamos vi
import Servicios from '../src/pages/Servicios.jsx';
import { AppProvider } from '../src/context/AppContext.jsx';

// --- MOCK: Simular respuesta de la API ---
vi.mock("../src/api/serviciosService", () => ({
  getServicios: vi.fn().mockResolvedValue([
    { id: 1, nombre: "Lavadora", descripcion: "Reparación", precio: 20000 },
    { id: 2, nombre: "Secadora", descripcion: "Mantención", precio: 15000 },
  ]),
}));
// ----------------------------------------

function renderWithContext(ui) {
  return render(
    <MemoryRouter>
      <AppProvider>{ui}</AppProvider>
    </MemoryRouter>
  );
}

describe('Servicios page', () => {
  it('muestra el título "Servicios"', async () => {
    renderWithContext(<Servicios />);
    // Usamos findByText por si carga asíncrono
    expect(await screen.findByText(/Servicios/i)).toBeInTheDocument();
  });

  it('renderiza cards de servicios tras cargar la API', async () => {
    renderWithContext(<Servicios />);
    
    // Esperamos a que aparezcan los elementos mockeados
    await waitFor(() => {
        const cards = screen.getAllByTestId('service-card');
        expect(cards.length).toBeGreaterThan(0);
    });
  });

  it('permite agendar (click en primer botón "Agendar")', async () => {
    renderWithContext(<Servicios />);
    
    // Esperar a que carguen los botones
    const btns = await screen.findAllByRole('button', { name: /agendar/i });
    expect(btns.length).toBeGreaterThan(0);
    
    // Simular click
    fireEvent.click(btns[0]);
    
    // Verificación básica de que el botón sigue ahí y no explotó la app
    expect(btns[0]).toBeInTheDocument();
  });
});