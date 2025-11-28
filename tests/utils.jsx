import React from 'react';
import { render } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { AppProvider } from '../src/context/AppContext.jsx';

export function renderWithProviders(ui, options) {
  return render(
    <HashRouter>
      <AppProvider>{ui}</AppProvider>
    </HashRouter>,
    options
  );
}
