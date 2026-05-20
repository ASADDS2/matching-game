export interface ModeScore {
  stars: 0 | 1 | 2 | 3;
  lastPlayed: number | null;
  bestScore: number;
}

export interface StampRecord {
  id: string;
  mode: number;
  iconName: string;
  dateEarned: number;
}

export interface GameState {
  version: number;
  currentScreen: 'home' | 'select' | 'game' | 'results';
  currentMode: 0 | 1 | 2 | 3 | 4;
  scores: Record<number, ModeScore>;
  passport: StampRecord[];
  sessionStats: { correct: number; wrong: number; timeMs: number };
  reviewQueue: string[];
  audioEnabled: boolean;
  lastResult: { mode: number; score: number; stars: 0 | 1 | 2 | 3; timeTaken: number } | null;
}

const STORAGE_KEY = 'top_notch_2_game_state';
const CURRENT_VERSION = 1;

export const defaultState: GameState = {
  version: CURRENT_VERSION,
  currentScreen: 'home',
  currentMode: 0,
  scores: {
    0: { stars: 0, lastPlayed: null, bestScore: 0 },
    1: { stars: 0, lastPlayed: null, bestScore: 0 },
    2: { stars: 0, lastPlayed: null, bestScore: 0 },
    3: { stars: 0, lastPlayed: null, bestScore: 0 },
    4: { stars: 0, lastPlayed: null, bestScore: 0 },
  },
  passport: [],
  sessionStats: { correct: 0, wrong: 0, timeMs: 0 },
  reviewQueue: [],
  audioEnabled: true,
  lastResult: null,
};

let state: GameState = { ...defaultState };

export function loadState(): void {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.version === CURRENT_VERSION) {
        state = { ...defaultState, ...parsed };
      } else {
        // Version mismatch, gracefully reset
        console.warn('State version mismatch, resetting state.');
        saveState(); 
      }
    } catch (e) {
      console.error('Failed to parse state', e);
      saveState();
    }
  } else {
    saveState();
  }
}

export function saveState(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getState(): GameState {
  return state;
}

export function setState(newState: Partial<GameState>): void {
  state = { ...state, ...newState };
  saveState();
}

export function resetSessionStats(): void {
  setState({ sessionStats: { correct: 0, wrong: 0, timeMs: 0 } });
}

export function completeGame(modeIndex: number, score: number, stars: 0 | 1 | 2 | 3, timeTaken: number): void {
  const currentState = getState();
  const currentScores = { ...currentState.scores };
  const modeScore = currentScores[modeIndex] || { stars: 0, lastPlayed: null, bestScore: 0 };
  
  // Calculate new bests
  const updatedStars = Math.max(modeScore.stars, stars) as 0|1|2|3;
  const updatedBest = Math.max(modeScore.bestScore, score);
  
  currentScores[modeIndex] = {
    stars: updatedStars,
    lastPlayed: Date.now(),
    bestScore: updatedBest
  };

  // Check passport stamp
  const updatedPassport = [...currentState.passport];
  const hasStamp = updatedPassport.some(s => s.mode === modeIndex);

  // Award stamp if they complete with at least 1 star and don't have it yet
  if (stars > 0 && !hasStamp) {
    const stampIcon = stars === 3 ? 'trophy' : (modeIndex === 3 ? 'plane' : 'star');
    updatedPassport.push({
      id: 'stamp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      mode: modeIndex,
      iconName: stampIcon,
      dateEarned: Date.now()
    });
  }

  setState({
    scores: currentScores,
    passport: updatedPassport,
    lastResult: {
      mode: modeIndex,
      score: score,
      stars: stars,
      timeTaken: timeTaken
    }
  });
}
