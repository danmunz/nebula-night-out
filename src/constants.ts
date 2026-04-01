export const SPRING = {
  snappy: { type: 'spring' as const, stiffness: 500, damping: 30 },
  smooth: { type: 'spring' as const, stiffness: 300, damping: 25 },
  gentle: { type: 'spring' as const, stiffness: 200, damping: 20 },
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 15 },
};

export const SWIPE_THRESHOLD = 100;
export const SWIPE_VELOCITY_THRESHOLD = 500;
export const MATCH_PROBABILITY = 0.6;

export const SPECIES = [
  'Human', 'Martian', 'Andromedan', 'Nebulari', 'Void Elf',
  'Plutonian', 'Celestari', 'Zyphorian', 'Lunari', 'Saturnite',
  'Neptunian',
];

export const INTERESTS_POOL = [
  'Zero-G Yoga', 'Wormhole Surfing', 'Vintage Earth Music', 'Quantum Cooking',
  'Asteroid Mining', 'Nebula Photography', 'Space Karaoke', 'Dark Matter Sculpting',
  'Cosmic Chess', 'Plasma Dancing', 'Stargazing', 'Antimatter Brewing',
  'Galactic Poetry', 'Ion Surfing', 'Meteor Dodgeball', 'Holodeck Adventures',
  'Time Crystal Collecting', 'Supernova Chasing', 'Binary Sunset Watching',
  'Alien Cuisine', 'Telepathy Training', 'Gravity Skateboarding',
  'Quantum Mechanics Debates', 'Interstellar Road Trips', 'Comet Riding',
  'Black Hole Diving', 'Astro-Painting', 'Moon Hiking', 'Xenobotany',
  'Pulsar DJ Sets', 'Solar Sailing', 'Dimensional Chess',
];

export const ZODIACS = [
  'Pulsar', 'Quasar', 'Supernova', 'Nebula', 'Comet',
  'Eclipse', 'Wormhole', 'Black Hole', 'Aurora', 'Meteor',
  'Void', 'Singularity',
];

export const AVATAR_STYLES = [
  'adventurer', 'adventurer-neutral', 'avataaars', 'bottts', 'fun-emoji',
];

export function getAvatarUrl(seed: string, style = 'adventurer'): string {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1a1a2e,12121e,2d1b69&radius=50`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs((Math.sin(hash) * 10000) % 1);
}

export function willMatch(profileId: string, userId: string): boolean {
  return seededRandom(profileId + userId + 'match') < MATCH_PROBABILITY;
}
