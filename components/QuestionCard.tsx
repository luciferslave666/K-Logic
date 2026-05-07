'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types/game';
import { Minus, Square, X } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onSubmit: (answer: string) => void;
  feedback: {
    show: boolean;
    isCorrect: boolean;
    correctAnswer?: number;
  };
}

export default function QuestionCard({ question, onSubmit, feedback }: QuestionCardProps) {
  const [input, setInput] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!feedback.show) {
      setInput('');
      inputRef.current?.focus();
    }
  }, [feedback.show, question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.show || !input.trim()) return;
    onSubmit(input);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl px-4">
      <motion.div
        key={question.expression}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="retro-window w-full bg-white relative overflow-hidden"
      >
        <div className="retro-window-header">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-retro-accent-purple rounded-sm" />
            <span>CALC_ENGINE.DLL</span>
          </div>
          <div className="flex gap-1 items-center">
            <Minus className="w-3 h-3 cursor-pointer hover:bg-gray-100" />
            <Square className="w-3 h-3 cursor-pointer hover:bg-gray-100" />
            <X className="w-3 h-3 p-1 box-content hover:bg-red-400 hover:text-white" />
          </div>
        </div>

        <div className="p-12 text-center">
          <p className="font-rajdhani text-sm font-bold text-gray-500 mb-4 tracking-widest uppercase">
            SOLVE_EXPRESSION:
          </p>
          <h3 className="font-orbitron text-5xl md:text-7xl font-black text-black mb-12 tracking-tight">
            {question.expression}
          </h3>

          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col items-center">
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={feedback.show}
              className="retro-input w-full max-w-[320px] text-center text-4xl md:text-6xl font-black py-4 mb-8"
              placeholder="0"
            />
            
            <button
              type="submit"
              disabled={feedback.show}
              className="retro-button px-16 py-3 text-xl w-full max-w-[320px] hover:bg-black hover:text-white transition-colors"
            >
              SUBMIT_CALC
            </button>
          </form>
        </div>

        <AnimatePresence>
          {feedback.show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-white/95 z-20"
            >
              <div className={`retro-window w-[300px] p-6 text-center ${feedback.isCorrect ? 'bg-[#e8f5e9]' : 'bg-[#ffebee]'}`}>
                <div className={`retro-window-header mb-4 ${feedback.isCorrect ? 'bg-[#81c784]' : 'bg-[#e57373]'}`}>
                  <span>{feedback.isCorrect ? 'SUCCESS' : 'ERROR_LOG'}</span>
                  <X className="w-3 h-3" />
                </div>
                
                {feedback.isCorrect ? (
                  <h4 className="font-orbitron text-3xl font-black text-green-700 italic">
                    CORRECT!
                  </h4>
                ) : (
                  <div>
                    <h4 className="font-orbitron text-3xl font-black text-red-700 italic mb-2">
                      WRONG!
                    </h4>
                    <p className="font-rajdhani text-xl text-gray-800 font-bold">
                      FIXED_VAL: <span className="font-orbitron text-gray-900">{feedback.correctAnswer}</span>
                    </p>
                  </div>
                )}
                
                <div className="mt-4 h-2 bg-gray-200 border border-black overflow-hidden relative">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "linear" }}
                    className={`absolute inset-0 ${feedback.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
