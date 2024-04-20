import '@testing-library/jest-dom';
import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import Greet from '../../src/components/Greet';

describe('Greet', () => {
  it('should render Hello with the name when name is provided', () => {
    render(<Greet name="NZKKS" />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/hello NZKKS/i);
  });

  it('should render login button when the name when name is not provided', () => {
    render(<Greet />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  });
});
