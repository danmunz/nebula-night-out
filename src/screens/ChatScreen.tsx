import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar } from '../components/Avatar';
import { SPRING, generateId } from '../constants';
import { profiles } from '../data/profiles';
import type { Message, Conversation } from '../types';
import { useAIChat } from '../hooks/useAIChat';
import { ArrowLeft, PaperPlaneRight } from '@phosphor-icons/react';

interface ChatScreenProps {
  profileId: string;
  conversation: Conversation | undefined;
  apiKey: string | null;
  onSendMessage: (profileId: string, userMsg: Message, aiMsg: Message) => void;
  onBack: () => void;
  onMarkRead: (profileId: string) => void;
}

export function ChatScreen({ profileId, conversation, apiKey, onSendMessage, onBack, onMarkRead }: ChatScreenProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isLoading } = useAIChat(apiKey);

  const profile = profiles.find(p => p.id === profileId);
  const messages = useMemo(() => conversation?.messages || [], [conversation?.messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);

  useEffect(() => {
    if (conversation?.unread) onMarkRead(profileId);
  }, [profileId, conversation?.unread, onMarkRead]);

  const handleSend = useCallback(async () => {
    if (!profile) return;
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');

    const now = Date.now();
    const userMsg: Message = {
      id: generateId(),
      profileId,
      content: text,
      sender: 'user',
      timestamp: now,
    };

    // Optimistically add user message
    const aiContent = await sendMessage(profile, messages, text);

    const aiMsg: Message = {
      id: generateId(),
      profileId,
      content: aiContent || getOfflineResponse(profile),
      sender: 'match',
      timestamp: now + 1,
    };

    onSendMessage(profileId, userMsg, aiMsg);
  }, [input, isLoading, profile, messages, profileId, sendMessage, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  if (!profile) return null;

  const avatarSeed = profile.photos[0].split('seed=')[1]?.split('&')[0] || profile.id;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      maxHeight: '100dvh', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(10, 10, 18, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        flexShrink: 0,
      }}>
        <motion.button
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
          aria-label="Back"
          style={{ color: 'var(--nebula-400)', display: 'flex', padding: '0.25rem' }}
        >
          <ArrowLeft size={24} />
        </motion.button>

        <Avatar seed={avatarSeed} size={40} />

        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem' }}>
            {profile.name}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            {profile.species} · {profile.homeworld}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflow: 'auto', padding: '1rem',
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
      }}>
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}
          >
            <Avatar seed={avatarSeed} size={80} style={{ margin: '0 auto 1rem' }} />
            <p>You matched with <strong style={{ color: 'var(--text-primary)' }}>{profile.name}</strong></p>
            <p style={{ marginTop: '0.25rem' }}>{profile.species} · {profile.occupation}</p>
            <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
              Send the first message to start your cosmic conversation.
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={SPRING.snappy}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '80%',
                padding: '0.65rem 1rem',
                borderRadius: msg.sender === 'user'
                  ? '1rem 1rem 0.25rem 1rem'
                  : '1rem 1rem 1rem 0.25rem',
                background: msg.sender === 'user'
                  ? 'linear-gradient(135deg, #7C3AED, #6D28D9)'
                  : 'rgba(26, 26, 46, 0.8)',
                border: msg.sender === 'user'
                  ? 'none'
                  : '1px solid var(--glass-border)',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                color: 'var(--text-primary)',
                wordBreak: 'break-word',
              }}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            <div style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '1rem 1rem 1rem 0.25rem',
              background: 'rgba(26, 26, 46, 0.8)',
              border: '1px solid var(--glass-border)',
              display: 'flex', gap: '0.3rem', alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--text-muted)',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '0.75rem 1rem',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
        borderTop: '1px solid var(--glass-border)',
        background: 'rgba(10, 10, 18, 0.8)',
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
        flexShrink: 0,
      }}>
        {!apiKey && (
          <div style={{
            padding: '0.5rem 0.75rem', borderRadius: '0.75rem',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            color: 'var(--stardust)', fontSize: '0.75rem', textAlign: 'center',
          }}>
            Add an OpenAI API key in Settings to enable AI-powered conversations.
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            style={{
              flex: 1, padding: '0.65rem 1rem',
              background: 'rgba(26, 26, 46, 0.6)',
              border: '1px solid var(--glass-border)',
              borderRadius: '1.25rem',
              color: 'var(--text-primary)',
              outline: 'none', resize: 'none',
              fontSize: '0.9rem', lineHeight: 1.5,
              maxHeight: 120,
              fontFamily: 'inherit',
            }}
          />
          <motion.button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: input.trim() ? 'linear-gradient(135deg, #7C3AED, #A855F7)' : 'rgba(26, 26, 46, 0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              opacity: input.trim() ? 1 : 0.4,
              transition: 'all 0.2s',
            }}
            aria-label="Send message"
          >
            <PaperPlaneRight size={18} weight="fill" color="#F0E6FF" />
            </motion.button>
        </div>
      </div>
    </div>
  );
}

function getOfflineResponse(profile: { name: string; species: string }): string {
  const responses = [
    `Hey, ${profile.name} here! I'd love to chat but the subspace relay seems to be down. Try adding an API key in settings!`,
    `*${profile.name} waves from across the galaxy* The communication channel needs an API key to connect properly.`,
    `Transmission from ${profile.name}: This channel needs an OpenAI API key to establish a proper link!`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
