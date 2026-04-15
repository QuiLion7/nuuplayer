export type ProfileType = 'Unknown' | 'Impatient' | 'Explorer' | 'Focused' | 'Casual';

export interface Profile {
  type: ProfileType;
  confidence: number;
  detectedAt: number;
  reason: string;
}

export type GameCategory = 'puzzle' | 'action' | 'casual' | 'strategy' | 'quiz' | 'arcade';

export interface GameInterface {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  tags: string[];
  coverColor: string;
  icon: string;
  durationEstimate: string;
  isNew?: boolean;
  isFast?: boolean;
  isSimilarTo?: string[];
  url?: string;
  internal?: boolean;
  iframeHeight?: number;
}


export interface GameSession {
  gameId: string;
  startTime: number;
  endTime?: number;
  duration?: number;  
  clicks: number;
  keyboardHits: number;
  quickExit: boolean; 
}

export interface SessionData {
  sessions: GameSession[];
  totalClicks: number;
  keyboardHits: number;
  scrollDepth: number;
  visitedGames: string[];
  startTime: number;
}


export interface UIAdaptation {
  profileType: ProfileType;
  bannerMessage: string;
  bannerSubtext: string;
  bannerEmoji: string;
  priorityTags: string[];
  priorityCategories: GameCategory[];
  gameOrder: string[];
  highlightNew: boolean;
  showSuggestions: boolean;
}


export interface DebugInfo {
  profile: Profile;
  session: SessionData;
  adaptation: UIAdaptation;
  nextThreshold: string;
  decisionLog: string[];
}
