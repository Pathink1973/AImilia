import React from 'react';

interface VoiceStatusProps {
  isListening: boolean;
  isProcessing: boolean;
  error?: string;
}

export default function VoiceStatus({ isListening, isProcessing }: VoiceStatusProps) {
  return (
    <div className="flex items-center space-x-2">
      {isListening && (
        <span className="text-green-600">Ouvindo...</span>
      )}
      {isProcessing && (
        <span className="text-blue-600">Processando...</span>
      )}
    </div>
  );
}