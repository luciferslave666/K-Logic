'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameMode, GameState, Question, PlayerStats } from '../types/game';
import { generateQuestion, validateAnswer, calculateScore } from '../lib/gameLogic';
import WelcomePage from './WelcomePage';
import ModeSelect from './ModeSelect';
import QuestionCard from './QuestionCard';
import ScoreBoard from './ScoreBoard';
import ResultScreen from './ResultScreen';
import RetrowaveBackground from './RetrowaveBackground';
import { XCircle } from 'lucide-react';
import { playSound } from '../lib/sounds';

export default function GameScreen() {
  const [gameState, setGameState] = React.useState<GameState>('welcome');
  const [username, setUsername] = React.useState('');
  const [mode, setMode] = React.useState<GameMode>('speed-rush');
  const [stats, setStats] = React.useState<PlayerStats>({
    score: 0,
    correct: 0,
    wrong: 0,
    level: 1,
    mode: 'speed-rush'
  });
  const [currentQuestion, setCurrentQuestion] = React.useState<Question | null>(null);
  const [feedback, setFeedback] = React.useState<{ show: boolean; isCorrect: boolean; correctAnswer?: number }>({
    show: false,
    isCorrect: false
  });

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const qTimerRef = React.useRef<number | null>(null); // For speed rush speed bonus

  const startGame = (selectedMode: GameMode) => {
    setMode(selectedMode);
    const initialStats: PlayerStats = {
      score: 0,
      correct: 0,
      wrong: 0,
      level: 1,
      mode: selectedMode,
      ...(selectedMode === 'speed-rush' ? { timeRemaining: 60 } : {}),
      ...(selectedMode === 'survival' ? { lives: 3 } : {}),
      ...(selectedMode === 'level-rush' ? { timeRemaining: 30 } : {})
    };
    setStats(initialStats);
    setGameState('playing');
    const firstQ = generateQuestion(1);
    setCurrentQuestion(firstQ);
    qTimerRef.current = Date.now();
  };

  const handleLevelRushTimer = React.useCallback(() => {
    if (gameState !== 'playing' || mode !== 'level-rush') return;

    if (stats.timeRemaining !== undefined && stats.timeRemaining > 0) {
      setStats(prev => ({ ...prev, timeRemaining: (prev.timeRemaining || 0) - 0.1 }));
    } else {
      // Time up for the question
      handleAnswer('0', true); // Treat as wrong
    }
  }, [gameState, mode, stats.timeRemaining]);

  const handleGlobalTimer = React.useCallback(() => {
    if (gameState !== 'playing' || mode !== 'speed-rush') return;

    if (stats.timeRemaining !== undefined && stats.timeRemaining > 0) {
      setStats(prev => ({ ...prev, timeRemaining: (prev.timeRemaining || 0) - 1 }));
    } else {
      setGameState('result');
    }
  }, [gameState, mode, stats.timeRemaining]);

  React.useEffect(() => {
    if (gameState === 'playing') {
      if (mode === 'speed-rush') {
        const id = setInterval(handleGlobalTimer, 1000);
        return () => clearInterval(id);
      } else if (mode === 'level-rush') {
        const id = setInterval(handleLevelRushTimer, 100);
        return () => clearInterval(id);
      }
    }
  }, [gameState, mode, handleGlobalTimer, handleLevelRushTimer]);

  const handleAnswer = (input: string, isTimeUp = false) => {
    if (!currentQuestion || feedback.show) return;

    const timeUsed = qTimerRef.current ? (Date.now() - qTimerRef.current) / 1000 : 0;
    const isCorrect = !isTimeUp && validateAnswer(input, currentQuestion.answer);

    if (isCorrect) {
      playSound('correct');
    } else {
      playSound('wrong');
    }

    setFeedback({
      show: true,
      isCorrect,
      correctAnswer: currentQuestion.answer
    });

    const newScore = calculateScore(stats, isCorrect, timeUsed);
    const newCorrect = isCorrect ? stats.correct + 1 : stats.correct;
    const newWrong = isCorrect ? stats.wrong : stats.wrong + 1;
    
    // Survival Mode: Check lives
    let newLives = stats.lives;
    if (mode === 'survival' && !isCorrect) {
      newLives = (stats.lives || 0) - 1;
      if (newLives === 0) {
        playSound('gameOver');
        setTimeout(() => setGameState('result'), 1500);
        return;
      }
    }

    // Level progression
    let newLevel = stats.level;
    if (mode === 'speed-rush') {
      // Level up every 3 correct in a row? (simple logic: every 3 correct)
      if (isCorrect && newCorrect % 3 === 0) {
        newLevel = Math.min(newLevel + 1, 10);
        playSound('levelUp');
      }
    } else if (mode === 'survival') {
      if (isCorrect && newCorrect % 5 === 0) {
        newLevel = Math.min(newLevel + 1, 10);
        playSound('levelUp');
      }
    } else if (mode === 'level-rush') {
      // After 8 questions, progress level
      const totalInLevel = newCorrect + newWrong;
      if (totalInLevel % 8 === 0) {
        newLevel = newLevel + 1;
        if (newLevel > 5) {
          playSound('gameOver');
          setTimeout(() => setGameState('result'), 1500);
          return;
        }
        playSound('levelUp');
      }
    }

    setStats(prev => ({
      ...prev,
      score: newScore,
      correct: newCorrect,
      wrong: newWrong,
      level: newLevel,
      lives: newLives,
      ...(mode === 'level-rush' ? { 
        timeRemaining: 30 - (newLevel - 1) * 4.5 // L1: 30s, L2: 25.5, L3: 21, L4: 16.5, L5: 12
      } : {})
    }));

    setTimeout(() => {
      setFeedback({ show: false, isCorrect: false });
      const nextQ = generateQuestion(newLevel);
      setCurrentQuestion(nextQ);
      qTimerRef.current = Date.now();
    }, 1500);
  };

  const getModeName = () => {
    switch (mode) {
      case 'speed-rush': return 'SPEED RUSH';
      case 'survival': return 'SURVIVAL';
      case 'level-rush': return 'LEVEL RUSH';
      default: return '';
    }
  };

  return (
    <div className="relative min-h-screen">
      <RetrowaveBackground />

      <AnimatePresence mode="wait">
        {gameState === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <WelcomePage onStart={(u) => {
              setUsername(u);
              playSound('click');
              setGameState('mode-select');
            }} />
          </motion.div>
        )}

        {gameState === 'mode-select' && (
          <motion.div
            key="mode-select"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <ModeSelect onSelect={(m) => {
              playSound('click');
              startGame(m);
            }} onBack={() => {
              playSound('click');
              setGameState('welcome');
            }} />
          </motion.div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center min-h-screen"
          >
            <ScoreBoard stats={stats} modeName={getModeName()} />
            
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <QuestionCard
                question={currentQuestion}
                onSubmit={(ans) => handleAnswer(ans)}
                feedback={feedback}
              />
            </div>

            <button
              onClick={() => {
                playSound('click');
                setGameState('result');
              }}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-retro-accent-pink transition-colors"
              title="Quit Game"
            >
              <XCircle className="w-8 h-8" />
            </button>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultScreen
              stats={stats}
              username={username}
              onPlayAgain={() => {
                playSound('click');
                startGame(mode);
              }}
              onChangeMode={() => {
                playSound('click');
                setGameState('mode-select');
              }}
              onMainMenu={() => {
                playSound('click');
                setGameState('welcome');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
