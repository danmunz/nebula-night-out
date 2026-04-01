import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import { SwipeCard } from './SwipeCard';
import type { Profile, SwipeDirection } from '../types';
import { SPRING } from '../constants';
import { X, Heart, Star } from '@phosphor-icons/react';

interface CardStackProps {
  profiles: Profile[];
  onSwipe: (profile: Profile, direction: SwipeDirection) => void;
  onEmpty: () => void;
}

export function CardStack({ profiles, onSwipe, onEmpty }: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setExitDirection] = useState<SwipeDirection | null>(null);

  const visible = profiles.slice(currentIndex, currentIndex + 3);

  const handleSwipe = useCallback((direction: SwipeDirection) => {
    if (currentIndex >= profiles.length) return;
    setExitDirection(direction);
    onSwipe(profiles[currentIndex], direction);

    setTimeout(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        if (next >= profiles.length) {
          setTimeout(onEmpty, 100);
        }
        return next;
      });
      setExitDirection(null);
    }, 200);
  }, [currentIndex, profiles, onSwipe, onEmpty]);

  // Keyboard controls
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') handleSwipe('left');
      else if (e.key === 'ArrowRight') handleSwipe('right');
      else if (e.key === 'ArrowUp') { e.preventDefault(); handleSwipe('up'); }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe]);

  if (visible.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={SPRING.smooth}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '3rem 1.5rem', textAlign: 'center', height: '100%', minHeight: 400,
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌌</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          You've seen everyone in the galaxy!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: 300 }}>
          Check your matches or come back when new travelers arrive in your sector.
        </p>
      </motion.div>
    );
  }

  // exitDirection is tracked for future animation enhancements

  return (
    <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Card area */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <AnimatePresence>
          {visible.map((profile, i) => (
            <SwipeCard
              key={profile.id}
              profile={profile}
              onSwipe={handleSwipe}
              isTop={i === 0}
              index={i}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '1.25rem',
        padding: '0.5rem 0', position: 'relative', zIndex: 20,
        marginTop: 'auto',
      }}>
        <motion.button
          onClick={() => handleSwipe('left')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Pass"
          style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(18, 18, 30, 0.9)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}
        >
          <X size={24} weight="bold" color="#EF4444" />
        </motion.button>

        <motion.button
          onClick={() => handleSwipe('up')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Super Like"
          style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(18, 18, 30, 0.9)',
            border: '2px solid rgba(245, 158, 11, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            alignSelf: 'center',
          }}
        >
          <Star size={20} weight="fill" color="#F59E0B" />
        </motion.button>

        <motion.button
          onClick={() => handleSwipe('right')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Like"
          style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(18, 18, 30, 0.9)',
            border: '2px solid rgba(52, 211, 153, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}
        >
          <Heart size={24} weight="fill" color="#34D399" />
        </motion.button>
      </div>

      {/* Keyboard hint */}
      <div style={{
        textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)',
        padding: '0.5rem 0',
      }}>
        ← Pass · ↑ Super Like · → Like
      </div>
    </div>
  );
}
