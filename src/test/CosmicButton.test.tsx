import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CosmicButton } from '../components/CosmicButton';

describe('CosmicButton', () => {
  it('renders with text', () => {
    render(<CosmicButton>Launch</CosmicButton>);
    expect(screen.getByRole('button', { name: /launch/i })).toBeInTheDocument();
  });

  it('renders secondary variant', () => {
    render(<CosmicButton variant="secondary">Cancel</CosmicButton>);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('renders ghost variant', () => {
    render(<CosmicButton variant="ghost">Skip</CosmicButton>);
    expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument();
  });

  it('passes through onClick', () => {
    let clicked = false;
    render(<CosmicButton onClick={() => (clicked = true)}>Click Me</CosmicButton>);
    screen.getByRole('button').click();
    expect(clicked).toBe(true);
  });

  it('renders with icon', () => {
    render(
      <CosmicButton icon={<span data-testid="icon">★</span>}>
        Star
      </CosmicButton>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
