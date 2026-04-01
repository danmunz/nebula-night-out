import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { StarField } from './components/StarField';
import { NebulaBg } from './components/NebulaBg';
import { ApiKeyScreen, OnboardingScreen } from './screens/OnboardingScreen';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { MatchesScreen } from './screens/MatchesScreen';
import { MessagesScreen } from './screens/MessagesScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SPRING } from './constants';
import type { UserProfile, Match, Conversation, Message, Screen } from './types';
import {
  Compass, Heart, ChatCircleDots, UserCircle,
} from '@phosphor-icons/react';

const envApiKey = import.meta.env.VITE_OPENAI_API_KEY || null;

export default function App() {
  const [apiKey, setApiKey] = useLocalStorage<string | null>('apiKey', envApiKey);
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [hasOnboarded, setHasOnboarded] = useLocalStorage<boolean>('hasOnboarded', false);
  const [matches, setMatches] = useLocalStorage<Match[]>('matches', []);
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('conversations', []);
  const [swipedIds, setSwipedIds] = useLocalStorage<string[]>('swipedIds', []);
  const [screen, setScreen] = useState<Screen>(() => {
    if (!hasOnboarded || !userProfile) return 'onboarding';
    return 'discover';
  });
  const [chatProfileId, setChatProfileId] = useState<string | null>(null);
  const [showApiKeyScreen, setShowApiKeyScreen] = useState(!apiKey && !envApiKey && !hasOnboarded);

  // All hooks MUST be above any early returns (Rules of Hooks)
  const handleSwipe = useCallback((profileId: string) => {
    setSwipedIds(prev => [...prev, profileId]);
  }, [setSwipedIds]);

  const handleMatch = useCallback((match: Match) => {
    setMatches(prev => [...prev, match]);
    setConversations(prev => {
      if (prev.find(c => c.profileId === match.profileId)) return prev;
      return [...prev, { profileId: match.profileId, messages: [], lastActivity: match.timestamp, unread: false }];
    });
  }, [setMatches, setConversations]);

  const handleSendMessage = useCallback((profileId: string, userMsg: Message, aiMsg: Message) => {
    setConversations(prev => {
      const existing = prev.find(c => c.profileId === profileId);
      if (existing) {
        return prev.map(c =>
          c.profileId === profileId
            ? { ...c, messages: [...c.messages, userMsg, aiMsg], lastActivity: aiMsg.timestamp, unread: true }
            : c
        );
      }
      return [...prev, { profileId, messages: [userMsg, aiMsg], lastActivity: aiMsg.timestamp, unread: true }];
    });
  }, [setConversations]);

  const handleMarkRead = useCallback((profileId: string) => {
    setConversations(prev =>
      prev.map(c => c.profileId === profileId ? { ...c, unread: false } : c)
    );
  }, [setConversations]);

  const openChat = useCallback((profileId: string) => {
    setChatProfileId(profileId);
    setScreen('chat');
  }, []);

  const handleReset = useCallback(() => {
    window.location.reload();
  }, []);

  const unreadCount = conversations.filter(c => c.unread).length;

  // Show API key screen first if never onboarded
  if (showApiKeyScreen && !hasOnboarded) {
    return (
      <>
        <StarField />
        <NebulaBg />
        <ApiKeyScreen
          onSubmit={(key) => { setApiKey(key); setShowApiKeyScreen(false); }}
          onSkip={() => setShowApiKeyScreen(false)}
        />
      </>
    );
  }

  // Onboarding
  if (!hasOnboarded || !userProfile) {
    return (
      <>
        <StarField />
        <NebulaBg />
        <OnboardingScreen
          onComplete={(profile) => {
            setUserProfile(profile);
            setHasOnboarded(true);
            setScreen('discover');
          }}
        />
      </>
    );
  }

  // Chat screen is full-screen overlay
  if (screen === 'chat' && chatProfileId) {
    return (
      <>
        <StarField />
        <NebulaBg />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100dvh' }}>
          <ChatScreen
            profileId={chatProfileId}
            conversation={conversations.find(c => c.profileId === chatProfileId)}
            apiKey={apiKey}
            onSendMessage={handleSendMessage}
            onBack={() => {
              setChatProfileId(null);
              setScreen('messages');
            }}
            onMarkRead={handleMarkRead}
          />
        </div>
      </>
    );
  }

  const tabs: { id: Screen; label: string; icon: typeof Compass }[] = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'matches', label: 'Matches', icon: Heart },
    { id: 'messages', label: 'Messages', icon: ChatCircleDots },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <>
      <StarField />
      <NebulaBg />
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        height: '100dvh', maxWidth: 520, margin: '0 auto', width: '100%',
      }}>
        {/* Header */}
        <header style={{
          padding: '0.75rem 1rem 0.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #A855F7, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}>
            Nebula Night Out
          </h1>
        </header>

        {/* Content area */}
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            {screen === 'discover' && (
              <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <DiscoverScreen
                  userProfile={userProfile}
                  swipedIds={swipedIds}
                  matches={matches}
                  onSwipe={handleSwipe}
                  onMatch={handleMatch}
                  onNavigateToChat={openChat}
                />
              </motion.div>
            )}
            {screen === 'matches' && (
              <motion.div key="matches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <MatchesScreen matches={matches} onOpenChat={openChat} />
              </motion.div>
            )}
            {screen === 'messages' && (
              <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <MessagesScreen conversations={conversations} onOpenChat={openChat} />
              </motion.div>
            )}
            {screen === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                <ProfileScreen
                  userProfile={userProfile}
                  apiKey={apiKey}
                  onUpdateProfile={setUserProfile}
                  onUpdateApiKey={setApiKey}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Bottom tab bar */}
        <nav style={{
          display: 'flex',
          borderTop: '1px solid var(--glass-border)',
          background: 'rgba(10, 10, 18, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
          paddingTop: '0.5rem',
          flexShrink: 0,
        }}>
          {tabs.map(tab => {
            const isActive = screen === tab.id;
            const Icon = tab.icon;
            const showBadge = tab.id === 'messages' && unreadCount > 0;

            return (
              <button
                key={tab.id}
                onClick={() => setScreen(tab.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  padding: '0.25rem',
                  color: isActive ? 'var(--nebula-400)' : 'var(--text-muted)',
                  transition: 'color 0.2s var(--ease-out-expo)',
                  position: 'relative',
                }}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div style={{ position: 'relative' }}>
                  <Icon size={24} weight={isActive ? 'fill' : 'regular'} />
                  {showBadge && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={SPRING.bouncy}
                      style={{
                        position: 'absolute', top: -4, right: -6,
                        width: 16, height: 16, borderRadius: '50%',
                        background: 'var(--cosmic-pink)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.6rem', fontWeight: 700, color: '#fff',
                      }}
                    >
                      {unreadCount}
                    </motion.div>
                  )}
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 600 : 400 }}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    style={{
                      position: 'absolute', top: -1,
                      width: 24, height: 2, borderRadius: 1,
                      background: 'var(--nebula-400)',
                    }}
                    transition={SPRING.snappy}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
