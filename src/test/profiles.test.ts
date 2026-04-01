import { describe, it, expect } from 'vitest';
import { profiles } from '../data/profiles';

describe('profiles data', () => {
  it('contains exactly 120 profiles', () => {
    expect(profiles).toHaveLength(120);
  });

  it('all profiles have unique IDs', () => {
    const ids = profiles.map((p) => p.id);
    expect(new Set(ids).size).toBe(120);
  });

  it('all profiles have required fields', () => {
    profiles.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.species).toBeTruthy();
      expect(p.age).toBeGreaterThan(0);
      expect(p.homeworld).toBeTruthy();
      expect(p.occupation).toBeTruthy();
      expect(p.bio.length).toBeGreaterThan(10);
      expect(p.interests.length).toBeGreaterThanOrEqual(2);
      expect(p.personality).toBeTruthy();
      expect(p.lookingFor).toBeTruthy();
      expect(p.zodiac).toBeTruthy();
      expect(p.photos.length).toBeGreaterThan(0);
    });
  });

  it('all species are from the known list', () => {
    const knownSpecies = [
      'Human', 'Martian', 'Andromedan', 'Nebulari', 'Void Elf',
      'Plutonian', 'Celestari', 'Zyphorian', 'Lunari', 'Saturnite',
      'Neptunian',
    ];
    profiles.forEach((p) => {
      expect(knownSpecies).toContain(p.species);
    });
  });

  it('has a diverse mix of species', () => {
    const speciesCounts = new Map<string, number>();
    profiles.forEach((p) => {
      speciesCounts.set(p.species, (speciesCounts.get(p.species) || 0) + 1);
    });
    // All 11 species should be represented
    expect(speciesCounts.size).toBe(11);
  });

  it('all photos contain avatar URLs', () => {
    profiles.forEach((p) => {
      p.photos.forEach((photo) => {
        expect(photo).toContain('dicebear.com');
      });
    });
  });

  it('interests are non-empty strings', () => {
    profiles.forEach((p) => {
      p.interests.forEach((interest) => {
        expect(typeof interest).toBe('string');
        expect(interest.length).toBeGreaterThan(0);
      });
    });
  });
});
