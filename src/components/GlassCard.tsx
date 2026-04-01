import { motion } from 'motion/react';
import { SPRING } from '../constants';
import type { CSSProperties, ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
  padding?: string;
  animate?: boolean;
}

export function GlassCard({ children, style, className, onClick, padding = '1.5rem', animate = true }: GlassCardProps) {
  const outerStyle: CSSProperties = {
    background: 'rgba(26, 26, 46, 0.4)',
    border: '1px solid rgba(168, 85, 247, 0.12)',
    borderRadius: '1.5rem',
    padding: '2px',
    ...style,
  };

  const innerStyle: CSSProperties = {
    background: 'rgba(18, 18, 30, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 'calc(1.5rem - 2px)',
    padding,
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.3)',
    position: 'relative' as const,
    overflow: 'hidden',
  };

  const Wrapper = animate ? motion.div : 'div';
  const animProps = animate ? {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: SPRING.smooth,
  } : {};

  return (
    <Wrapper style={outerStyle} className={className} onClick={onClick} {...animProps}>
      <div style={innerStyle}>
        {children}
      </div>
    </Wrapper>
  );
}
