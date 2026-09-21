'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Send, ArrowLeft, Volume2, VolumeX, Bot, User,
  Sparkles, Loader2, MessageCircle,
} from 'lucide-react';
import MicrophoneButton from '@/components/MicrophoneButton';
import NeonButton from '@/components/NeonButton';
import { speak, stopSpeaking, isSpeechSynthesisSupported } from '@/lib/speech';
import { useAppStore } from '@/store/useAppStore';
import { Message } from '@/types';

export default function ChatPage() {
  const router = useRouter();
  const { level, incrementStreak } = useAppStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Increment streak on visit
  useEffect(() => {
    incrementStreak();
  }, [incrementStreak]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send initial greeting
  useEffect(() => {
    const greeting: Message = {
      id: 'greeting',
      role: 'assistant',
      content: `Hey! I'm Coach D, your English tutor. 🏆 I see you're at the ${level === 'preta' ? 'Advanced' : level === 'azul' ? 'Intermediate' : 'Beginner'} level — awesome! Let's practice some English. What do you want to talk about today?`,
      timestamp: new Date(),
    };
    setMessages([greeting]);

    // Auto-speak greeting
    if (autoSpeak && isSpeechSynthesisSupported()) {
      setTimeout(() => {
        speakMessage(greeting);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Speak a message aloud
  const speakMessage = useCallback(async (message: Message) => {
    if (!isSpeechSynthesisSupported()) return;

    stopSpeaking();
    setIsSpeaking(true);
    setSpeakingMessageId(message.id);

    try {
      await speak(message.content, {
        rate: 0.9,
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

  // Send a message to the API
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.message || 'Sorry, I had trouble responding. Can you try again?',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Auto-speak the response
      if (autoSpeak) {
        setTimeout(() => speakMessage(assistantMessage), 300);
      }
    } catch {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Oops! Something went wrong. Don't worry, let's try again. Just send me another message!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, autoSpeak, speakMessage]);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  // Handle mic transcript
  const handleTranscript = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="h-screen bg-gray-950 flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[50%] w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[100px]" />
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-1">
                Coach D
                <Sparkles className="w-3 h-3 text-cyan-400" />
              </h1>
              <p className="text-xs text-gray-500">
                {isLoading ? 'Typing...' : isSpeaking ? '🔊 Speaking...' : 'Online'}
              </p>
            </div>
          </div>
        </div>

        {/* Auto-speak toggle */}
        <button
          onClick={() => {
            setAutoSpeak(!autoSpeak);
            if (isSpeaking) stopSpeaking();
          }}
          className={`p-2 rounded-lg transition-all duration-300 ${
            autoSpeak
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'bg-gray-800/50 text-gray-500 border border-gray-700/50'
          }`}
          title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
        >
          {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </motion.header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 relative z-10">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* AI avatar */}
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-100'
                    : 'bg-gray-900/70 border border-gray-800/50 text-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-600">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {/* Speak button for AI messages */}
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => speakMessage(message)}
                      className={`p-1 rounded transition-colors ${
                        speakingMessageId === message.id
                          ? 'text-cyan-400 animate-pulse'
                          : 'text-gray-600 hover:text-cyan-400'
                      }`}
                      title="Play this message"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* User avatar */}
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-purple-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="bg-gray-900/70 border border-gray-800/50 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-sm text-gray-400">Coach D is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <motion.div
        className="relative z-10 border-t border-gray-800/50 bg-gray-950/80 backdrop-blur-sm p-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Mic button */}
          <div className="flex justify-center mb-4">
            <MicrophoneButton
              onTranscript={handleTranscript}
              disabled={isLoading}
              mode="hold"
            />
          </div>

          {/* Text input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message in English..."
              disabled={isLoading}
              className="flex-1 bg-gray-900/50 border border-gray-800/50 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
            />
            <NeonButton
              type="submit"
              variant="cyan"
              size="md"
              disabled={!inputText.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </NeonButton>
          </form>

          <p className="text-center text-xs text-gray-700 mt-2">
            🎙️ Hold the mic to speak • Type or speak in English
          </p>
        </div>
      </motion.div>
    </div>
  );
}
