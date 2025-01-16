import { SpeechConfig, SpeechError } from './types';
import { voiceManager } from './voiceManager';

let currentUtterance: SpeechSynthesisUtterance | null = null;
let isSpeaking = false;
let hasSpokenInitialGreeting = false;
let cachedVoice: SpeechSynthesisVoice | null = null;

const defaultConfig: SpeechConfig = {
  lang: import.meta.env.VITE_VOICE_LANGUAGE || 'pt-PT',
  pitch: Number(import.meta.env.VITE_VOICE_PITCH) || 1.05,
  rate: Number(import.meta.env.VITE_VOICE_RATE) || 0.95,
  volume: 1.0
};

export function cancelSpeech() {
  if (currentUtterance || isSpeaking) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
    isSpeaking = false;
  }
}

function createSpeechError(message: string, originalError?: any): SpeechError {
  const error = new Error(message) as SpeechError;
  error.type = 'synthesis';
  error.originalError = originalError;
  return error;
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/([.!?])\s*\1+/g, '$1')
    .trim();
}

function getPortugueseVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  
  // Procura por vozes específicas em ordem de preferência
  const voicePreferences = [
    // Joana - voz portuguesa de alta qualidade
    (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('joana') && v.lang.includes('pt-PT'),
    // Qualquer voz feminina portuguesa
    (v: SpeechSynthesisVoice) => v.lang.includes('pt-PT') && v.name.toLowerCase().includes('female'),
    // Qualquer voz portuguesa
    (v: SpeechSynthesisVoice) => v.lang.includes('pt-PT'),
    // Fallback para português do Brasil feminino
    (v: SpeechSynthesisVoice) => v.lang.includes('pt-BR') && v.name.toLowerCase().includes('female'),
    // Último recurso: qualquer voz em português
    (v: SpeechSynthesisVoice) => v.lang.includes('pt')
  ];

  for (const preference of voicePreferences) {
    const voice = voices.find(preference);
    if (voice) {
      cachedVoice = voice;
      return voice;
    }
  }

  return null;
}

export async function speak(text: string, config: Partial<SpeechConfig> = {}): Promise<void> {
  if (!text.trim()) return Promise.resolve();

  // Cancel any ongoing speech
  cancelSpeech();

  return new Promise((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance(cleanText(text));
      currentUtterance = utterance;
      
      // Usa a voz em cache ou obtém uma nova
      const voice = getPortugueseVoice();
      if (voice) {
        utterance.voice = voice;
      }

      // Configure speech with Portuguese European settings
      utterance.lang = voice?.lang || 'pt-PT';
      utterance.pitch = config.pitch || defaultConfig.pitch;
      utterance.rate = config.rate || defaultConfig.rate;
      utterance.volume = config.volume || defaultConfig.volume;

      // Event handlers
      utterance.onstart = () => {
        isSpeaking = true;
      };

      utterance.onend = () => {
        isSpeaking = false;
        currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        const error = event as SpeechSynthesisErrorEvent;
        let errorMessage = 'Erro na síntese de voz';
        
        if (error.error === 'not-allowed') {
          errorMessage = 'Permissão para síntese de voz negada';
        } else if (error.error === 'synthesis-unavailable') {
          errorMessage = 'Síntese de voz não disponível';
        } else if (error.error === 'language-unavailable') {
          errorMessage = 'Idioma não disponível para síntese';
        }
        
        reject(createSpeechError(errorMessage, error));
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      reject(createSpeechError('Speech synthesis initialization failed', error));
    }
  });
}

export function isSpeechActive(): boolean {
  return isSpeaking;
}

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && isSpeaking && currentUtterance) {
    window.speechSynthesis.resume();
  }
});

// Periodic check to prevent speech synthesis from getting stuck
setInterval(() => {
  if (isSpeaking && currentUtterance) {
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
  }
}, 5000);

// Cleanup on page unload
window.addEventListener('beforeunload', cancelSpeech);