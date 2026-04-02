import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ImageCropper } from '../components/ImageCropper';

// Mock react-easy-crop since it requires canvas/DOM APIs not available in jsdom
vi.mock('react-easy-crop', () => ({
  default: ({ onCropComplete }: { onCropComplete: (area: unknown, pixels: unknown) => void }) => {
    // Simulate a crop completion on mount
    setTimeout(() => {
      onCropComplete(
        { x: 0, y: 0, width: 100, height: 100 },
        { x: 0, y: 0, width: 300, height: 300 },
      );
    }, 0);
    return <div data-testid="cropper" />;
  },
}));

describe('ImageCropper', () => {
  const testImage = 'data:image/jpeg;base64,/9j/4AAQ...';

  it('renders with title and buttons', () => {
    const { getByText } = render(
      <ImageCropper imageSrc={testImage} onConfirm={vi.fn()} onCancel={vi.fn()} />,
    );
    expect(getByText('Crop Your Photo')).toBeTruthy();
    expect(getByText('Use This Photo')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn();
    const { getByText } = render(
      <ImageCropper imageSrc={testImage} onConfirm={vi.fn()} onCancel={onCancel} />,
    );
    fireEvent.click(getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('renders a zoom slider', () => {
    const { container } = render(
      <ImageCropper imageSrc={testImage} onConfirm={vi.fn()} onCancel={vi.fn()} />,
    );
    const slider = container.querySelector('input[type="range"]');
    expect(slider).toBeTruthy();
    expect(slider?.getAttribute('aria-label')).toBe('Zoom');
  });

  it('renders the cropper component', () => {
    const { getByTestId } = render(
      <ImageCropper imageSrc={testImage} onConfirm={vi.fn()} onCancel={vi.fn()} />,
    );
    expect(getByTestId('cropper')).toBeTruthy();
  });
});
