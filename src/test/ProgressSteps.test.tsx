import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProgressSteps } from '../components/ProgressSteps';

describe('ProgressSteps', () => {
  it('renders correct number of step indicators', () => {
    const { container } = render(<ProgressSteps total={4} current={0} />);
    // Each step is a div inside the flex container
    const steps = container.firstElementChild?.children;
    expect(steps).toHaveLength(4);
  });

  it('renders more steps when total increases', () => {
    const { container } = render(<ProgressSteps total={6} current={2} />);
    const steps = container.firstElementChild?.children;
    expect(steps).toHaveLength(6);
  });
});
