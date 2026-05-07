'use client';

import React from 'react';
import { PlayerStats } from '../types/game';
import { Heart, Clock, Trophy, BarChart3 } from 'lucide-react';

interface ScoreBoardProps {
  stats: PlayerStats;
  modeName: string;
}

export default function ScoreBoard({ stats, modeName }: ScoreBoardProps) {
  return (
    <div className="w-full flex items-center justify-between px-6 py-2 bg-white border-b-2 border-black shadow-sm mb-8 z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-retro-accent-purple px-3 py-1 border-2 border-black font-orbitron text-[10px] font-bold text-black shadow-hard">
          <Trophy className="w-3 h-3" />
          <span>{modeName}.MOD</span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 border-2 border-black font-orbitron text-[10px] font-bold bg-white shadow-hard">
          <BarChart3 className="w-3 h-3" />
          <span>LVL_{stats.level}</span>
        </div>
      </div>

      <div className="flex gap-8 items-center bg-white px-6 py-1 border-2 border-black shadow-hard">
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-orbitron text-gray-500 font-black">ACCUM_SCORE</span>
          <span className="font-orbitron text-lg font-black">
            {stats.score.toLocaleString()}
          </span>
        </div>

        {stats.lives !== undefined && (
          <div className="flex flex-col items-center border-l-2 border-black/10 pl-6 ml-2">
            <span className="text-[9px] font-orbitron text-gray-500 font-black">USER_LIVES</span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3 h-3 ${
                    i < (stats.lives || 0) ? 'fill-retro-accent-pink text-retro-accent-pink' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {stats.timeRemaining !== undefined && (
          <div className="flex flex-col items-center border-l-2 border-black/10 pl-6 ml-2">
            <span className="text-[9px] font-orbitron text-gray-500 font-black">PROC_TIMER</span>
            <div className="flex items-center gap-1 font-orbitron text-lg font-black text-black">
              <Clock className="w-3 h-3" />
              <span className={stats.timeRemaining < 10 ? 'text-retro-accent-pink' : ''}>
                {Math.ceil(stats.timeRemaining)}s
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="hidden lg:flex items-center gap-3">
        <div className="w-32 h-3 bg-gray-100 border-2 border-black relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-retro-accent-blue" 
            style={{ width: `${(stats.correct % 8) / 8 * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
