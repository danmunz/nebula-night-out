import type { CSSProperties } from 'react';
import { getAvatarUrl } from '../constants';

interface AvatarProps {
  seed: string;
  size?: number;
  style?: CSSProperties;
  glowColor?: string;
}

export function Avatar({ seed, size = 80, style, glowColor = 'rgba(168,85,247,0.4)' }: AvatarProps) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      padding: 3,
      background: `linear-gradient(135deg, ${glowColor}, rgba(236,72,153,0.3))`,
      boxShadow: `0 0 20px ${glowColor}`,
      flexShrink: 0,
      ...style,
    }}>
      <img
        src={getAvatarUrl(seed)}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          objectFit: 'cover',
          background: '#12121E',
        }}
      />
    </div>
  );
}
