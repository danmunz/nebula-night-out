import { useState } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import type { Profile, SwipeDirection } from '../types';
import { SPRING, SWIPE_THRESHOLD, SWIPE_VELOCITY_THRESHOLD } from '../constants';
import { Avatar } from '../components/Avatar';
import { MapPin, Briefcase, Star } from '@phosphor-icons/react';

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: SwipeDirection) => void;
  isTop: boolean;
  index: number;
}

export function SwipeCard({ profile, onSwipe, isTop, index }: SwipeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);

  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const superLikeOpacity = useTransform(y, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const scale = isTop ? 1 : 1 - index * 0.04;
  const yOffset = index * 8;

  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info;
    const swipeX = Math.abs(offset.x) > SWIPE_THRESHOLD || Math.abs(velocity.x) > SWIPE_VELOCITY_THRESHOLD;
    const swipeUp = offset.y < -SWIPE_THRESHOLD || velocity.y < -SWIPE_VELOCITY_THRESHOLD;

    if (swipeUp) {
      onSwipe('up');
    } else if (swipeX && offset.x > 0) {
      onSwipe('right');
    } else if (swipeX && offset.x < 0) {
      onSwipe('left');
    }
  }

  const cardStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    maxWidth: 380,
    left: '50%',
    top: 0,
    bottom: 0,
    cursor: isTop ? 'grab' : 'default',
    touchAction: 'none',
    zIndex: 10 - index,
    userSelect: 'none',
  };

  const innerStyle: React.CSSProperties = {
    background: 'rgba(18, 18, 30, 0.9)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    border: '1px solid rgba(168, 85, 247, 0.12)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.06)',
    overflow: 'hidden',
    position: 'relative' as const,
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  };

  return (
    <motion.div
      style={{
        ...cardStyle,
        x: isTop ? x : 0,
        y: isTop ? y : 0,
        rotate: isTop ? rotate : 0,
        scale,
        translateX: '-50%',
        translateY: yOffset,
      }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale, opacity: 1 }}
      exit={{
        x: 0,
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.3 },
      }}
      transition={SPRING.smooth}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <div style={innerStyle}>
        {/* Swipe indicators */}
        {isTop && (
          <>
            <motion.div style={{
              position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 20,
              padding: '0.4rem 1rem', borderRadius: '0.5rem',
              border: '3px solid #34D399', color: '#34D399',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem',
              opacity: likeOpacity, transform: 'rotate(-15deg)',
            }}>
              LIKE
            </motion.div>
            <motion.div style={{
              position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 20,
              padding: '0.4rem 1rem', borderRadius: '0.5rem',
              border: '3px solid #EF4444', color: '#EF4444',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem',
              opacity: nopeOpacity, transform: 'rotate(15deg)',
            }}>
              NOPE
            </motion.div>
            <motion.div style={{
              position: 'absolute', top: '1.5rem', left: '50%', zIndex: 20,
              padding: '0.4rem 1rem', borderRadius: '0.5rem',
              border: '3px solid #F59E0B', color: '#F59E0B',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem',
              opacity: superLikeOpacity, transform: 'translateX(-50%)',
            }}>
              SUPER LIKE ★
            </motion.div>
          </>
        )}

        {/* Avatar area */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem 2rem 0.75rem', background: 'linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)',
          flexShrink: 0,
        }}>
          <Avatar seed={profile.photos[0].split('seed=')[1]?.split('&')[0] || profile.id} size={120} />
        </div>

        {/* Info */}
        <div style={{ padding: '0 1.5rem 1.25rem', flex: 1, overflow: 'auto', minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {profile.name}
            </h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 400 }}>
              {profile.age}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.1rem' }}>
            <span style={{
              padding: '0.15rem 0.5rem', borderRadius: '100px', fontSize: '0.75rem',
              background: 'rgba(124, 58, 237, 0.15)', color: 'var(--nebula-400)', fontWeight: 500,
            }}>
              {profile.species}
            </span>
            <span>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              {profile.zodiac}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} weight="fill" style={{ color: 'var(--cosmic-pink)' }} />
              {profile.homeworld}
            </span>
            <span>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={14} weight="fill" style={{ color: 'var(--stardust)' }} />
              {profile.distance}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            <Briefcase size={14} />
            {profile.occupation}
          </div>

          <p style={{
            color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6,
            marginBottom: '0.75rem',
            display: expanded ? 'block' : '-webkit-box',
            WebkitLineClamp: expanded ? undefined : 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: expanded ? 'visible' : 'hidden',
          }}>
            {profile.bio}
          </p>

          {!expanded && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
              style={{ color: 'var(--nebula-400)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.75rem' }}
            >
              Read more
            </button>
          )}

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={SPRING.smooth}
            >
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Looking For</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{profile.lookingFor}</div>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Dealbreakers</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{profile.dealbreakers}</div>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Height</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{profile.height}</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
                style={{ color: 'var(--nebula-400)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}
              >
                Show less
              </button>
            </motion.div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {profile.interests.slice(0, expanded ? undefined : 4).map(i => (
              <span key={i} style={{
                padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem',
                background: 'rgba(10, 10, 18, 0.6)', border: '1px solid var(--glass-border)',
                color: 'var(--text-muted)',
              }}>
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
