import { useState, useEffect, useCallback, useRef } from 'react';
import { startSpeechRecognition } from '../utils/speech/speechRecognition';
import { speak, cancelSpeech, isSpeechActive } from '../utils/speech/speechSynthesis';
import type { SpeechError } from '../utils/speech/types';

interface UseVoiceStateProps {
  onSpeechResult: (text: string) => void;
  lastBotMessage?: string;
  onAmplitudeChange?: (amplitude: number) => void;
}

export function useVoiceState({ onSpeechResult, lastBotMessage, onAmplitudeChange }: UseVoiceStateProps) {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isInitialMessage, setIsInitialMessage] = useState(true);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number>();

  const setupRecognitionHandlers = useCallback(() => {
    if (!recognitionRef.current) return;

    console.log(' Configurando handlers do reconhecimento de voz...');

    recognitionRef.current.onresult = (event: any) => {
      try {
        console.log(' Recebido resultado do reconhecimento:', event.results);
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        console.log(' Texto reconhecido:', transcript);
        
        if (event.results[0].isFinal) {
          console.log(' Resultado final recebido, enviando para processamento...');
          onSpeechResult(transcript);
          stopListening();
        }
      } catch (error) {
        console.error(' Erro ao processar resultado do reconhecimento:', error);
        stopListening();
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error(' Erro no reconhecimento de voz:', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      console.log(' Reconhecimento de voz finalizado');
      setIsListening(false);
    };

    recognitionRef.current.onstart = () => {
      console.log(' Reconhecimento de voz iniciado');
      setIsListening(true);
    };

    recognitionRef.current.onaudiostart = () => {
      console.log(' Captura de áudio iniciada');
    };

    recognitionRef.current.onaudioend = () => {
      console.log(' Captura de áudio finalizada');
    };
  }, [onSpeechResult]);

  const setupAudioAnalyser = async () => {
    try {
      console.log(' Solicitando permissão do microfone...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log(' Permissão do microfone concedida');

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      const analyseAudio = () => {
        if (!analyserRef.current || !dataArrayRef.current || !onAmplitudeChange) return;
        
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const amplitude = Array.from(dataArrayRef.current)
          .reduce((acc, val) => acc + val, 0) / dataArrayRef.current.length;
        
        onAmplitudeChange(amplitude / 128); // Normalize to 0-1 range
        animationFrameRef.current = requestAnimationFrame(analyseAudio);
      };

      analyseAudio();
      console.log(' Analisador de áudio configurado com sucesso');
    } catch (error) {
      console.error(' Erro ao configurar analisador de áudio:', error);
    }
  };

  useEffect(() => {
    const initializeSpeech = async () => {
      try {
        console.log(' Iniciando configuração do reconhecimento de voz...');
        
        // Request microphone permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log(' Permissão do microfone concedida');
        
        // Initialize speech recognition
        const recognition = await startSpeechRecognition();
        recognitionRef.current = recognition;
        console.log(' Reconhecimento de voz inicializado');
        
        setupRecognitionHandlers();
        await setupAudioAnalyser();
        console.log(' Configuração completa do reconhecimento de voz');
      } catch (error) {
        console.error(' Erro na inicialização do reconhecimento de voz:', error);
      }
    };

    initializeSpeech();

    return () => {
      console.log(' Limpando recursos do reconhecimento de voz...');
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      cancelSpeech();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      console.log(' Recursos limpos com sucesso');
    };
  }, []);

  useEffect(() => {
    if (lastBotMessage && !isListening && !isMuted) {
      if (isInitialMessage) {
        setIsInitialMessage(false);
        return;
      }

      speak(lastBotMessage)
        .catch((error: SpeechError) => {
          if (error.type === 'synthesis' && error.originalError?.error !== 'interrupted') {
            console.error(' Erro na síntese de voz:', error);
          }
        });
    }
  }, [lastBotMessage, isListening, isMuted, isInitialMessage]);

  const startListening = useCallback(async () => {
    console.log(' Iniciando reconhecimento de voz...');
    
    if (!recognitionRef.current) {
      try {
        console.log(' Inicializando nova instância de reconhecimento...');
        const recognition = await startSpeechRecognition();
        recognitionRef.current = recognition;
        setupRecognitionHandlers();
        console.log(' Nova instância criada com sucesso');
      } catch (error) {
        console.error(' Falha ao inicializar reconhecimento:', error);
        return;
      }
    }

    cancelSpeech();
    try {
      console.log(' Iniciando captura de áudio...');
      await recognitionRef.current.start();
      setIsListening(true);
      console.log(' Reconhecimento iniciado com sucesso');
    } catch (error) {
      console.error(' Falha ao iniciar escuta:', error);
      setIsListening(false);
    }
  }, [setupRecognitionHandlers]);

  const stopListening = useCallback(() => {
    console.log(' Parando reconhecimento de voz...');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log(' Reconhecimento parado com sucesso');
      } catch (error) {
        console.error(' Erro ao parar reconhecimento:', error);
      } finally {
        setIsListening(false);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newState = !prev;
      console.log(` ${newState ? 'Áudio mutado' : 'Áudio desmutado'}`);
      if (!newState && isSpeechActive()) {
        cancelSpeech();
      }
      return newState;
    });
  }, []);

  return {
    isListening,
    isMuted,
    startListening,
    stopListening,
    toggleMute,
  };
}