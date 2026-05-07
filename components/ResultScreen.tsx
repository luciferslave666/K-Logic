'use client';

import React from 'react';
import { motion } from 'motion/react';
import { PlayerStats } from '../types/game';
import { getHighscoreByMode, setHighscore } from '../lib/storage';
import { X } from 'lucide-react';

interface ResultScreenProps {
  stats: PlayerStats;
  username: string;
  onPlayAgain: () => void;
  onChangeMode: () => void;
  onMainMenu: () => void;
}

export default function ResultScreen({ stats, username, onPlayAgain, onChangeMode, onMainMenu }: ResultScreenProps) {
  const [isNewHighScore, setIsNewHighScore] = React.useState(false);
  const [best, setBest] = React.useState(0);
  const [leaderboard, setLeaderboard] = React.useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = React.useState(true);

  React.useEffect(() => {
    const currentBest = getHighscoreByMode(stats.mode);
    if (stats.score > currentBest) {
      setIsNewHighScore(true);
      setHighscore(stats.mode, stats.score);
      setBest(stats.score);
    } else {
      setBest(currentBest);
    }

    // Submit to DB
    const submitScore = async () => {
      try {
        await fetch('/api/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            score: stats.score,
            mode: stats.mode,
            level: stats.level
          })
        });
        fetchLeaderboard();
      } catch (err) {
        console.error('Score submission error:', err);
        setLoadingLeaderboard(false);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`/api/leaderboard?mode=${stats.mode}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setLeaderboard(data);
        }
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    submitScore();
  }, [stats, stats.mode, username]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 py-12 gap-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="retro-window w-full max-w-2xl text-center overflow-hidden bg-white"
      >
        <div className="retro-window-header">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-retro-accent-pink rounded-sm" />
            <span>TASK_SUMMARY.LOG</span>
          </div>
          <X className="w-4 h-4 cursor-pointer" />
        </div>

        <div className="p-8 md:p-12">
          {isNewHighScore && (
            <div className="mb-6 bg-retro-accent-yellow border-2 border-black inline-block px-4 py-1 font-orbitron font-black text-sm shadow-hard">
              NEW SYSTEM RECORD DETECTED!
            </div>
          )}

          <h2 className="font-orbitron text-4xl font-black text-black mb-8 tracking-tight uppercase underline decoration-4 underline-offset-8 decoration-black/20">
            SESSION_TERMINATED
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { label: 'SCORE', value: stats.score, color: 'text-retro-accent-blue' },
              { label: 'LVL', value: stats.level, color: 'text-retro-accent-pink' },
              { label: 'ANS', value: stats.correct, color: 'text-green-500' },
              { label: 'BEST', value: best, color: 'text-gray-400' }
            ].map((item, i) => (
              <div key={i} className="retro-window p-3 bg-white border-2">
                <span className="font-orbitron text-[8px] text-gray-500 font-black block mb-1 uppercase">{item.label}</span>
                <span className={`font-orbitron text-xl font-black ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={onPlayAgain}
              className="retro-button px-10 py-4 bg-retro-accent-blue text-sm"
            >
              RUN_AGAIN
            </button>
            
            <button
              onClick={onChangeMode}
              className="retro-button px-10 py-4 bg-retro-accent-yellow text-sm"
            >
              SWITCH_MODE
            </button>

            <button
              onClick={onMainMenu}
              className="retro-button px-10 py-4 bg-white text-sm"
            >
              EXIT_SYS
            </button>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard Window */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="retro-window w-full max-w-2xl bg-white flex flex-col"
      >
        <div className="retro-window-header bg-retro-accent-blue/20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-retro-accent-blue rounded-sm" />
            <span>GLOBAL_LEADERBOARD_{stats.mode.toUpperCase()}</span>
          </div>
        </div>
        <div className="p-6">
          {loadingLeaderboard ? (
            <div className="text-center py-4 font-mono animate-pulse">FETCHING_DATA...</div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-4 font-mono text-gray-400">NO_RECORDS_FOUND</div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between px-4 py-1 text-[10px] font-orbitron font-black text-gray-500 border-b border-black/5">
                <span>USER</span>
                <div className="flex gap-8">
                  <span>LVL</span>
                  <span className="w-16 text-right">SCORE</span>
                </div>
              </div>
              {leaderboard.map((entry, i) => (
                <div 
                  key={i} 
                  className={`flex justify-between items-center px-4 py-2 border-2 ${entry.username === username ? 'border-retro-accent-pink bg-retro-accent-pink/5' : 'border-black/5'} font-mono text-sm`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-bold">#{i + 1}</span>
                    <span className="font-bold underline decoration-dotted">{entry.username}</span>
                  </div>
                  <div className="flex gap-8 items-center">
                    <span className="text-xs">{entry.level}</span>
                    <span className="w-16 text-right font-black text-retro-accent-blue">{entry.score}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
