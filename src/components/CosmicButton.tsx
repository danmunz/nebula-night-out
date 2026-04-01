import { motion } from 'motion/react';
import { SPRING } from '../constants';
import type { CSSProperties, ReactNode } from 'react';

interface CosmicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: CSSProperties;
  fullWidth?: boolean;
  icon?: ReactNode;
}

const variants = {
  primary: {
    background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
    color: '#F0E6FF',
    border: 'none',
    boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
  },
  secondary: {
    background: 'rgba(26, 26, 46, 0.8)',
    color: '#F0E6FF',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  ghost: {
    background: 'transparent',
    color: '#9B8FB8',
    border: '1px solid rgba(155, 143, 184, 0.2)',
    boxShadow: 'none',
  },
};

const sizes = {
  sm: { padding: '0.5rem 1rem', fontSize: '0.85rem' },
  md: { padding: '0.75rem 1.5rem', fontSize: '0.95rem' },
  lg: { padding: '1rem 2rem', fontSize: '1.05rem' },
};

export function CosmicButton({ children, onClick, variant = 'primary', size = 'md', disabled, style, fullWidth, icon }: CosmicButtonProps) {
  const baseStyle: CSSProperties = {
    ...variants[variant],
    ...sizes[size],
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    borderRadius: '100px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : undefined,
    letterSpacing: '0.02em',
    transition: 'box-shadow 0.3s var(--ease-out-expo)',
    ...style,
  };

  return (
    <motion.button
      style={baseStyle}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.03, boxShadow: variant === 'primary' ? '0 6px 28px rgba(124,58,237,0.5)' : undefined }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING.snappy}
    >
      {children}
      {icon && (
        <motion.span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
          }}
        >
          {icon}
        </motion.span>
      )}
    </motion.button>
  );
}
