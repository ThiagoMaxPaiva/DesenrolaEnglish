'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'cyan' | 'purple' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export default function NeonButton({
  children,
  onClick,
  variant = 'cyan',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}: NeonButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    cyan: 'bg-cyan-500/10 border-cyan-400 text-cyan-300 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]',
    purple: 'bg-purple-500/10 border-purple-400 text-purple-300 hover:bg-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
    gradient: 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400 text-white hover:from-cyan-500/30 hover:to-purple-500/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative rounded-xl border font-semibold
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0"
        style={{
          background:
            variant === 'cyan'
              ? 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%)'
              : variant === 'purple'
              ? 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(0,240,255,0.1) 0%, rgba(168,85,247,0.1) 50%, transparent 70%)',
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
