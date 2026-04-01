import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { CosmicButton } from '../components/CosmicButton';
import { ProgressSteps } from '../components/ProgressSteps';
import { Avatar } from '../components/Avatar';
import { SPECIES, INTERESTS_POOL, SPRING, getAvatarUrl } from '../constants';
import type { UserProfile } from '../types';
import { Eye, EyeSlash, ArrowRight, ArrowLeft, Rocket } from '@phosphor-icons/react';

interface ApiKeyScreenProps {
  onSubmit: (key: string) => void;
  onSkip: () => void;
}

export function ApiKeyScreen({ onSubmit, onSkip }: ApiKeyScreenProps) {
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', padding: '1.5rem' }}
    >
      <GlassCard style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔑</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Power Your Conversations
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Add your OpenAI API key to enable AI-powered chats with your matches. They'll respond in character with unique personalities.
          </p>
        </div>

        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <input
            type={show ? 'text' : 'password'}
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="sk-..."
            style={{
              width: '100%',
              padding: '0.75rem 3rem 0.75rem 1rem',
              background: 'rgba(10, 10, 18, 0.6)',
              border: '1px solid var(--glass-border)',
              borderRadius: '0.75rem',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '0.95rem',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--nebula-400)'}
            onBlur={e => e.target.style.borderColor = 'rgba(168, 85, 247, 0.15)'}
          />
          <button
            onClick={() => setShow(!show)}
            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            aria-label={show ? 'Hide API key' : 'Show API key'}
          >
            {show ? <EyeSlash size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <CosmicButton fullWidth onClick={() => onSubmit(key)} disabled={!key.startsWith('sk-')}>
          Save & Launch
        </CosmicButton>

        <button
          onClick={onSkip}
          style={{ width: '100%', textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '0.5rem' }}
        >
          Skip for now — I'll add it later
        </button>
      </GlassCard>
    </motion.div>
  );
}

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
}

const AVATAR_SEEDS = [
  'cosmic-1', 'stellar-2', 'galactic-3', 'nebula-4', 'astro-5',
  'void-6', 'quantum-7', 'lunar-8', 'solar-9', 'orbital-10',
  'plasma-11', 'photon-12',
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Human');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [avatarSeed, setAvatarSeed] = useState(AVATAR_SEEDS[0]);
  const [minAge, setMinAge] = useState(21);
  const [maxAge, setMaxAge] = useState(300);
  const [maxDistance, setMaxDistance] = useState(50);

  const canProceed = [
    name.length >= 2,
    bio.length >= 10 && interests.length >= 2,
    true,
    true,
  ][step];

  function next() {
    if (step < 3) setStep(step + 1);
    else {
      onComplete({
        name,
        species,
        bio,
        interests,
        avatar: getAvatarUrl(avatarSeed),
        preferences: { speciesFilter: [], minAge, maxAge, maxDistance },
      });
    }
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  const toggleInterest = (i: string) => {
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100dvh',
    padding: '1.5rem',
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: 480,
    width: '100%',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={containerStyle}>
      <div style={cardStyle}>
        <ProgressSteps total={4} current={step} style={{ marginBottom: '1.5rem' }} />

        <GlassCard>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={SPRING.smooth}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Who are you, traveler?
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Tell us your name and choose your species.
                </p>

                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Your Name
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your cosmic name..."
                  maxLength={30}
                  style={{
                    width: '100%', padding: '0.75rem 1rem', background: 'rgba(10, 10, 18, 0.6)',
                    border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'var(--text-primary)',
                    outline: 'none', fontSize: '1rem', marginBottom: '1.25rem',
                  }}
                />

                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Species
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {SPECIES.map(s => (
                    <motion.button
                      key={s}
                      onClick={() => setSpecies(s)}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '100px',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        background: species === s ? 'linear-gradient(135deg, #7C3AED, #A855F7)' : 'rgba(10, 10, 18, 0.6)',
                        border: species === s ? 'none' : '1px solid var(--glass-border)',
                        color: species === s ? '#F0E6FF' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s var(--ease-out-expo)',
                      }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={SPRING.smooth}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Tell us about yourself
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Write a bio and pick your interests.
                </p>

                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="What makes you unique in this galaxy?"
                  maxLength={300}
                  rows={3}
                  style={{
                    width: '100%', padding: '0.75rem 1rem', background: 'rgba(10, 10, 18, 0.6)',
                    border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'var(--text-primary)',
                    outline: 'none', fontSize: '0.95rem', resize: 'vertical', marginBottom: '1.25rem',
                    fontFamily: 'inherit', lineHeight: 1.5,
                  }}
                />

                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Interests (pick 2+)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: 200, overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {INTERESTS_POOL.map(i => (
                    <motion.button
                      key={i}
                      onClick={() => toggleInterest(i)}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '100px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        background: interests.includes(i) ? 'rgba(124, 58, 237, 0.3)' : 'rgba(10, 10, 18, 0.6)',
                        border: interests.includes(i) ? '1px solid var(--nebula-400)' : '1px solid var(--glass-border)',
                        color: interests.includes(i) ? 'var(--nebula-400)' : 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      {i}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={SPRING.smooth}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  What are you looking for?
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Set your preferences for discovering matches.
                </p>

                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Age Range: {minAge} — {maxAge} Earth Years
                </label>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                  <input type="range" min={21} max={500} value={minAge} onChange={e => setMinAge(Number(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--nebula-400)' }} />
                  <input type="range" min={21} max={500} value={maxAge} onChange={e => setMaxAge(Number(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--nebula-400)' }} />
                </div>

                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Max Distance: {maxDistance} light-years
                </label>
                <input type="range" min={1} max={100} value={maxDistance} onChange={e => setMaxDistance(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--nebula-400)', marginBottom: '1rem' }} />

                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                  Don't worry — you can always change these later.
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={SPRING.smooth}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Choose your look
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Pick an avatar that represents you across the cosmos.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Avatar seed={avatarSeed} size={120} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  {AVATAR_SEEDS.map(seed => (
                    <motion.button
                      key={seed}
                      onClick={() => setAvatarSeed(seed)}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        padding: 3,
                        borderRadius: '50%',
                        background: avatarSeed === seed ? 'linear-gradient(135deg, #7C3AED, #EC4899)' : 'rgba(10, 10, 18, 0.6)',
                        border: avatarSeed === seed ? 'none' : '2px solid var(--glass-border)',
                        cursor: 'pointer',
                        aspectRatio: '1',
                      }}
                    >
                      <img
                        src={getAvatarUrl(seed)}
                        alt=""
                        style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#12121E' }}
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            {step > 0 && (
              <CosmicButton variant="ghost" onClick={back} icon={<ArrowLeft size={14} />}>
                Back
              </CosmicButton>
            )}
            <CosmicButton
              fullWidth
              onClick={next}
              disabled={!canProceed}
              icon={step === 3 ? <Rocket size={14} weight="fill" /> : <ArrowRight size={14} />}
            >
              {step === 3 ? 'Launch into the Cosmos' : 'Continue'}
            </CosmicButton>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
