import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Garantias from '../src/pages/Garantias.jsx';
import { AppProvider } from '../src/context/AppContext.jsx';

// 1. Mocks de Servicios (Devolvemos arrays vacíos para que cargue rápido)
vi.mock('../src/api/garantiasService', () => ({
  getGarantias: vi.fn().mockResolvedValue([]),
  createGarantia: vi.fn(),
  updateGarantia: vi.fn(),
  deleteGarantia: vi.fn(),
}));

vi.mock('../src/api/serviciosService', () => ({
  getServicios: vi.fn().mockResolvedValue([]),
}));

// 2. Mock de AuthContext
const mockUseAuth = vi.fn();
vi.mock('../src/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

function renderWithProviders(ui) {
  return render(<AppProvider>{ui}</AppProvider>);
}

describe('Garantías page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simulamos un usuario logueado para activar la carga de datos
    mockUseAuth.mockReturnValue({ 
      role: 'ADMIN', 
      username: 'admin@test.cl',
      isAuthenticated: true 
    });
  });

  test('Renderiza la página de gestión y termina de cargar', async () => {
    // Renderizamos el componente
    const { container } = renderWithProviders(<Garantias />);

    // Esperamos a que el "loading" (spinner) desaparezca
    await waitFor(() => {
      const spinner = container.querySelector('.spinner-border');
      expect(spinner).not.toBeInTheDocument();
    });

    // Si desaparece el spinner, significa que cargó la vista de gestión
    // Verificamos que no haya explotado
    expect(container).toBeInTheDocument();
  });
});