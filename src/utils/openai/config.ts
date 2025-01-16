import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// More robust API key validation
const isValidKey = (key: string | undefined): boolean => {
  if (!key) return false;
  if (typeof key !== 'string') return false;
  if (!key.startsWith('sk-')) return false;
  if (key.length < 40) return false;
  return true;
};

export const isDemo = !isValidKey(OPENAI_API_KEY);

// Create OpenAI client with proper error handling
export const openai = new OpenAI({
  apiKey: isValidKey(OPENAI_API_KEY) ? OPENAI_API_KEY : 'dummy-key',
  dangerouslyAllowBrowser: true,
  maxRetries: 3,
  timeout: 30000
});

// Mock response for demo mode
export const getMockResponse = () => {
  return "Olá! Para utilizar todas as funcionalidades do assistente, por favor configure uma chave API OpenAI válida no arquivo .env";
};