export type GameMode = 'speed-rush' | 'survival' | 'level-rush';

export type GameState = 'welcome' | 'mode-select' | 'playing' | 'result';

export interface Question {
  expression: string;
  answer: number;
  level: number;
}

export interface PlayerStats {
  score: number;
  correct: number;
  wrong: number;
  level: number;
  lives?: number;
  timeRemaining?: number;
  mode: GameMode;
}

export interface HighScore {
  mode: GameMode;
  score: number;
  date: string;
}
