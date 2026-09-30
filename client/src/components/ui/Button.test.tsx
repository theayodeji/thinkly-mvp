import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    // @ts-ignore
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loader when loading', () => {
    render(<Button loading>Submit</Button>);
    // @ts-ignore
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
