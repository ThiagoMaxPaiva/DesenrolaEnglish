'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import {
  isSpeechRecognitionSupported,
  createSpeechRecognition,
  requestMicrophonePermission,
} from '@/lib/speech';

interface MicrophoneButtonProps {
  onTranscript: (text: string) => void;
  onListeningChange?: (isListening: boolean) => void;
  disabled?: boolean;
  mode?: 'hold' | 'toggle';
}

export default function MicrophoneButton({
  onTranscript,
  onListeningChange,
  disabled = false,
  mode = 'hold',
}: MicrophoneButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<ReturnType<typeof createSpeechRecognition> | null>(null);
  const isSupported = isSpeechRecognitionSupported();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    // Request mic permission first
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setError('Microphone access denied. Please allow microphone in your browser settings.');
      return;
    }

    setError(null);
    setInterimText('');

    try {
      const recognition = createSpeechRecognition({
        language: 'en-US',
        continuous: mode === 'toggle',
        interimResults: true,
        onResult: (transcript, isFinal) => {
          if (isFinal) {
            onTranscript(transcript);
            setInterimText('');
            if (mode === 'hold') {
              setIsListening(false);
              onListeningChange?.(false);
            }
          } else {
            setInterimText(transcript);
          }
        },
        onError: (errorMsg) => {
          setError(errorMsg);
          setIsListening(false);
          onListeningChange?.(false);
        },
        onEnd: () => {
          setIsListening(false);
          onListeningChange?.(false);
        },
      });

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
      onListeningChange?.(true);
    } catch {
      setError('Failed to start speech recognition. Please try again.');
    }
  }, [isSupported, mode, onTranscript, onListeningChange]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    onListeningChange?.(false);
  }, [onListeningChange]);

  const handleMouseDown = () => {
    if (mode === 'hold' && !disabled) {
      startListening();
    }
  };

  const handleMouseUp = () => {
    if (mode === 'hold' && isListening) {
      stopListening();
    }
  };

  const handleClick = () => {
    if (mode === 'toggle') {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Mic Button */}
      <motion.button
        type="button"
        disabled={disabled || !isSupported}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={mode === 'hold' && isListening ? handleMouseUp : undefined}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onClick={mode === 'toggle' ? handleClick : undefined}
        className={`
          relative w-16 h-16 rounded-full flex items-center justify-center
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isListening
            ? 'bg-red-500/20 border-2 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
            : 'bg-cyan-500/10 border-2 border-cyan-400/50 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]'
          }
        `}
        whileHover={disabled ? {} : { scale: 1.1 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
      >
        {/* Pulse rings when listening */}
        <AnimatePresence>
          {isListening && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-red-400/30"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.5 + i * 0.3, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Icon */}
        {isListening ? (
          <Mic className="w-7 h-7 text-red-400 relative z-10" />
        ) : !isSupported ? (
          <MicOff className="w-7 h-7 text-gray-500 relative z-10" />
        ) : (
          <Mic className="w-7 h-7 text-cyan-400 relative z-10" />
        )}
      </motion.button>

      {/* Status label */}
      <AnimatePresence mode="wait">
        {isListening ? (
          <motion.p
            key="listening"
            className="text-xs text-red-400 font-medium"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {mode === 'hold' ? '🎙️ Listening... Release to send' : '🎙️ Listening... Tap to stop'}
          </motion.p>
        ) : (
          <motion.p
            key="idle"
            className="text-xs text-gray-500"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {mode === 'hold' ? 'Hold to speak' : 'Tap to speak'}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Interim transcript */}
      <AnimatePresence>
        {interimText && (
          <motion.div
            className="max-w-xs text-center px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-sm text-gray-300 italic">{interimText}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-center gap-2 max-w-xs text-center px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
