import { openai } from './config';
import { handleOpenAIError } from './errors';
import type { Message } from '../../types/conversation';

const SYSTEM_PROMPT = `Você é uma tutora virtual especializada em ajudar pessoas com Alzheimer, usando português de Portugal.

DIRETRIZES CRÍTICAS:
1. Use sempre português de Portugal (não brasileiro)
2. Mantenha respostas ÚNICAS e DIRETAS - nunca repita a pergunta
3. Limite respostas a 1-2 frases curtas
4. Use tom calmo e reconfortante
5. Use vocabulário simples e familiar
6. Evite corrigir o paciente diretamente
7. Mantenha consistência no tom de voz
8. Foque em orientação temporal e espacial
9. Priorize segurança e bem-estar
10. NUNCA repita informações ou faça perguntas redundantes`;

export async function getChatGPTResponse(userMessage: string, messageHistory: Message[]) {
  try {
    const recentMessages = messageHistory.slice(-2);
    
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...recentMessages.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 150,
      presence_penalty: 1.0,
      frequency_penalty: 1.0,
      top_p: 0.9
    });

    const responseText = response.choices[0]?.message?.content?.trim();
    
    if (!responseText) {
      throw new Error('Não recebi uma resposta válida. Por favor, tente novamente.');
    }

    return responseText;
  } catch (error) {
    return handleOpenAIError(error);
  }
}