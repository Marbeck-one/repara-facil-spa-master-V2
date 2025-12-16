import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './utils.jsx';
import Agenda from '../src/pages/Agenda.jsx';

// Mock simple de la API
vi.mock('../src/api/api', () => ({
  default: { get: vi.fn().mockResolvedValue({ data: [] }) }
}));

describe('Agenda page', () => {
  test('muestra mensaje cuando no hay citas', async () => {
    renderWithProviders(<Agenda />);
    // FIX: Texto real según tus logs
    expect(await screen.findByText(/No hay citas programadas/i)).toBeInTheDocument();
  });
});