'use client';

import React from 'react';
import { motion } from 'motion/react';
import { GameMode } from '../types/game';
import { ChevronLeft, X } from 'lucide-react';

interface ModeSelectProps {
  onSelect: (mode: GameMode) => void;
  onBack: () => void;
}

const MODES = [
  {
    id: 'speed-rush' as GameMode,
    name: 'SPEED RUSH',
    description: '60 seconds. Unlimited questions. Speed is key.',
    color: 'var(--retro-accent-blue)',
    headerColor: 'bg-[#b3e5fc]'
  },
  {
    id: 'survival' as GameMode,
    name: 'SURVIVAL',
    description: '3 LIVES. Difficulty ramps up. Don\'t make a mistake.',
    color: 'var(--retro-accent-pink)',
    headerColor: 'bg-[#f48fb1]'
  },
  {
    id: 'level-rush' as GameMode,
    name: 'LEVEL RUSH',
    description: '5 levels. 8 questions each. Timer gets faster.',
    color: 'var(--retro-accent-yellow)',
    headerColor: 'bg-[#fff9c4]'
  }
];

export default function ModeSelect({ onSelect, onBack }: ModeSelectProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 py-12">
      <div className="w-full max-w-6xl">
        <button
          onClick={onBack}
          className="retro-button mb-8 flex items-center text-sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          BACK TO MENU
        </button>

        <h2 className="font-orbitron text-2xl font-black text-black mb-12 tracking-widest uppercase text-center bg-white px-4 py-2 border-2 border-black inline-block mx-auto shadow-hard-sm">
          SELECT_STATION
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MODES.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => onSelect(mode.id)}
              className="retro-window cursor-pointer group flex flex-col"
            >
              <div className={`retro-window-header ${mode.headerColor}`}>
                <span>{mode.id}.SYS</span>
                <X className="w-3 h-3" />
              </div>
              
              <div className="p-8 flex-1 flex flex-col items-center text-center">
                <h3 className="font-orbitron text-xl font-black mb-4 tracking-tighter">
                  {mode.name}
                </h3>
                
                <p className="text-gray-600 font-rajdhani text-base font-bold leading-tight mb-8">
                  {mode.description}
                </p>

                <div className="mt-auto retro-button w-full group-hover:bg-black group-hover:text-white transition-colors">
                  EXECUTE
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
