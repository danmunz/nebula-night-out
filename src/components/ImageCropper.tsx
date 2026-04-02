import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { motion } from 'motion/react';
import { CosmicButton } from './CosmicButton';
import { X, Check, MagnifyingGlassPlus } from '@phosphor-icons/react';

interface ImageCropperProps {
  imageSrc: string;
  onConfirm: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

const OUTPUT_SIZE = 300;
const JPEG_QUALITY = 0.85;

function getCroppedImg(imageSrc: string, crop: Area): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('No canvas context')); return; }

      ctx.drawImage(
        image,
        crop.x, crop.y, crop.width, crop.height,
        0, 0, OUTPUT_SIZE, OUTPUT_SIZE,
      );

      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    };
    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = imageSrc;
  });
}

export function ImageCropper({ imageSrc, onConfirm, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!croppedArea) return;
    try {
      const result = await getCroppedImg(imageSrc, croppedArea);
      onConfirm(result);
    } catch {
      // If cropping fails, fall through to cancel
      onCancel();
    }
  }, [croppedArea, imageSrc, onConfirm, onCancel]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 10, 18, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid rgba(168, 85, 247, 0.15)',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
        }}>
          Crop Your Photo
        </h3>
        <button
          onClick={onCancel}
          aria-label="Cancel crop"
          style={{ color: 'var(--text-muted)', padding: '0.25rem' }}
        >
          <X size={24} />
        </button>
      </div>

      {/* Cropper area */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          style={{
            containerStyle: { background: 'rgba(10, 10, 18, 1)' },
            cropAreaStyle: {
              border: '3px solid rgba(168, 85, 247, 0.6)',
              boxShadow: '0 0 0 9999px rgba(10, 10, 18, 0.7)',
            },
          }}
        />
      </div>

      {/* Controls */}
      <div style={{
        padding: '1rem 1.5rem 1.5rem',
        borderTop: '1px solid rgba(168, 85, 247, 0.15)',
      }}>
        {/* Zoom slider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}>
          <MagnifyingGlassPlus size={18} color="var(--text-muted)" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            aria-label="Zoom"
            style={{
              flex: 1,
              accentColor: 'var(--nebula-400)',
            }}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', minWidth: '2.5rem', textAlign: 'right' }}>
            {Math.round(zoom * 100)}%
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <CosmicButton variant="ghost" onClick={onCancel} icon={<X size={14} />}>
            Cancel
          </CosmicButton>
          <CosmicButton fullWidth onClick={handleConfirm} icon={<Check size={14} weight="bold" />}>
            Use This Photo
          </CosmicButton>
        </div>
      </div>
    </motion.div>
  );
}
