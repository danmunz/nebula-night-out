import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { CardStack } from '../components/CardStack';
import { MatchOverlay } from '../components/MatchOverlay';
import { profiles } from '../data/profiles';
import { willMatch } from '../constants';
import type { Profile, SwipeDirection, Match, UserProfile } from '../types';

interface DiscoverScreenProps {
  userProfile: UserProfile;
  swipedIds: string[];
  matches: Match[];
  onSwipe: (profileId: string, direction: SwipeDirection) => void;
  onMatch: (match: Match) => void;
  onNavigateToChat: (profileId: string) => void;
}

export function DiscoverScreen({ userProfile, swipedIds, onSwipe, onMatch, onNavigateToChat }: DiscoverScreenProps) {
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);

  const availableProfiles = useMemo(
    () => profiles.filter(p => !swipedIds.includes(p.id)),
    [swipedIds]
  );

  const handleSwipe = useCallback((profile: Profile, direction: SwipeDirection) => {
    onSwipe(profile.id, direction);

    if (direction === 'right' || direction === 'up') {
      const userId = userProfile.name + userProfile.species;
      if (willMatch(profile.id, userId)) {
        const match: Match = {
          profileId: profile.id,
          timestamp: Date.now(),
          isSuperLike: direction === 'up',
        };
        onMatch(match);
        setTimeout(() => setMatchedProfile(profile), 300);
      }
    }
  }, [onSwipe, onMatch, userProfile]);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      paddingTop: '0.5rem',
      overflow: 'hidden',
    }}>
      <CardStack
        profiles={availableProfiles}
        onSwipe={handleSwipe}
        onEmpty={() => {}}
      />

      <AnimatePresence>
        {matchedProfile && (
          <MatchOverlay
            profile={matchedProfile}
            userProfile={userProfile}
            onMessage={() => {
              onNavigateToChat(matchedProfile.id);
              setMatchedProfile(null);
            }}
            onKeepSwiping={() => setMatchedProfile(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
