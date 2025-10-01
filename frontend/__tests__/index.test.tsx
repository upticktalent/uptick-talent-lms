import { render, screen } from '@testing-library/react';

import Home from '@/features/home';

describe('Home Page', () => {
  it('renders the heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});
