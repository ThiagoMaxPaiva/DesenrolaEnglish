'use client';

import { motion } from 'framer-motion';

export default function AnimatedGlobe({ className = '' }: { className?: string }) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
      const delay = 0.5 + i * 0.2;
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: "spring" as const, duration: 3, bounce: 0 },
          opacity: { delay, duration: 0.1 }
        }
      };
    }
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-white/60 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] ${className}`}
      initial="hidden"
      animate="visible"
    >
      {/* Outer Circle */}
      <motion.circle cx="12" cy="12" r="10" variants={draw} custom={0} />
      
      {/* Vertical ellipses */}
      <motion.ellipse cx="12" cy="12" rx="4" ry="10" variants={draw} custom={1} />
      <motion.ellipse cx="12" cy="12" rx="10" ry="10" variants={draw} custom={2} />
      
      {/* Horizontal lines */}
      <motion.path d="M2 12h20" variants={draw} custom={3} />
      <motion.path d="M4 17h16" variants={draw} custom={4} />
      <motion.path d="M4 7h16" variants={draw} custom={5} />
    </motion.svg>
  );
}
