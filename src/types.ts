export interface Profile {
  id: string;
  name: string;
  species: string;
  age: number;
  gender: string;
  homeworld: string;
  occupation: string;
  bio: string;
  interests: string[];
  distance: string;
  personality: string;
  lookingFor: string;
  dealbreakers: string;
  height: string;
  zodiac: string;
  photos: string[];
}

export interface UserProfile {
  name: string;
  species: string;
  bio: string;
  interests: string[];
  avatar: string;
  preferences: {
    speciesFilter: string[];
    minAge: number;
    maxAge: number;
    maxDistance: number;
  };
}

export interface Match {
  profileId: string;
  timestamp: number;
  isSuperLike: boolean;
}

export interface Message {
  id: string;
  profileId: string;
  content: string;
  sender: 'user' | 'match';
  timestamp: number;
}

export interface Conversation {
  profileId: string;
  messages: Message[];
  lastActivity: number;
  unread: boolean;
}

export type SwipeDirection = 'left' | 'right' | 'up';
export type Screen = 'splash' | 'apikey' | 'onboarding' | 'discover' | 'matches' | 'messages' | 'chat' | 'profile';

export interface AppState {
  userProfile: UserProfile | null;
  apiKey: string | null;
  matches: Match[];
  conversations: Conversation[];
  swipedIds: string[];
  currentScreen: Screen;
  chatProfileId: string | null;
  onboardingStep: number;
  hasCompletedOnboarding: boolean;
}
