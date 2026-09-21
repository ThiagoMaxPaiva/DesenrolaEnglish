'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  variant?: 'cyan' | 'purple' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

export default function ProgressBar({
  value,
  label,
  showPercentage = true,
  variant = 'gradient',
  size = 'md',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const gradientClasses = {
    cyan: 'from-cyan-500 to-cyan-400',
    purple: 'from-purple-500 to-purple-400',
    gradient: 'from-cyan-500 via-purple-500 to-pink-500',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm text-gray-400 font-medium">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-bold text-cyan-400">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-gray-800/50 rounded-full overflow-hidden ${heightClasses[size]} backdrop-blur-sm border border-gray-700/50`}
      >
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${gradientClasses[variant]} shadow-lg`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            boxShadow:
              variant === 'cyan'
                ? '0 0 15px rgba(0,240,255,0.4)'
                : variant === 'purple'
                ? '0 0 15px rgba(168,85,247,0.4)'
                : '0 0 15px rgba(0,240,255,0.3), 0 0 15px rgba(168,85,247,0.3)',
          }}
        />
      </div>
    </div>
  );
}
