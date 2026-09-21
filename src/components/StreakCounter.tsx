'use client';

import { motion } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <motion.div
      className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-5 py-3"
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
          <Flame className="w-7 h-7 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
        ) : (
          <Zap className="w-7 h-7 text-gray-500" />
        )}
      </motion.div>

      <div className="flex flex-col">
        <motion.span
          className="text-2xl font-bold text-white leading-none"
          key={streak}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {streak}
        </motion.span>
        <span className="text-xs text-gray-400 font-medium">
          {streak === 1 ? 'day streak' : 'day streak'}
        </span>
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
