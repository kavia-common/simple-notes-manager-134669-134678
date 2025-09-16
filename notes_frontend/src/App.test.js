import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Notes brand in navbar', () => {
  render(<App />);
  const brand = screen.getByText(/notes/i);
  expect(brand).toBeInTheDocument();
});
