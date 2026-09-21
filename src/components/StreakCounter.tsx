'use client';

import { motion } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <motion.div
      className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      {/* Fire icon with animation */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {streak > 0 ? (
          <Flame className="w-7 h-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
        ) : (
          <Zap className="w-7 h-7 text-gray-500" />
        )}
      </motion.div>

      {/* Counter text */}
      <div className="flex flex-col">
        <span className="text-sm text-gray-400 font-medium leading-none mb-1 uppercase tracking-wider">
          Streak
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-white leading-none">
            {streak}
          </span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Days
          </span>
        </div>
      </div>

      {/* Milestone indicators */}
      {streak >= 7 && (
        <motion.div
          className="ml-2 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.3 }}
        >
          <span className="text-xs text-orange-300 font-semibold">🔥 On fire!</span>
        </motion.div>
      )}
    </motion.div>
  );
}
