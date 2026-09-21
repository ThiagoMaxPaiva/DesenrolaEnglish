'use client';

import { motion } from 'framer-motion';

export default function AnimatedWave({ className = '' }: { className?: string }) {
  const bars = 5;
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-white/60 rounded-full"
          animate={{
            height: ['40%', '100%', '30%', '80%', '40%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
          style={{ height: '40%' }}
        />
      ))}
    </div>
  );
}
