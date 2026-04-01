import { motion } from 'motion/react';
import type { CSSProperties } from 'react';

interface ProgressStepsProps {
  total: number;
  current: number;
  style?: CSSProperties;
}

export function ProgressSteps({ total, current, style }: ProgressStepsProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center',
      ...style,
    }}>
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          style={{
            height: 4,
            borderRadius: 2,
            background: i <= current
              ? 'linear-gradient(90deg, #7C3AED, #A855F7)'
              : 'rgba(155, 143, 184, 0.2)',
            overflow: 'hidden',
          }}
          animate={{ width: i <= current ? 32 : 16 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      ))}
    </div>
  );
}
