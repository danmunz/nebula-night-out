import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Avatar } from '../components/Avatar';

describe('Avatar', () => {
  it('renders an image with dicebear src', () => {
    const { container } = render(<Avatar seed="zara-test" size={80} />);
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.src).toContain('dicebear.com');
    expect(img?.src).toContain('zara-test');
  });

  it('applies the size prop', () => {
    const { container } = render(<Avatar seed="test" size={64} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.width).toBe('64px');
    expect(wrapper.style.height).toBe('64px');
  });
});
