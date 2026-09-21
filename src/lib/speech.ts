/**
 * Speech utilities for Desenrola English
 * Wraps Web Speech API (SpeechRecognition + SpeechSynthesis)
 * with error handling and browser compatibility checks.
 */

// ─── Browser compatibility types ───────────────────────────────
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

/** Minimal SpeechRecognition interface for cross-browser compat */
interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

// ─── Check browser support ────────────────────────────────────
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(
    (window as unknown as Record<string, unknown>).SpeechRecognition ||
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition
  );
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

// ─── Get SpeechRecognition constructor ────────────────────────
function getSpeechRecognition(): new () => ISpeechRecognition {
  const w = window as unknown as Record<string, unknown>;
  const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!SR) throw new Error('SpeechRecognition not supported');
  return SR as unknown as new () => ISpeechRecognition;
}

// ─── Speech-to-Text ───────────────────────────────────────────
export interface STTOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export function createSpeechRecognition(options: STTOptions = {}) {
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true,
    onResult,
    onError,
    onEnd,
  } = options;

  const SRConstructor = getSpeechRecognition();
  const recognition = new SRConstructor();

  recognition.lang = language;
  recognition.continuous = continuous;
  recognition.interimResults = interimResults;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const result = event.results[event.resultIndex];
    const transcript = result[0].transcript;
    const isFinal = result.isFinal;
    onResult?.(transcript, isFinal);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    let errorMessage = 'An error occurred with speech recognition.';
    switch (event.error) {
      case 'no-speech':
        errorMessage = 'No speech was detected. Please try again.';
        break;
      case 'audio-capture':
        errorMessage = 'No microphone was found. Please check your device.';
        break;
      case 'not-allowed':
        errorMessage = 'Microphone permission was denied. Please allow access in your browser settings.';
        break;
      case 'network':
        errorMessage = 'A network error occurred. Please check your connection.';
        break;
      case 'aborted':
        errorMessage = 'Speech recognition was aborted.';
        break;
      default:
        errorMessage = `Speech recognition error: ${event.error}`;
    }
    onError?.(errorMessage);
  };

  recognition.onend = () => {
    onEnd?.();
  };

  return recognition;
}

// ─── Text-to-Speech ───────────────────────────────────────────
export interface TTSOptions {
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

/**
 * Get the best English voice available.
 * Prefers natural-sounding voices, falls back to any English voice.
 */
export function getEnglishVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisSupported()) return null;

  const voices = window.speechSynthesis.getVoices();
  const englishVoices = voices.filter((v) => v.lang.startsWith('en'));

  // Prefer natural/premium voices
  const natural = englishVoices.find(
    (v) =>
      v.name.toLowerCase().includes('natural') ||
      v.name.toLowerCase().includes('premium') ||
      v.name.toLowerCase().includes('enhanced')
  );
  if (natural) return natural;

  // Prefer US English
  const usVoice = englishVoices.find((v) => v.lang === 'en-US');
  if (usVoice) return usVoice;

  // Any English voice
  return englishVoices[0] || null;
}

/**
 * Speak text aloud using SpeechSynthesis.
 * Returns a promise that resolves when speaking finishes.
 */
export function speak(text: string, options: TTSOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      options.onError?.('Speech synthesis is not supported in this browser.');
      reject(new Error('SpeechSynthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = options.voice || getEnglishVoice();
    utterance.rate = options.rate ?? 0.95;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    utterance.onstart = () => options.onStart?.();

    utterance.onend = () => {
      options.onEnd?.();
      resolve();
    };

    utterance.onerror = (event) => {
      const errorMsg = `Speech synthesis error: ${event.error}`;
      options.onError?.(errorMsg);
      reject(new Error(errorMsg));
    };

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stop any ongoing speech.
 */
export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Request microphone permission explicitly.
 */
export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
}
