'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: GlassButtonProps) {
  const baseStyles = 'relative rounded-xl font-medium tracking-wide transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden backdrop-blur-md border';
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantStyles = {
    primary: 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.1)]',
    secondary: 'bg-black/40 text-gray-300 border-white/5 hover:bg-black/60 hover:text-white hover:border-white/10',
    ghost: 'bg-transparent text-gray-400 border-transparent hover:text-white hover:bg-white/5',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {/* Subtle shine effect on primary */}
      {variant === 'primary' && !disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
