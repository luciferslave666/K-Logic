import { HighScore, GameMode } from '../types/game';

const STORAGE_KEY = 'math_retrowave_highscores';

export function getHighscores(): HighScore[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getHighscoreByMode(mode: GameMode): number {
  const scores = getHighscores();
  const found = scores.find(s => s.mode === mode);
  return found ? found.score : 0;
}

export function setHighscore(mode: GameMode, score: number) {
  if (typeof window === 'undefined') return;
  const scores = getHighscores();
  const existingIndex = scores.findIndex(s => s.mode === mode);
  
  if (existingIndex !== -1) {
    if (score > scores[existingIndex].score) {
      scores[existingIndex] = {
        mode,
        score,
        date: new Date().toISOString()
      };
    } else {
      return; // Not a new highscore
    }
  } else {
    scores.push({
      mode,
      score,
      date: new Date().toISOString()
    });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}
