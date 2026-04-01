import { motion } from 'motion/react';
import { SPRING } from '../constants';
import { Avatar } from './Avatar';
import { CosmicButton } from './CosmicButton';
import type { Profile, UserProfile } from '../types';
import { ChatCircleDots, ArrowRight } from '@phosphor-icons/react';

interface MatchOverlayProps {
  profile: Profile;
  userProfile: UserProfile;
  onMessage: () => void;
  onKeepSwiping: () => void;
}

export function MatchOverlay({ profile, userProfile, onMessage, onKeepSwiping }: MatchOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(10, 10, 18, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '2rem',
      }}
    >
      {/* Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5],
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400,
          }}
          transition={{ duration: 1.5 + Math.random(), delay: Math.random() * 0.5 }}
          style={{
            position: 'absolute',
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            borderRadius: '50%',
            background: i % 3 === 0 ? 'var(--nebula-400)' : i % 3 === 1 ? 'var(--cosmic-pink)' : 'var(--stardust)',
            pointerEvents: 'none',
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...SPRING.bouncy, delay: 0.2 }}
        style={{ textAlign: 'center' }}
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING.smooth, delay: 0.3 }}
          style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: 700, marginBottom: '2rem',
            background: 'linear-gradient(135deg, #A855F7, #EC4899, #F59E0B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          It's a Cosmic Match! ✨
        </motion.h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ...SPRING.smooth, delay: 0.4 }}
          >
            <Avatar seed={userProfile.avatar.split('seed=')[1]?.split('&')[0] || 'user'} size={100} glowColor="rgba(168,85,247,0.5)" />
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center' }}>
              {userProfile.name}
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...SPRING.bouncy, delay: 0.5 }}
            style={{ fontSize: '2rem' }}
          >
            💫
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ...SPRING.smooth, delay: 0.4 }}
          >
            <Avatar seed={profile.photos[0].split('seed=')[1]?.split('&')[0] || profile.id} size={100} glowColor="rgba(236,72,153,0.5)" />
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'center' }}>
              {profile.name}
            </p>
          </motion.div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: 320, lineHeight: 1.6 }}>
          You and {profile.name} liked each other. The stars have aligned — across {profile.distance}.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: 280 }}>
          <CosmicButton fullWidth onClick={onMessage} icon={<ChatCircleDots size={16} weight="fill" />}>
            Send a Message
          </CosmicButton>
          <CosmicButton fullWidth variant="ghost" onClick={onKeepSwiping} icon={<ArrowRight size={14} />}>
            Keep Swiping
          </CosmicButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
