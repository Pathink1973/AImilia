import { SpeechError } from './types';

export function createSpeechRecognitionError(message: string, originalError?: any): SpeechError {
  const error = new Error(message) as SpeechError;
  error.type = 'recognition';
  error.originalError = originalError;
  return error;
}

export function startSpeechRecognition(): Promise<string> {
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    throw createSpeechRecognitionError('Reconhecimento de voz não suportado neste navegador');
  }

  const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionConstructor();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'pt-PT';

  return new Promise((resolve, reject) => {
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionError) => {
      reject(createSpeechRecognitionError('Erro no reconhecimento de voz', event));
    };

    recognition.start();
  });
}