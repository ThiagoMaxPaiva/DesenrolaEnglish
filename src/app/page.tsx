'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Rocket, Mic, Brain, Trophy, ChevronRight, Sparkles, Globe2 } from 'lucide-react';
import GlassButton from '@/components/GlassButton';
import AnimatedGlobe from '@/components/AnimatedGlobe';
import AnimatedWave from '@/components/AnimatedWave';

const features = [
  {
    icon: Mic,
    title: 'Voice-First Learning',
    description: 'Practice speaking from day one. Our AI listens, corrects, and guides your pronunciation.',
    color: 'text-white font-bold',
    glow: 'group-hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]',
  },
  {
    icon: Brain,
    title: 'AI-Powered Tutor',
    description: 'Conversations that adapt to your level. No scripts — real, dynamic English practice.',
    color: 'text-gray-200',
    glow: 'group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]',
  },
  {
    icon: Trophy,
    title: 'Belt System',
    description: 'Track your progress with Faixa Branca → Azul → Preta. Level up like a true fighter.',
    color: 'text-gray-300',
    glow: 'group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]',
  },
  {
    icon: Globe2,
    title: 'Street-Smart English',
    description: 'Learn real English — slang, idioms, and expressions that natives actually use.',
    color: 'text-gray-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]',
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-pink-500/3 blur-[100px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.04] pointer-events-none">
          <AnimatedGlobe />
        </div>
      </div>

      {/* Navigation */}
      <motion.nav
        className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-white" />
          <span className="text-xl font-black tracking-tight text-white">
            Desenrola English
          </span>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <AnimatedWave className="h-4 mr-2" />
                <span className="text-sm font-semibold tracking-wider text-gray-200">
                  DESENROLA ENGLISH 2027
                </span>
              </div>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight"
            >
              Fale Inglês com <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
                Confiança
              </span>{' '}
              <span className="text-white">de verdade.</span>
            </motion.h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed"
          >
            Chega de traduzir na cabeça. Aprenda inglês falando, ouvindo e
            pensando em inglês — com um tutor de IA que entende seu nível e
            te desafia no ritmo certo.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={fadeInUp}>
            <GlassButton
              variant="primary"
              size="lg"
              onClick={() => router.push('/placement')}
              className="text-lg"
            >
              <Mic className="w-5 h-5" />
              Começar Teste de Nível
              <ChevronRight className="w-5 h-5" />
            </GlassButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-8 mt-16 text-center"
          >
            {[
              { value: '2027', label: 'Meta de fluência' },
              { value: '7 dias', label: 'Plano semanal' },
              { value: '100%', label: 'Por voz' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-3xl font-bold text-white">
                  {stat.value}
                </span>
                <span className="text-sm text-gray-500 mt-1">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.section
          className="pb-24"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-2xl md:text-3xl font-bold text-center text-white mb-12"
          >
            Por que o{' '}
            <span className="text-white font-bold">Desenrola</span> é diferente?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className={`group relative p-6 rounded-2xl bg-white/5 backdrop-blur-md/50 border border-gray-800/50
                  hover:border-gray-700/50 transition-all duration-300 backdrop-blur-sm ${feature.glow}`}
              >
                <feature.icon className={`w-10 h-10 ${feature.color} mb-4`} />
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 py-8 text-center">
          <p className="text-sm text-gray-600">
            Desenrola English © {new Date().getFullYear()} — Feito com 💜 para
            brasileiros que querem desenrolar no inglês.
          </p>
        </footer>
      </main>
    </div>
  );
}
