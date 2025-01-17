import { SpeechError } from './types';

export function createSpeechRecognitionError(message: string, originalError?: any): SpeechError {
  const error = new Error(message) as SpeechError;
  error.type = 'recognition';
  error.originalError = originalError;
  return error;
}

export function startSpeechRecognition(): Promise<SpeechRecognition> {
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    throw createSpeechRecognitionError('Reconhecimento de voz não suportado neste navegador');
  }

  const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionConstructor();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'pt-PT';

  return new Promise((resolve, reject) => {
    recognition.onerror = (event: SpeechRecognitionError) => {
      reject(createSpeechRecognitionError('Erro no reconhecimento de voz', event));
    };

    // Return the recognition instance immediately
    resolve(recognition);
  });
}