'use client';

import { motion } from 'framer-motion';
import { Shield, Star, Crown } from 'lucide-react';
import { UserLevel } from '@/types';

interface LevelBadgeProps {
  level: UserLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const levelConfig = {
  branca: {
    name: 'Faixa Branca',
    subtitle: 'Beginner',
    icon: Shield,
    colors: 'from-gray-300 to-white',
    border: 'border-gray-400',
    glow: 'shadow-[0_0_20px_rgba(255,255,255,0.2)]',
    text: 'text-gray-200',
    bg: 'bg-gray-500/10',
  },
  azul: {
    name: 'Faixa Azul',
    subtitle: 'Intermediate',
    icon: Star,
    colors: 'from-cyan-400 to-blue-500',
    border: 'border-cyan-400',
    glow: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]',
    text: 'text-cyan-300',
    bg: 'bg-cyan-500/10',
  },
  preta: {
    name: 'Faixa Preta',
    subtitle: 'Advanced',
    icon: Crown,
    colors: 'from-purple-400 to-pink-500',
    border: 'border-purple-400',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    text: 'text-purple-300',
    bg: 'bg-purple-500/10',
  },
};

export default function LevelBadge({
  level,
  size = 'md',
  showLabel = true,
}: LevelBadgeProps) {
  if (!level) return null;

  const config = levelConfig[level];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Badge icon */}
      <motion.div
        className={`
          ${sizeClasses[size]} rounded-full
          bg-gradient-to-br ${config.colors}
          flex items-center justify-center
          ${config.glow}
          border-2 ${config.border}
        `}
        whileHover={{ scale: 1.1, rotate: 10 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Icon className={`${iconSizes[size]} text-gray-900`} />
      </motion.div>

      {/* Label */}
      {showLabel && (
        <div className="flex flex-col">
          <span className={`font-bold ${config.text} text-lg`}>
            {config.name}
          </span>
          <span className="text-xs text-gray-500">{config.subtitle}</span>
        </div>
      )}
    </motion.div>
  );
}
