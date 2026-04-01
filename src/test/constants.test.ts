import { describe, it, expect } from 'vitest';
import {
  generateId,
  getAvatarUrl,
  seededRandom,
  willMatch,
  SPECIES,
  INTERESTS_POOL,
  ZODIACS,
  SPRING,
  SWIPE_THRESHOLD,
  MATCH_PROBABILITY,
} from '../constants';

describe('constants', () => {
  describe('SPRING configs', () => {
    it('has all expected spring presets', () => {
      expect(SPRING).toHaveProperty('snappy');
      expect(SPRING).toHaveProperty('smooth');
      expect(SPRING).toHaveProperty('gentle');
      expect(SPRING).toHaveProperty('bouncy');
    });

    it('all springs have type "spring"', () => {
      Object.values(SPRING).forEach((spring) => {
        expect(spring.type).toBe('spring');
        expect(spring.stiffness).toBeGreaterThan(0);
        expect(spring.damping).toBeGreaterThan(0);
      });
    });
  });

  describe('data arrays', () => {
    it('has 11 species', () => {
      expect(SPECIES).toHaveLength(11);
      expect(SPECIES).toContain('Human');
      expect(SPECIES).toContain('Void Elf');
      expect(SPECIES).toContain('Neptunian');
    });

    it('has 32 interests', () => {
      expect(INTERESTS_POOL).toHaveLength(32);
      expect(INTERESTS_POOL).toContain('Zero-G Yoga');
    });

    it('has 12 zodiacs', () => {
      expect(ZODIACS).toHaveLength(12);
    });

    it('SWIPE_THRESHOLD is a positive number', () => {
      expect(SWIPE_THRESHOLD).toBeGreaterThan(0);
    });

    it('MATCH_PROBABILITY is between 0 and 1', () => {
      expect(MATCH_PROBABILITY).toBeGreaterThan(0);
      expect(MATCH_PROBABILITY).toBeLessThanOrEqual(1);
    });
  });

  describe('generateId', () => {
    it('returns a non-empty string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('generates unique IDs', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId()));
      expect(ids.size).toBe(100);
    });
  });

  describe('getAvatarUrl', () => {
    it('returns a dicebear URL with the seed', () => {
      const url = getAvatarUrl('test-seed');
      expect(url).toContain('api.dicebear.com');
      expect(url).toContain('test-seed');
      expect(url).toContain('adventurer');
    });

    it('uses custom style when provided', () => {
      const url = getAvatarUrl('seed', 'bottts');
      expect(url).toContain('bottts');
    });

    it('encodes special characters in seed', () => {
      const url = getAvatarUrl('hello world');
      expect(url).toContain('hello%20world');
    });
  });

  describe('seededRandom', () => {
    it('returns a number between 0 and 1', () => {
      const result = seededRandom('test');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1);
    });

    it('is deterministic (same seed = same result)', () => {
      const a = seededRandom('cosmic-seed-42');
      const b = seededRandom('cosmic-seed-42');
      expect(a).toBe(b);
    });

    it('different seeds produce different results', () => {
      const a = seededRandom('seed-alpha');
      const b = seededRandom('seed-beta');
      expect(a).not.toBe(b);
    });
  });

  describe('willMatch', () => {
    it('returns a boolean', () => {
      const result = willMatch('p001', 'user1');
      expect(typeof result).toBe('boolean');
    });

    it('is deterministic for same inputs', () => {
      const a = willMatch('p001', 'user1');
      const b = willMatch('p001', 'user1');
      expect(a).toBe(b);
    });

    it('produces roughly MATCH_PROBABILITY match rate over many trials', () => {
      let matches = 0;
      const trials = 1000;
      for (let i = 0; i < trials; i++) {
        if (willMatch(`profile-${i}`, 'testuser')) matches++;
      }
      const rate = matches / trials;
      // Allow 10% deviation from expected probability
      expect(rate).toBeGreaterThan(MATCH_PROBABILITY - 0.1);
      expect(rate).toBeLessThan(MATCH_PROBABILITY + 0.1);
    });
  });
});
