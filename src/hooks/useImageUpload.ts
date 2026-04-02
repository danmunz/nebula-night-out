import { useRef, useState, useCallback } from 'react';

export function useImageUpload() {
  const [imageData, setImageData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const readFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageData(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const triggerFileSelect = useCallback(() => {
    if (!fileInputRef.current) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      input.addEventListener('change', () => {
        const file = input.files?.[0];
        if (file) readFile(file);
        input.value = '';
      });
      document.body.appendChild(input);
      fileInputRef.current = input;
    }
    fileInputRef.current.click();
  }, [readFile]);

  const triggerCamera = useCallback(() => {
    if (!cameraInputRef.current) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.setAttribute('capture', 'user');
      input.style.display = 'none';
      input.addEventListener('change', () => {
        const file = input.files?.[0];
        if (file) readFile(file);
        input.value = '';
      });
      document.body.appendChild(input);
      cameraInputRef.current = input;
    }
    cameraInputRef.current.click();
  }, [readFile]);

  const clearImage = useCallback(() => {
    setImageData(null);
  }, []);

  return { imageData, triggerFileSelect, triggerCamera, clearImage };
}
