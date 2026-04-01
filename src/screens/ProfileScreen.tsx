import { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { CosmicButton } from '../components/CosmicButton';
import { Avatar } from '../components/Avatar';
import { SPECIES, INTERESTS_POOL, SPRING } from '../constants';
import type { UserProfile } from '../types';
import { PencilSimple, Key, Trash } from '@phosphor-icons/react';
import { clearAllData } from '../hooks/useLocalStorage';

interface ProfileScreenProps {
  userProfile: UserProfile;
  apiKey: string | null;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdateApiKey: (key: string | null) => void;
  onReset: () => void;
}

export function ProfileScreen({ userProfile, apiKey, onUpdateProfile, onUpdateApiKey, onReset }: ProfileScreenProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [bio, setBio] = useState(userProfile.bio);
  const [species, setSpecies] = useState(userProfile.species);
  const [interests, setInterests] = useState(userProfile.interests);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(apiKey || '');

  function save() {
    onUpdateProfile({ ...userProfile, name, bio, species, interests });
    setEditing(false);
  }

  function saveApiKey() {
    onUpdateApiKey(apiKeyInput || null);
    setShowApiKey(false);
  }

  const avatarSeed = userProfile.avatar.split('seed=')[1]?.split('&')[0] || 'user';

  return (
    <div style={{ padding: '1rem 1rem 5rem', overflow: 'auto', flex: 1 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', paddingLeft: '0.25rem' }}>
        Your Profile
      </h2>

      <GlassCard>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Avatar seed={avatarSeed} size={100} />

          {!editing ? (
            <>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>
                  {userProfile.name}
                </h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {userProfile.species}
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.6 }}>
                {userProfile.bio}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center' }}>
                {userProfile.interests.map(i => (
                  <span key={i} style={{
                    padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem',
                    background: 'rgba(124, 58, 237, 0.15)', color: 'var(--nebula-400)', fontWeight: 500,
                  }}>
                    {i}
                  </span>
                ))}
              </div>

              <CosmicButton variant="secondary" onClick={() => setEditing(true)} icon={<PencilSimple size={14} />}>
                Edit Profile
              </CosmicButton>
            </>
          ) : (
            <>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(10, 10, 18, 0.6)',
                  border: '1px solid var(--glass-border)', borderRadius: '0.75rem',
                  color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem',
                }}
              />

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', width: '100%' }}>
                {SPECIES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSpecies(s)}
                    style={{
                      padding: '0.3rem 0.7rem', borderRadius: '100px', fontSize: '0.8rem',
                      background: species === s ? 'rgba(124, 58, 237, 0.3)' : 'rgba(10, 10, 18, 0.6)',
                      border: species === s ? '1px solid var(--nebula-400)' : '1px solid var(--glass-border)',
                      color: species === s ? 'var(--nebula-400)' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                style={{
                  width: '100%', padding: '0.6rem 0.75rem', background: 'rgba(10, 10, 18, 0.6)',
                  border: '1px solid var(--glass-border)', borderRadius: '0.75rem',
                  color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem',
                  resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5,
                }}
              />

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', width: '100%' }}>
                {INTERESTS_POOL.slice(0, 20).map(i => (
                  <button
                    key={i}
                    onClick={() => setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                    style={{
                      padding: '0.2rem 0.5rem', borderRadius: '100px', fontSize: '0.7rem',
                      background: interests.includes(i) ? 'rgba(124, 58, 237, 0.2)' : 'rgba(10, 10, 18, 0.6)',
                      border: interests.includes(i) ? '1px solid var(--nebula-400)' : '1px solid var(--glass-border)',
                      color: interests.includes(i) ? 'var(--nebula-400)' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {i}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <CosmicButton fullWidth onClick={save}>Save</CosmicButton>
                <CosmicButton variant="ghost" onClick={() => setEditing(false)}>Cancel</CosmicButton>
              </div>
            </>
          )}
        </div>
      </GlassCard>

      {/* Settings section */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', paddingLeft: '0.25rem', color: 'var(--text-secondary)' }}>
          Settings
        </h3>

        <GlassCard padding="0" animate={false}>
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '1rem 1.25rem', textAlign: 'left',
              borderBottom: showApiKey ? '1px solid var(--glass-border)' : 'none',
            }}
          >
            <Key size={20} color="var(--nebula-400)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>API Key</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {apiKey ? 'Connected' : 'Not configured'}
              </div>
            </div>
          </button>

          {showApiKey && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={SPRING.smooth}
              style={{ padding: '0.75rem 1.25rem', overflow: 'hidden' }}
            >
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                placeholder="sk-..."
                style={{
                  width: '100%', padding: '0.5rem 0.75rem', marginBottom: '0.5rem',
                  background: 'rgba(10, 10, 18, 0.6)', border: '1px solid var(--glass-border)',
                  borderRadius: '0.5rem', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem',
                }}
              />
              <CosmicButton size="sm" onClick={saveApiKey}>Save Key</CosmicButton>
            </motion.div>
          )}
        </GlassCard>

        <div style={{ marginTop: '0.75rem' }}>
          <GlassCard padding="0" animate={false}>
            <button
              onClick={() => {
                if (confirm('Are you sure? This will erase all your data.')) {
                  clearAllData();
                  onReset();
                }
              }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '1rem 1.25rem', textAlign: 'left', color: '#EF4444',
              }}
            >
              <Trash size={20} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Reset Everything</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Clear all data and start fresh
                </div>
              </div>
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
