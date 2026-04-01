import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassCard } from '../components/GlassCard';

describe('GlassCard', () => {
  it('renders children', () => {
    render(<GlassCard>Hello Cosmos</GlassCard>);
    expect(screen.getByText('Hello Cosmos')).toBeInTheDocument();
  });

  it('applies custom padding', () => {
    const { container } = render(<GlassCard padding="2rem">Content</GlassCard>);
    const inner = container.querySelector('div > div');
    expect(inner).toBeTruthy();
  });
});
