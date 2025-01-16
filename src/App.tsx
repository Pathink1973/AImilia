import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Brain, Send } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingState from './components/LoadingState';
import ChatbaseButton from './components/ChatbaseButton';
import VoiceSphere from './components/VoiceSphere';
import Footer from './components/Footer';
import { getChatGPTResponse } from './utils/openai';
import { useVoiceState } from './hooks/useVoiceState';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Olá! Sou a Emília a sua tutora especializada em Alzheimer. Como posso ajudar?", 
      isBot: true,
      timestamp: new Date().toLocaleString('pt-PT')
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceAmplitude, setVoiceAmplitude] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isListening,
    isMuted,
    startListening,
    stopListening,
    toggleMute,
  } = useVoiceState({
    onSpeechResult: handleVoiceResult,
    lastBotMessage: messages[messages.length - 1]?.text,
    onAmplitudeChange: setVoiceAmplitude,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleVoiceResult(text: string) {
    if (!text.trim()) return;
    
    const newMessage: Message = {
      text,
      isBot: false,
      timestamp: new Date().toLocaleString('pt-PT')
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsProcessing(true);

    try {
      const response = await getChatGPTResponse(text, messages.slice(1));
      const botMessage: Message = {
        text: response,
        isBot: true,
        timestamp: new Date().toLocaleString('pt-PT')
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: Message = {
        text: "Desculpe, ocorreu um erro. Por favor, tente novamente.",
        isBot: true,
        timestamp: new Date().toLocaleString('pt-PT')
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const text = inputText.trim();
    setInputText('');
    await handleVoiceResult(text);
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-sm z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h1 className="text-xl font-semibold text-gray-800">
                  AImilia® Tutor AI - Alzheimer
                </h1>
              </div>
              <ChatbaseButton />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 pt-24 pb-40">
          {/* Voice Sphere */}
          <div className="flex justify-center mb-8">
            <VoiceSphere 
              isActive={!isProcessing} 
              isSpeaking={isListening} 
              amplitude={voiceAmplitude}
            />
          </div>

          {/* Messages */}
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    message.isBot
                      ? 'bg-white shadow-sm'
                      : 'bg-purple-500 text-white'
                  }`}
                >
                  <p className="text-lg">{message.text}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-white shadow-sm">
                  <LoadingState />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <div className="fixed bottom-12 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-lg z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form onSubmit={handleTextSubmit} className="flex items-center gap-4">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing || !inputText.trim()}
                className="p-3 rounded-xl bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-6 h-6" />
              </button>
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`p-3 rounded-xl transition-all ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-purple-500 hover:bg-purple-600'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}