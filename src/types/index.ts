export interface Message {
  text: string;
  isBot: boolean;
  timestamp: string;
}

export interface Doctor {
  name: string;
  specialty: string;
  location: string;
  contact: string;
}

export interface Medication {
  name: string;
  description: string;
  usage: string;
  sideEffects: string[];
}

export interface CognitiveExercise {
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  benefits: string[];
}
