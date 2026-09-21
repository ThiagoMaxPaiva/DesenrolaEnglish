'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChat } from 'ai/react';
import {
  Send, ArrowLeft, Volume2, VolumeX, Bot, User,
  Sparkles, Loader2, AlertCircle
} from 'lucide-react';
import MicrophoneButton from '@/components/MicrophoneButton';
import GlassButton from '@/components/GlassButton';
import { speak, stopSpeaking, isSpeechSynthesisSupported } from '@/lib/speech';
import { useAppStore } from '@/store/useAppStore';
import { weeklyPlan } from '@/lib/weeklyPlan';

function ChatInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dayId = searchParams.get('day');
  
  const currentDay = weeklyPlan.find(d => d.id === dayId);

  const { level, incrementStreak } = useAppStore();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Vercel AI SDK useChat hook
  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } = useChat({
    api: '/api/chat',
    body: { dayId },
    onFinish: (message) => {
      if (autoSpeak) {
        speakMessage(message.content, message.id);
      }
    },
    onError: (err) => {
      console.error('Chat error:', err);
    }
  });

  useEffect(() => {
    incrementStreak();
  }, [incrementStreak]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greetingId = 'greeting-1';
      let text = `Hey! I'm Coach D. Let's practice some English. What do you want to talk about today?`;
      
      if (currentDay) {
        text = `Welcome to the "${currentDay.title}" immersion! 🌎 I'm getting into character right now... Let's start the roleplay whenever you're ready! (Speak or type your first sentence)`;
      }

      setMessages([{ id: greetingId, role: 'assistant', content: text }]);
      
      if (autoSpeak && isSpeechSynthesisSupported()) {
        setTimeout(() => speakMessage(text, greetingId), 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDay]);

  const speakMessage = useCallback(async (text: string, id: string) => {
    if (!isSpeechSynthesisSupported()) return;

    stopSpeaking();
    setIsSpeaking(true);
    setSpeakingMessageId(id);

    try {
      await speak(text, {
        rate: 0.95,
        onEnd: () => {
          setIsSpeaking(false);
          setSpeakingMessageId(null);
        },
        onError: () => {
          setIsSpeaking(false);
          setSpeakingMessageId(null);
        },
      });
    } catch {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    }
  }, []);

  const handleTranscript = (text: string) => {
    if (text.trim() && !isLoading) {
      append({ role: 'user', content: text });
    }
  };

  return (
    <>
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-gray-800/50 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="text-gray-500 hover:text-gray-300 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-md p-1">
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Voltar ao Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-1">
                Coach D <Sparkles className="w-3 h-3 text-white font-bold" />
              </h1>
              <p className="text-xs text-gray-400">
                {isLoading ? 'Typing...' : isSpeaking ? '🔊 Speaking...' : 'Online'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setAutoSpeak(!autoSpeak);
            if (isSpeaking) stopSpeaking();
          }}
          className={`p-2 rounded-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-500 ${
            autoSpeak ? 'bg-cyan-500/10 text-white font-bold border border-white/10' : 'bg-gray-800/50 text-gray-500 border border-gray-700/50'
          }`}
          title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
        >
          {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="sr-only">Alternar leitura automática de mensagens</span>
        </button>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 relative z-10">
        {!process.env.NEXT_PUBLIC_GEMINI_READY && (
           <div className="mb-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex gap-2 items-start text-yellow-200/80 text-xs max-w-lg mx-auto">
             <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
             <p>Configure a variável GEMINI_API_KEY no arquivo .env.local para habilitar a IA real. No momento você está interagindo com as mensagens de demonstração (fallback).</p>
           </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white font-bold" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-cyan-600/20 border border-cyan-500/20 text-cyan-50'
                    : 'bg-white/5 backdrop-blur-md border border-gray-800 text-gray-100'
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <div className="flex items-center justify-end mt-2">
                  {message.role === 'assistant' && !isLoading && (
                    <button
                      onClick={() => speakMessage(message.content, message.id)}
                      className={`p-1 rounded transition-colors focus-visible:ring-1 focus-visible:ring-cyan-500 ${
                        speakingMessageId === message.id ? 'text-white font-bold animate-pulse' : 'text-gray-500 hover:text-white font-bold'
                      }`}
                      aria-label="Ouvir mensagem"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-purple-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white font-bold" />
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-gray-800 rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-white font-bold animate-spin" />
              <span className="text-sm text-gray-400">Coach D is thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="relative z-10 border-t border-gray-800/80 bg-black p-4">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          <div className="flex justify-center">
            <MicrophoneButton onTranscript={handleTranscript} disabled={isLoading} mode="hold" />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message in English..."
              disabled={isLoading}
              className="flex-1 bg-white/5 backdrop-blur-md border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-50"
              aria-label="Campo de texto da mensagem"
            />
            <GlassButton type="submit" variant="primary" size="md" disabled={!input.trim() || isLoading} className="shrink-0" aria-label="Enviar mensagem">
              <Send className="w-4 h-4" />
            </GlassButton>
          </form>
          <p className="text-center text-xs text-gray-600">
            🎙️ Segure o microfone para falar • Digite ou fale em inglês
          </p>
        </div>
      </div>
    </>
  );
}

export default function ChatPage() {
  return (
    <div className="h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[50%] w-[300px] h-[300px] rounded-full bg-white/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[300px] h-[300px] rounded-full bg-white/5 blur-[100px]" />
      </div>
      
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center relative z-10">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      }>
        <ChatInterface />
      </Suspense>
    </div>
  );
}
