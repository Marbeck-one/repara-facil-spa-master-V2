import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './utils.jsx';


import Garantias from '../src/pages/Garantias.jsx';

describe('Garantías page', () => {
  test('muestra Vigente si el código termina en 7', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Garantias />);

    const input = screen.getByPlaceholderText(/código de garantía/i);
    await user.type(input, 'ABC1237');
    await user.click(screen.getByRole('button', { name: /consultar/i }));

    expect(await screen.findByText(/estado:\s*vigente/i)).toBeInTheDocument();
  });

  test('muestra Vencida si el código no termina en 7', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Garantias />);

    const input = screen.getByPlaceholderText(/código de garantía/i);
    await user.clear(input);
    await user.type(input, 'XYZ999');
    await user.click(screen.getByRole('button', { name: /consultar/i }));

    expect(await screen.findByText(/estado:\s*vencida/i)).toBeInTheDocument();
  });
});
