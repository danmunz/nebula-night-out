import type { CSSProperties } from 'react';

export function NebulaBg() {
  const style: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    pointerEvents: 'none',
    background: `
      radial-gradient(ellipse 80% 60% at 20% 80%, rgba(124,58,237,0.15) 0%, transparent 70%),
      radial-gradient(ellipse 60% 80% at 80% 20%, rgba(236,72,153,0.1) 0%, transparent 70%),
      radial-gradient(ellipse 50% 50% at 50% 50%, rgba(56,189,248,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 90% 40% at 60% 90%, rgba(245,158,11,0.06) 0%, transparent 70%)
    `,
  };

  return <div style={style} />;
}
