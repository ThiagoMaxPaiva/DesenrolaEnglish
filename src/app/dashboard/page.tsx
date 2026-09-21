'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Shield, Music, MessageCircle, Headphones, Beer,
  Globe, Trophy, ChevronRight, Lock, Check, Play,
  Sparkles, ArrowLeft,
} from 'lucide-react';
import NeonButton from '@/components/NeonButton';
import ProgressBar from '@/components/ProgressBar';
import StreakCounter from '@/components/StreakCounter';
import LevelBadge from '@/components/LevelBadge';
import { useAppStore } from '@/store/useAppStore';
import { weeklyPlan } from '@/lib/weeklyPlan';
import { TaskStatus } from '@/types';

/* Map icon names from weeklyPlan to Lucide components */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Music, MessageCircle, Headphones, Beer, Globe, Trophy,
};

const statusConfig: Record<TaskStatus, {
  badge: string;
  badgeColor: string;
  cardBorder: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  locked: {
    badge: 'Locked',
    badgeColor: 'bg-gray-700/50 text-gray-500 border-gray-600/50',
    cardBorder: 'border-gray-800/30 opacity-60',
    icon: Lock,
  },
  available: {
    badge: 'Available',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    cardBorder: 'border-cyan-500/20 hover:border-cyan-500/40',
    icon: Play,
  },
  'in-progress': {
    badge: 'In Progress',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    cardBorder: 'border-purple-500/30',
    icon: Play,
  },
  completed: {
    badge: 'Completed',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    cardBorder: 'border-emerald-500/20',
    icon: Check,
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const router = useRouter();
  const {
    level, streak, weeklyProgress,
    hasCompletedPlacement, incrementStreak, updateTaskStatus,
  } = useAppStore();

  // Redirect if placement not completed
  useEffect(() => {
    if (!hasCompletedPlacement) {
      router.push('/placement');
    }
  }, [hasCompletedPlacement, router]);

  // Increment streak on visit
  useEffect(() => {
    incrementStreak();
  }, [incrementStreak]);

  // Calculate weekly progress percentage
  const completedCount = Object.values(weeklyProgress).filter((s) => s === 'completed').length;
  const weekProgress = (completedCount / 7) * 100;

  // Get motivational message
  const getMotivation = () => {
    if (weekProgress === 100) return '🎉 You crushed it this week! You\'re a legend!';
    if (weekProgress >= 70) return '🔥 Almost there! Keep the momentum going!';
    if (weekProgress >= 40) return '💪 Good progress! Don\'t stop now!';
    if (streak >= 3) return `⚡ ${streak}-day streak! You\'re building a habit!`;
    return '🚀 Let\'s get this week started! Bora desenrolar!';
  };

  const handleTaskClick = (dayId: string, status: TaskStatus) => {
    if (status === 'locked') return;

    if (status === 'available') {
      updateTaskStatus(dayId, 'in-progress');
      // Navigate to chat for practice
      router.push('/chat');
    } else if (status === 'in-progress') {
      router.push('/chat');
    }
    // completed tasks do nothing
  };

  if (!hasCompletedPlacement) return null;

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[20%] w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                O Corre da Semana
              </h1>
              <p className="text-sm text-gray-500 mt-1">Your weekly English roadmap</p>
            </div>
          </div>
          <StreakCounter streak={streak} />
        </motion.div>

        {/* Level & Progress Section */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Level card */}
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50 backdrop-blur-sm">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Your Level</p>
            <LevelBadge level={level} size="md" />
          </div>

          {/* Progress card */}
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50 backdrop-blur-sm">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Weekly Progress</p>
            <ProgressBar value={weekProgress} label={`${completedCount}/7 days completed`} />
            <p className="text-sm text-gray-400 mt-3">{getMotivation()}</p>
          </div>
        </motion.div>

        {/* Weekly Roadmap */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Weekly Roadmap</h2>

          {weeklyPlan.map((day) => {
            const status = weeklyProgress[day.id] || 'locked';
            const config = statusConfig[status];
            const DayIcon = iconMap[day.icon] || Shield;
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={day.id}
                variants={fadeInUp}
                onClick={() => handleTaskClick(day.id, status)}
                className={`
                  group relative bg-gray-900/50 rounded-2xl p-5 border backdrop-blur-sm
                  transition-all duration-300 ${config.cardBorder}
                  ${status !== 'locked' && status !== 'completed' ? 'cursor-pointer hover:bg-gray-900/70' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Day icon */}
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                    ${status === 'completed'
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : status === 'locked'
                      ? 'bg-gray-800/50 border border-gray-700/30'
                      : 'bg-cyan-500/10 border border-cyan-500/30'
                    }
                  `}><DayIcon className={`w-6 h-6 ${
                      status === 'completed' ? 'text-emerald-400'
                      : status === 'locked' ? 'text-gray-600'
                      : 'text-cyan-400'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-500 uppercase">{day.dayShort}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${config.badgeColor}`}>
                        {config.badge}
                      </span>
                    </div>
                    <h3 className={`font-bold ${
                      status === 'locked' ? 'text-gray-600' : 'text-white'
                    }`}>
                      {day.title}
                      <span className="text-gray-600 font-normal text-sm ml-2">{day.titlePt}</span>
                    </h3>
                    <p className={`text-sm mt-1 ${
                      status === 'locked' ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {day.description}
                    </p>
                    <span className="text-xs text-gray-600 mt-2 inline-block">{day.duration}</span>
                  </div>

                  {/* Action indicator */}
                  <div className="flex items-center self-center">
                    {status === 'locked' ? (
                      <Lock className="w-5 h-5 text-gray-700" />
                    ) : status === 'completed' ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <NeonButton variant="gradient" onClick={() => router.push('/chat')}>
            <MessageCircle className="w-4 h-4" />
            Free Practice Chat
          </NeonButton>
          <NeonButton variant="purple" onClick={() => router.push('/placement')}>
            Refazer Teste de Nível
          </NeonButton>
        </motion.div>
      </div>
    </div>
  );
}
