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

  useEffect(() => {
    try {
      recognitionRef.current = startSpeechRecognition();
      setupRecognitionHandlers();
      setupAudioAnalyser();
    } catch (error) {
      console.debug('Speech recognition initialization:', error);
    }

    return () => {
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
    };
  }, []);

  const setupAudioAnalyser = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
    } catch (error) {
      console.debug('Audio analyser setup:', error);
    }
  };

  const setupRecognitionHandlers = useCallback(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = (event: any) => {
      try {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        if (event.results[0].isFinal) {
          onSpeechResult(transcript);
          stopListening();
        }
      } catch (error) {
        console.debug('Speech recognition result:', error);
        stopListening();
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.debug('Speech recognition error:', event);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  }, [onSpeechResult]);

  useEffect(() => {
    if (lastBotMessage && !isListening && !isMuted) {
      if (isInitialMessage) {
        setIsInitialMessage(false);
        return;
      }

      speak(lastBotMessage)
        .catch((error: SpeechError) => {
          if (error.type === 'synthesis' && error.originalError?.error !== 'interrupted') {
            console.debug('Speech error:', error);
          }
        });
    }
  }, [lastBotMessage, isListening, isMuted, isInitialMessage]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      cancelSpeech();
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        setIsListening(false);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } finally {
        setIsListening(false);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev && isSpeechActive()) {
        cancelSpeech();
      }
      return !prev;
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