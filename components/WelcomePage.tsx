'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameMode } from '../types/game';
import { getHighscoreByMode } from '../lib/storage';
import { 
  Monitor, 
  Folder, 
  FileText, 
  Settings, 
  X, 
  Clock, 
  Trophy, 
  Heart, 
  Sparkles, 
  Mail, 
  Search,
  Maximize2,
  Minus
} from 'lucide-react';

import LeaderboardModal from './LeaderboardModal';
import { playSound } from '../lib/sounds';

interface WelcomePageProps {
  onStart: (username: string) => void;
  bestScore?: number;
}

export default function WelcomePage({ onStart }: WelcomePageProps) {
  const [totalBest, setTotalBest] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [showLeaderboard, setShowLeaderboard] = React.useState(false);

  React.useEffect(() => {
    const savedUsername = localStorage.getItem('klogic_username');
    if (savedUsername) setUsername(savedUsername);

    const modes: GameMode[] = ['speed-rush', 'survival', 'level-rush'];
    const highscores = modes.map(m => getHighscoreByMode(m));
    const max = Math.max(...highscores);
    setTotalBest(max);

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col relative overflow-hidden font-rajdhani">
      {/* Decorative Ornaments from Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-20 left-10 hidden lg:block z-0"
      >
        <div className="retro-window w-48 h-48 flex items-center justify-center p-4 bg-white">
          <div className="retro-window-header absolute top-0 left-0 w-full">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <span>IMAGE.EXE</span>
          </div>
          <div className="relative group mt-4">
            <Heart className="w-24 h-24 text-retro-accent-pink fill-retro-accent-pink animate-pulse" />
            <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-retro-accent-yellow animate-sparkle" />
          </div>
          <div className="absolute bottom-4 left-0 w-full flex justify-center">
            <button className="retro-button py-1 px-6 text-[10px]">OKAY</button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-40 right-20 hidden xl:block z-0"
      >
        <div className="grid grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="p-4 bg-white border-2 border-retro-border group-hover:bg-retro-accent-purple transition-colors shadow-hard">
                <Folder className="w-10 h-10 text-retro-accent-purple fill-retro-accent-purple/20" />
              </div>
              <span className="font-orbitron text-[8px] font-black bg-black text-white px-2">FOLDER_0{i}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Small Message Window */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-32 left-20 hidden lg:block z-0"
      >
        <div className="retro-window bg-retro-accent-blue/20 p-3 min-w-[200px]">
          <div className="flex items-center gap-2 border-b border-retro-border mb-2 pb-1">
             <div className="w-2 h-2 rounded-full bg-retro-accent-blue" />
             <span className="text-[10px] font-bold">SYSTEM.MSG</span>
          </div>
          <p className="font-mono text-xs font-black">
            {">>"} ...READY_TO_RUN_LOGIC?
          </p>
        </div>
      </motion.div>

      {/* Main Game Launcher Window */}
      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="retro-window w-full max-w-xl flex flex-col bg-white"
        >
          {/* Window Header */}
          <div className="retro-window-header">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-retro-accent-pink rounded-sm" />
              <span className="text-[10px]">K-LOGIC_V3.0_PASTEL</span>
            </div>
            <div className="flex gap-2 items-center">
              <Minus className="w-3 h-3 cursor-pointer hover:bg-gray-100" />
              <Maximize2 className="w-3 h-3 cursor-pointer hover:bg-gray-100" />
              <div className="w-6 h-6 flex items-center justify-center hover:bg-red-400 hover:text-white transition-colors cursor-pointer border-l border-retro-border">
                <X className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 text-center relative overflow-hidden bg-[radial-gradient(#f0f0f0_1px,transparent_1px)] bg-[length:20px_20px]">
            {/* Background scanline within window */}
             <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[repeating-linear-gradient(transparent,transparent_2px,#000_2px,#000_4px)]" />

            {/* Logo Section */}
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="mb-8 relative"
            >
              <div className="inline-block relative">
                <h1 className="font-orbitron font-black text-6xl md:text-8xl italic tracking-tighter text-black uppercase relative z-10 drop-shadow-[3px_3px_0px_#f48fb1]">
                  K-LOGIC
                </h1>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-retro-accent-pink font-black text-xs uppercase tracking-[0.3em]">
                MATH_RETRO_CHALLENGE
              </div>
            </motion.div>

            {/* Content Section */}
            <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="w-full max-w-sm">
                <label className="font-orbitron font-black text-[10px] text-retro-accent-pink block mb-2 text-left uppercase">
                  IDENTIFY_USER:
                </label>
                <input 
                  type="text"
                  placeholder="ENTER_USERNAME..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toUpperCase())}
                  className="retro-input w-full py-3 px-4 text-sm font-black focus:outline-none focus:border-retro-accent-pink transition-colors"
                  maxLength={15}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '4px 4px 0px 0px #1a1a1a' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (username.trim()) {
                    playSound('click');
                    localStorage.setItem('klogic_username', username.trim());
                    onStart(username.trim());
                  } else {
                    alert('PLEASE ENTER A USERNAME');
                  }
                }}
                className={`retro-button px-24 py-5 text-2xl font-black transition-all w-full max-w-sm ${!username.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!username.trim()}
              >
                RUN_GAME
              </motion.button>

              <button
                onClick={() => {
                  playSound('click');
                  setShowLeaderboard(true);
                }}
                className="font-orbitron text-[10px] font-black text-gray-400 hover:text-retro-accent-purple transition-colors flex items-center gap-2 mt-2 uppercase"
              >
                <Trophy className="w-3 h-3" />
                VIEW_GLOBAL_RANKINGS
              </button>
            </div>
          </div>

          {/* Window Footer/Status Bar */}
          <div className="border-t-2 border-retro-border p-2 bg-[#f8f8f8] flex justify-between items-center text-[10px] font-orbitron font-bold">
            <div className="flex gap-4 items-center">
              <span className="flex items-center gap-1">
                <Search className="w-3 h-3" />
                HELLO_SYSTEM...
              </span>
            </div>
            <div className="flex items-center gap-4 px-2">
                <Clock className="w-3 h-3" />
                <span>{currentTime}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Sparkles Decor */}
      <Sparkles className="absolute top-1/4 right-1/4 w-12 h-12 text-white opacity-40 animate-sparkle" />
      <Heart className="absolute bottom-1/4 right-1/3 w-8 h-8 text-retro-accent-pink opacity-20 fill-current animate-pulse" />

      {/* Leaderboard Modal */}
      <AnimatePresence>
        {showLeaderboard && (
          <LeaderboardModal onClose={() => {
            playSound('click');
            setShowLeaderboard(false);
          }} />
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-white border-t-2 border-retro-border flex items-center px-4 justify-between z-20">
        <div className="flex items-center gap-3 h-full">
          <div className="h-8 bg-retro-accent-pink px-4 flex items-center gap-2 border-2 border-retro-border shadow-[1px_1px_0px_0px_white] cursor-pointer hover:brightness-110">
            <div className="w-3 h-3 bg-white rounded-full" />
            <span className="font-orbitron text-[10px] font-black uppercase text-white">START</span>
          </div>
          <div className="w-[1px] h-6 bg-gray-200 mx-1" />
          <div className="flex gap-2">
             <div className="w-8 h-8 flex items-center justify-center border border-gray-200 bg-gray-50"><Mail className="w-4 h-4 opacity-50" /></div>
             <div className="w-8 h-8 flex items-center justify-center border-2 border-retro-border bg-retro-accent-blue/20"><Monitor className="w-4 h-4 text-retro-accent-blue" /></div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="h-8 px-4 flex items-center border border-gray-100 bg-gray-50/50 font-mono text-[10px] font-bold">
            {currentTime}
          </div>
        </div>
      </div>
    </div>
  );
}
