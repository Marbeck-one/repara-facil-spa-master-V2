import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './utils.jsx';

import Tecnicos from '../src/pages/Tecnicos.jsx';

describe('Técnicos page', () => {
  test('renderiza tarjetas de técnicos y sus nombres', () => {
    renderWithProviders(<Tecnicos />);

    // Nombres del mock
  expect(screen.getByText(/carlos pérez/i)).toBeInTheDocument();
  expect(screen.getByText(/maría torres/i)).toBeInTheDocument();
  expect(screen.getByText(/josé ramírez/i)).toBeInTheDocument();


    // Al menos 3 cards
    const cards = screen.getAllByRole('heading', { level: 5 });
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });
});
