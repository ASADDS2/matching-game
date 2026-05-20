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
