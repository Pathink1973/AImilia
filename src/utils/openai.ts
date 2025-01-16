import OpenAI from 'openai';
import { Message } from '../types';
import {
  findDoctorsBySpecialty,
  findMedicationsByCondition,
  getMedicationDetails,
  getDoctorDetails,
  cognitiveExercises
} from '../data/medical-database';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `Você é um assistente especializado em Alzheimer e demência, usando português de Portugal.

COMPETÊNCIAS PRINCIPAIS:
1. Avaliação cognitiva e comportamental
2. Orientação a cuidadores e familiares
3. Gestão de sintomas e medicação
4. Estratégias de estimulação cognitiva
5. Monitorização de progressão da doença
6. Suporte emocional e psicológico

DIRETRIZES DE COMUNICAÇÃO:
1. Use português de Portugal (não brasileiro)
2. Adapte o nível de complexidade ao interlocutor
3. Forneça exemplos práticos e concretos
4. Use analogias familiares quando necessário
5. Mantenha um tom empático e profissional

ÁREAS DE CONHECIMENTO ESPECÍFICO:
1. Estágios da Doença de Alzheimer:
   - Fase inicial (esquecimento, desorientação leve)
   - Fase intermediária (confusão, mudanças comportamentais)
   - Fase avançada (dependência total, perda de funções)

2. Sintomas e Gestão:
   - Perda de memória e cognição
   - Alterações comportamentais
   - Distúrbios do sono
   - Agitação e ansiedade
   - Desorientação espacial/temporal
   - Dificuldades de comunicação

3. Intervenções Não-Farmacológicas:
   - Estimulação cognitiva
   - Terapia ocupacional
   - Atividade física
   - Socialização
   - Rotinas estruturadas
   - Adaptações ambientais`;

async function formatMedicalInfo(query: string) {
  const queryLower = query.toLowerCase();
  let relevantContext = '';

  // Buscar médicos relevantes
  if (queryLower.includes('médico') || queryLower.includes('doutor') || queryLower.includes('especialista')) {
    const doctors = findDoctorsBySpecialty('Neurologia');
    if (doctors.length > 0) {
      relevantContext += '\nEspecialistas disponíveis:\n';
      doctors.forEach(doc => {
        relevantContext += `- ${doc.name} (${doc.specialty})\n  Local: ${doc.location}\n  Especialização: ${doc.specialization.join(', ')}\n\n`;
      });
    }
  }

  // Buscar medicamentos relevantes
  if (queryLower.includes('medicamento') || queryLower.includes('remédio') || queryLower.includes('tratamento')) {
    const medications = findMedicationsByCondition('Alzheimer');
    if (medications.length > 0) {
      relevantContext += '\nMedicamentos disponíveis:\n';
      medications.forEach(med => {
        relevantContext += `- ${med.name} (${med.category})\n  Uso: ${med.usedFor[0]}\n  Dosagem: ${med.typicalDosage}\n\n`;
      });
    }
  }

  // Incluir exercícios cognitivos se relevante
  if (queryLower.includes('exercício') || queryLower.includes('teste') || queryLower.includes('avaliação') || 
      queryLower.includes('atividade') || queryLower.includes('estimulação')) {
    relevantContext += '\nExercícios Cognitivos Recomendados:\n';
    cognitiveExercises.forEach(ex => {
      relevantContext += `- ${ex.name}\n  ${ex.description}\n  Exemplo: ${ex.instructions[0]}\n\n`;
    });
  }

  return relevantContext;
}

export async function getChatGPTResponse(userInput: string, conversationHistory: Message[] = []): Promise<string> {
  try {
    const medicalInfo = await formatMedicalInfo(userInput);
    
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...conversationHistory.map(msg => ({
        role: msg.isBot ? 'assistant' as const : 'user' as const,
        content: msg.text
      })),
      { role: 'user' as const, content: userInput + (medicalInfo ? `\n\nInformações médicas relevantes:\n${medicalInfo}` : '') }
    ];

    const completion = await openai.chat.completions.create({
      messages,
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 800,
    });

    return completion.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';
  } catch (error) {
    console.error('Erro ao obter resposta:', error);
    return 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.';
  }
}