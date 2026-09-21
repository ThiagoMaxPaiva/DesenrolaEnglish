'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, CheckCircle2, PlayCircle, BookOpen, Mic, Headset } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { weeklyPlan } from '@/lib/weeklyPlan';
import { TaskStatus, WeekDay } from '@/types';
import ProgressBar from '@/components/ProgressBar';
import StreakCounter from '@/components/StreakCounter';
import LevelBadge from '@/components/LevelBadge';
import NeonButton from '@/components/NeonButton';

export default function DashboardPage() {
  const router = useRouter();
  const {
    level, streak, weeklyProgress,
    hasCompletedPlacement, incrementStreak, updateTaskStatus,
  } = useAppStore();

  const [selectedDay, setSelectedDay] = useState<WeekDay | null>(null);

  useEffect(() => {
    if (!hasCompletedPlacement) {
      router.push('/placement');
    }
  }, [hasCompletedPlacement, router]);

  useEffect(() => {
    incrementStreak();
  }, [incrementStreak]);

  const completedCount = Object.values(weeklyProgress).filter((s) => s === 'completed').length;
  const weekProgress = (completedCount / 7) * 100;

  const getMotivation = () => {
    if (weekProgress === 100) return '🎉 You crushed it this week! You\'re a legend!';
    if (weekProgress >= 70) return '🔥 Almost there! Keep the momentum going!';
    if (weekProgress >= 40) return '💪 Good progress! Don\'t stop now!';
    if (streak >= 3) return `⚡ ${streak}-day streak! You\'re building a habit!`;
    return '🚀 Let\'s get this week started! Bora desenrolar!';
  };

  const handleTaskClick = (day: WeekDay, status: TaskStatus) => {
    if (status === 'locked') return;
    if (status === 'available') {
      updateTaskStatus(day.id, 'in-progress');
    }
    setSelectedDay(day);
  };

  const startImmersion = () => {
    if (selectedDay) {
      // Pass the selected day via URL so chat knows the context
      router.push(`/chat?day=${selectedDay.id}`);
    }
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
                O Corre da Semana
              </h1>
              <p className="text-gray-400 text-sm mt-1">{getMotivation()}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <StreakCounter streak={streak} />
            <LevelBadge level={level} />
          </div>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          className="mb-10 bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-100">Progresso Semanal</h2>
              <p className="text-gray-400 text-sm">{completedCount} de 7 missões completas</p>
            </div>
            <span className="text-cyan-400 font-bold font-mono">{Math.round(weekProgress)}%</span>
          </div>
          <ProgressBar value={weekProgress} />
        </motion.div>

        {/* Roadmap Grid or Selected Day Details */}
        <AnimatePresence mode="wait">
          {!selectedDay ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {weeklyPlan.map((day, index) => {
                const status = weeklyProgress[day.id];
                const isLocked = status === 'locked';
                const isCompleted = status === 'completed';
                const isInProgress = status === 'in-progress';

                return (
                  <motion.div
                    key={day.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => handleTaskClick(day, status)}
                    className={`
                      relative p-5 rounded-2xl border transition-all duration-300
                      ${isLocked
                        ? 'bg-gray-900/30 border-gray-800/50 opacity-60 cursor-not-allowed'
                        : 'bg-gray-900/80 border-gray-700 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] cursor-pointer'
                      }
                      ${isInProgress ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : ''}
                      ${isCompleted ? 'border-emerald-500/50 bg-emerald-950/20' : ''}
                    `}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl filter drop-shadow-md">{day.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{day.dayShort}</div>
                          <div className="text-sm font-semibold text-gray-200">{day.duration}</div>
                        </div>
                      </div>
                      <div className="text-gray-500">
                        {isLocked && <Lock className="w-5 h-5" />}
                        {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {isInProgress && <PlayCircle className="w-5 h-5 text-cyan-400" />}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">{day.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{day.titlePt}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-gray-900/80 border border-cyan-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm"
            >
              <button
                onClick={() => setSelectedDay(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar para a semana
              </button>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{selectedDay.icon}</span>
                <div>
                  <h2 className="text-3xl font-bold text-white">{selectedDay.title}</h2>
                  <p className="text-cyan-400 font-medium">{selectedDay.titlePt}</p>
                </div>
              </div>

              <p className="text-gray-300 mb-8">{selectedDay.description}</p>

              {/* Fluency Cycle Steps */}
              <div className="space-y-6">
                {/* Step 1: Teoria */}
                <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Etapa 1: Preparação (Teoria)</h3>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedDay.vocabulary.map((vocab, i) => (
                      <li key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                        <span className="block font-bold text-gray-200">{vocab.en}</span>
                        <span className="block text-sm text-gray-500">{vocab.pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Step 2: Prática */}
                <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                      <Mic className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Etapa 2: Aquecimento (Prática)</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Leia essas frases em voz alta antes de entrar na conversa real:</p>
                  <ul className="space-y-2">
                    {selectedDay.practicePhrases.map((phrase, i) => (
                      <li key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-gray-200 font-medium">
                        "{phrase}"
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Step 3: Imersão */}
                <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-5 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                      <Headset className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Etapa 3: Imersão (Intercâmbio)</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Agora é com você. O Coach D vai interpretar um personagem neste cenário. Tente usar o vocabulário que você acabou de aprender.
                  </p>
                  <NeonButton variant="cyan" size="lg" className="w-full sm:w-auto px-12" onClick={startImmersion}>
                    Iniciar Conversa
                  </NeonButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
