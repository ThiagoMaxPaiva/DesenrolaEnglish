'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Volume2, ChevronRight, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import NeonButton from '@/components/NeonButton';
import MicrophoneButton from '@/components/MicrophoneButton';
import ProgressBar from '@/components/ProgressBar';
import LevelBadge from '@/components/LevelBadge';
import { placementQuestions, calculateLevel } from '@/lib/placementQuestions';
import { speak, stopSpeaking, isSpeechSynthesisSupported } from '@/lib/speech';
import { useAppStore } from '@/store/useAppStore';
import { PlacementQuestion } from '@/types';

type TestPhase = 'intro' | 'testing' | 'result';

export default function PlacementTestPage() {
  const router = useRouter();
  const { setLevel, setScore, setHasCompletedPlacement } = useAppStore();

  const [phase, setPhase] = useState<TestPhase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [spokenAnswer, setSpokenAnswer] = useState('');
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const currentQuestion = placementQuestions[currentIndex];
  const totalQuestions = placementQuestions.length;
  const progress = ((currentIndex) / totalQuestions) * 100;

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  // Play audio prompt for current question
  const playPrompt = useCallback(async () => {
    if (!currentQuestion || !isSpeechSynthesisSupported()) return;
    setIsSpeakingPrompt(true);
    try {
      await speak(currentQuestion.audioPrompt, {
        rate: 0.9,
        onEnd: () => setIsSpeakingPrompt(false),
      });
    } catch {
      setIsSpeakingPrompt(false);
    }
  }, [currentQuestion]);

  // Auto-play prompt when question changes
  useEffect(() => {
    if (phase === 'testing' && currentQuestion) {
      const timer = setTimeout(() => playPrompt(), 500);
      return () => clearTimeout(timer);
    }
  }, [phase, currentIndex, currentQuestion, playPrompt]);

  // Score a listen-select answer
  const handleSelectOption = (option: string) => {
    if (showFeedback) return;
    setSelectedOption(option);
    const isCorrect = option === currentQuestion.options?.[0]; // First option is always correct
    const points = isCorrect ? currentQuestion.points : Math.floor(currentQuestion.points * 0.2);
    setScores((prev) => [...prev, points]);
    setShowFeedback(true);
  };

  // Score a spoken answer
  const handleSpokenAnswer = (transcript: string) => {
    setSpokenAnswer(transcript);
    const keywords = currentQuestion.expectedKeywords || [];
    const lowerTranscript = transcript.toLowerCase();
    const matchCount = keywords.filter((kw) => lowerTranscript.includes(kw.toLowerCase())).length;
    const ratio = keywords.length > 0 ? matchCount / keywords.length : 0;

    // Also give points for length (attempting to speak)
    const lengthBonus = Math.min(transcript.split(' ').length / 10, 1) * 0.3;
    const finalRatio = Math.min(ratio + lengthBonus, 1);
    const points = Math.round(currentQuestion.points * finalRatio);

    setScores((prev) => [...prev, points]);
    setShowFeedback(true);
  };

  // Move to next question
  const handleNext = () => {
    stopSpeaking();
    setShowFeedback(false);
    setSelectedOption(null);
    setSpokenAnswer('');

    if (currentIndex + 1 >= totalQuestions) {
      // Calculate final result
      const totalScore = scores.reduce((a, b) => a + b, 0);
      const result = calculateLevel(totalScore);
      setLevel(result.level);
      setScore(totalScore);
      setHasCompletedPlacement(true);
      setPhase('result');
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Restart test
  const handleRestart = () => {
    setPhase('intro');
    setCurrentIndex(0);
    setScores([]);
    setSelectedOption(null);
    setSpokenAnswer('');
    setShowFeedback(false);
  };

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const result = phase === 'result' ? calculateLevel(totalScore) : null;

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* ─── INTRO PHASE ─── */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              className="flex flex-col items-center text-center gap-8 pt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="w-10 h-10 text-cyan-400" />
              </motion.div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Teste de Nivelamento
                </h1>
                <p className="text-gray-400 text-lg max-w-md">
                  Vamos descobrir seu nível de inglês! Você vai ouvir prompts e
                  responder com a voz ou selecionar a melhor resposta.
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50 w-full max-w-md">
                <h3 className="text-white font-semibold mb-3">Como funciona:</h3>
                <ul className="text-left text-gray-400 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">▶</span>
                    <span>5 desafios de dificuldade crescente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">▶</span>
                    <span>Ouça o prompt e responda com sua voz</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">▶</span>
                    <span>Receba sua classificação: Faixa Branca, Azul ou Preta</span>
                  </li>
                </ul>
              </div>

              <NeonButton variant="gradient" size="lg" onClick={() => setPhase('testing')}>
                <Volume2 className="w-5 h-5" />
                Iniciar Teste
                <ChevronRight className="w-5 h-5" />
              </NeonButton>
            </motion.div>
          )}

          {/* ─── TESTING PHASE ─── */}
          {phase === 'testing' && currentQuestion && (
            <motion.div
              key={`question-${currentIndex}`}
              className="flex flex-col gap-6 pt-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {currentQuestion.difficulty}
                  </span>
                </div>
                <ProgressBar value={progress} showPercentage={false} size="sm" />
              </div>

              {/* Prompt card */}
              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50">
                <p className="text-gray-300 mb-4">{currentQuestion.prompt}</p>

                {/* Audio prompt button */}
                <button
                  onClick={playPrompt}
                  disabled={isSpeakingPrompt}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isSpeakingPrompt
                      ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-300'
                      : 'bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-cyan-300 hover:border-cyan-500/30'
                  }`}
                >
                  <Volume2 className={`w-5 h-5 ${isSpeakingPrompt ? 'animate-pulse' : ''}`} />
                  <span className="text-sm">
                    {isSpeakingPrompt ? 'Playing...' : 'Play prompt'}
                  </span>
                </button>
              </div>

              {/* Answer area */}
              {currentQuestion.type === 'listen-select' && currentQuestion.options ? (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleSelectOption(option)}
                      disabled={showFeedback}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                        showFeedback && selectedOption === option
                          ? option === currentQuestion.options![0]
                            ? 'bg-emerald-500/10 border-emerald-400/50 text-emerald-300'
                            : 'bg-red-500/10 border-red-400/50 text-red-300'
                          : showFeedback && option === currentQuestion.options![0]
                          ? 'bg-emerald-500/10 border-emerald-400/50 text-emerald-300'
                          : selectedOption === option
                          ? 'bg-cyan-500/10 border-cyan-400/50 text-cyan-300'
                          : 'bg-gray-900/30 border-gray-800/50 text-gray-300 hover:border-gray-700/50'
                      }`}
                      whileHover={showFeedback ? {} : { scale: 1.02 }}
                      whileTap={showFeedback ? {} : { scale: 0.98 }}
                    >
                      <span className="text-sm">{option}</span>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-4">
                  {!showFeedback ? (
                    <MicrophoneButton
                      onTranscript={handleSpokenAnswer}
                      onListeningChange={setIsListening}
                      mode="hold"
                    />
                  ) : (
                    <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-800/50 w-full">
                      <p className="text-xs text-gray-500 mb-1">You said:</p>
                      <p className="text-gray-300">{spokenAnswer || '(no speech detected)'}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Next button */}
              {showFeedback && (
                <motion.div
                  className="flex justify-center pt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <NeonButton variant="cyan" onClick={handleNext}>
                    {currentIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question'}
                    <ChevronRight className="w-4 h-4" />
                  </NeonButton>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ─── RESULT PHASE ─── */}
          {phase === 'result' && result && (
            <motion.div
              key="result"
              className="flex flex-col items-center text-center gap-8 pt-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle2 className="w-16 h-16 text-emerald-400" />
              </motion.div>

              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Resultado</h1>
                <p className="text-gray-400">Seu nível de inglês é:</p>
              </div>

              <motion.div
                className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800/50 w-full max-w-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-center mb-4">
                  <LevelBadge level={result.level} size="lg" />
                </div>
                <p className="text-gray-300 mt-4">{result.levelDescription}</p>
                <div className="mt-4 pt-4 border-t border-gray-800/50">
                  <span className="text-sm text-gray-500">Score: </span>
                  <span className="text-lg font-bold text-cyan-400">{totalScore} points</span>
                </div>
              </motion.div>

              <div className="flex gap-4">
                <NeonButton variant="purple" onClick={handleRestart}>
                  <RotateCcw className="w-4 h-4" />
                  Refazer Teste
                </NeonButton>
                <NeonButton variant="gradient" onClick={() => router.push('/dashboard')}>
                  Ir para Dashboard
                  <ChevronRight className="w-4 h-4" />
                </NeonButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
