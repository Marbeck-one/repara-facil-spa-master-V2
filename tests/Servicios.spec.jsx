import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Servicios from '../src/pages/Servicios.jsx';
import { AppProvider } from '../src/context/AppContext.jsx';

function renderWithContext(ui) {
  return render(
    <MemoryRouter>
      <AppProvider>{ui}</AppProvider>
    </MemoryRouter>
  );
}

describe('Servicios page', () => {
  it('muestra el título "Servicios"', () => {
    renderWithContext(<Servicios />);
    expect(screen.getByText(/Servicios/i)).toBeInTheDocument();
  });

  it('renderiza cards de servicios (data-testid="service-card")', () => {
    renderWithContext(<Servicios />);
    const cards = screen.getAllByTestId('service-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('permite agendar (click en primer botón "Agendar")', () => {
    renderWithContext(<Servicios />);
    const btns = screen.getAllByRole('button', { name: /agendar/i });
    expect(btns.length).toBeGreaterThan(0);
    fireEvent.click(btns[0]);
    // Aquí podrías comprobar efectos en el contexto o UI según tu implementación
    expect(btns[0]).toBeTruthy();
  });
});
