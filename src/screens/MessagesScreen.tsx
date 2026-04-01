import { motion } from 'motion/react';
import { Avatar } from '../components/Avatar';
import { SPRING } from '../constants';
import { profiles } from '../data/profiles';
import type { Conversation } from '../types';

interface MessagesScreenProps {
  conversations: Conversation[];
  onOpenChat: (profileId: string) => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export function MessagesScreen({ conversations, onOpenChat }: MessagesScreenProps) {
  const sorted = [...conversations].sort((a, b) => b.lastActivity - a.lastActivity);

  if (sorted.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '3rem 1.5rem', textAlign: 'center', flex: 1,
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          No messages yet
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 280, lineHeight: 1.6 }}>
          Match with someone and send the first message to start a cosmic conversation.
        </p>
      </motion.div>
    );
  }

  return (
    <div style={{ padding: '1rem 0 5rem', overflow: 'auto', flex: 1 }}>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700,
        marginBottom: '0.75rem', padding: '0 1rem',
      }}>
        Messages
      </h2>

      {sorted.map((conv, i) => {
        const profile = profiles.find(p => p.id === conv.profileId);
        if (!profile) return null;
        const lastMsg = conv.messages[conv.messages.length - 1];

        return (
          <motion.button
            key={conv.profileId}
            onClick={() => onOpenChat(conv.profileId)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING.smooth, delay: i * 0.05 }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem', textAlign: 'left',
              borderBottom: '1px solid rgba(168, 85, 247, 0.06)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            whileHover={{ backgroundColor: 'rgba(168, 85, 247, 0.05)' }}
          >
            <div style={{ position: 'relative' }}>
              <Avatar
                seed={profile.photos[0].split('seed=')[1]?.split('&')[0] || profile.id}
                size={52}
              />
              {conv.unread && (
                <div style={{
                  position: 'absolute', top: -2, right: -2,
                  width: 12, height: 12, borderRadius: '50%',
                  background: 'var(--cosmic-pink)',
                  border: '2px solid var(--void)',
                }} />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem' }}>
                  {profile.name}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', flexShrink: 0 }}>
                  {lastMsg ? timeAgo(lastMsg.timestamp) : ''}
                </span>
              </div>
              <div style={{
                color: conv.unread ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '0.85rem', fontWeight: conv.unread ? 500 : 400,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {lastMsg
                  ? (lastMsg.sender === 'user' ? 'You: ' : '') + lastMsg.content
                  : 'Start a conversation...'}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
