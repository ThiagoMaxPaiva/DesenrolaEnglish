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
    <motion.div
      className={`w-full h-full flex items-center justify-center ${className}`}
      animate={{ 
        rotateZ: 360,
        rotateX: [0, 10, 0, -10, 0],
        rotateY: [0, 20, 0, -20, 0],
      }}
      transition={{ 
        rotateZ: { duration: 60, repeat: Infinity, ease: "linear" },
        rotateX: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        rotateY: { duration: 15, repeat: Infinity, ease: "easeInOut" }
      }}
      style={{ perspective: 1000 }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white/40 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] w-full h-full"
        initial="hidden"
        animate="visible"
      >
        {/* Outer Circle */}
        <motion.circle cx="12" cy="12" r="10" variants={draw} custom={0} />
        
        {/* Vertical ellipses simulating 3D sphere */}
        <motion.ellipse cx="12" cy="12" rx="3" ry="10" variants={draw} custom={1} />
        <motion.ellipse cx="12" cy="12" rx="7" ry="10" variants={draw} custom={2} />
        
        {/* Horizontal lines simulating latitude */}
        <motion.ellipse cx="12" cy="12" rx="10" ry="3" variants={draw} custom={3} />
        <motion.ellipse cx="12" cy="12" rx="10" ry="7" variants={draw} custom={4} />
      </motion.svg>
    </motion.div>
  );
}
