'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Clock } from 'lucide-react';
import { GameMode } from '../types/game';

interface LeaderboardModalProps {
  onClose: () => void;
}

export default function LeaderboardModal({ onClose }: LeaderboardModalProps) {
  const [selectedMode, setSelectedMode] = React.useState<GameMode>('speed-rush');
  const [leaderboard, setLeaderboard] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchLeaderboard = React.useCallback(async (mode: GameMode) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?mode=${mode}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setLeaderboard(data);
      }
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLeaderboard(selectedMode);
  }, [selectedMode, fetchLeaderboard]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="retro-window w-full max-w-2xl bg-white flex flex-col"
      >
        <div className="retro-window-header bg-retro-accent-blue/20">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-retro-accent-purple" />
            <span className="text-[10px]">GLOBAL_HALL_OF_FAME</span>
          </div>
          <X className="w-4 h-4 cursor-pointer hover:bg-red-400 hover:text-white transition-colors" onClick={onClose} />
        </div>

        <div className="p-4 md:p-8">
          {/* Mode Switcher */}
          <div className="flex gap-2 mb-6">
            {(['speed-rush', 'survival', 'level-rush'] as GameMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`flex-1 py-2 font-orbitron text-[10px] font-black border-2 transition-all ${
                  selectedMode === m 
                    ? 'bg-retro-accent-purple border-black shadow-hard' 
                    : 'bg-white border-gray-200 text-gray-400 hover:border-black'
                }`}
              >
                {m.replace('-', '_').toUpperCase()}
              </button>
            ))}
          </div>

          <div className="retro-window bg-gray-50/50 p-4 min-h-[300px]">
            {loading ? (
              <div className="h-[200px] flex items-center justify-center font-mono text-sm animate-pulse">
                {"//"} SYNCING_WITH_NEON_CORE...
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="h-[200px] flex flex-col items-center justify-center gap-4">
                <span className="font-mono text-xs text-gray-400 italic">EMPTY_DATA_SET</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between px-4 py-1 text-[9px] font-orbitron font-black text-gray-500 border-b border-black/5">
                  <span>RANK_USER</span>
                  <div className="flex gap-10">
                    <span>LVL</span>
                    <span className="w-20 text-right">SCORE</span>
                  </div>
                </div>
                {leaderboard.map((entry, i) => (
                  <div 
                    key={i} 
                    className="flex justify-between items-center px-4 py-3 border-2 border-black/5 bg-white font-mono text-sm shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black ${
                        i === 0 ? 'bg-retro-accent-yellow' : i === 1 ? 'bg-gray-200' : i === 2 ? 'bg-orange-200' : 'bg-gray-50'
                      }`}>
                        {i + 1}
                      </span>
                      <span className="font-bold">{entry.username}</span>
                    </div>
                    <div className="flex gap-10 items-center">
                      <span className="text-xs text-gray-400 font-bold">{entry.level}</span>
                      <span className="w-20 text-right font-black text-retro-accent-blue">{entry.score.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t-2 border-black/5 p-3 flex justify-center">
          <button onClick={onClose} className="retro-button px-12 py-2 text-xs">DISMISS</button>
        </div>
      </motion.div>
    </div>
  );
}
