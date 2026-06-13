import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from '../../src/layouts/AuthLayout.jsx';
import { ThemeProvider } from '../../src/context/ThemeContext.jsx';

test('AuthLayout renders children', () => {
  render(
    <MemoryRouter initialEntries={['/test']}>
      <ThemeProvider>
        <Routes>
          <Route path='/' element={<AuthLayout />}>
            <Route path='test' element={<h1 data-testid='title'>Welcome</h1>} />
          </Route>
        </Routes>
      </ThemeProvider>
    </MemoryRouter>
  );
  expect(screen.getByTestId('title')).toHaveTextContent('Welcome');
});
