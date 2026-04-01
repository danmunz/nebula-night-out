import { motion } from 'motion/react';
import { Avatar } from '../components/Avatar';
import { SPRING } from '../constants';
import { profiles } from '../data/profiles';
import type { Match } from '../types';
import { ChatCircleDots } from '@phosphor-icons/react';

interface MatchesScreenProps {
  matches: Match[];
  onOpenChat: (profileId: string) => void;
}

export function MatchesScreen({ matches, onOpenChat }: MatchesScreenProps) {
  if (matches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '3rem 1.5rem', textAlign: 'center', flex: 1,
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💫</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          No matches yet
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 280, lineHeight: 1.6 }}>
          Keep swiping to find your cosmic connection. The galaxy is full of possibilities.
        </p>
      </motion.div>
    );
  }

  return (
    <div style={{ padding: '1rem 1rem 5rem', overflow: 'auto', flex: 1 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', paddingLeft: '0.25rem' }}>
        Your Matches ({matches.length})
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
        {matches.map((match, i) => {
          const profile = profiles.find(p => p.id === match.profileId);
          if (!profile) return null;

          return (
            <motion.button
              key={match.profileId}
              onClick={() => onOpenChat(match.profileId)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING.smooth, delay: i * 0.06 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'rgba(18, 18, 30, 0.8)',
                border: '1px solid var(--glass-border)',
                borderRadius: '1.25rem',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              {match.isSuperLike && (
                <div style={{
                  position: 'absolute', top: '0.5rem', right: '0.5rem',
                  fontSize: '0.8rem', color: 'var(--stardust)',
                }}>
                  ⭐
                </div>
              )}

              <Avatar
                seed={profile.photos[0].split('seed=')[1]?.split('&')[0] || profile.id}
                size={64}
              />

              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem' }}>
                  {profile.name}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {profile.species} · {profile.age}
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.3rem 0.75rem', borderRadius: '100px',
                background: 'rgba(124, 58, 237, 0.15)',
                color: 'var(--nebula-400)', fontSize: '0.75rem', fontWeight: 500,
              }}>
                <ChatCircleDots size={12} weight="fill" />
                Chat
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
