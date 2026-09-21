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

  const sizeStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };
  return (
    <div className="w-full">
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-end mb-2">
          {label && <span className="text-sm font-semibold text-gray-300">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-bold text-white tracking-widest">{Math.round(clampedValue)}%</span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div
        className={`relative w-full rounded-full overflow-hidden bg-white/5 border border-white/10 ${sizeStyles[size]}`}
      >
        {/* Progress Fill */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        
        {/* Subtle shine on top of progress */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full mix-blend-overlay pointer-events-none" />
      </div>
    </div>
  );
}
