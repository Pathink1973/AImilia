export class OpenAIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'OpenAIError';
  }
}

export function handleOpenAIError(error: any): string {
  console.error('OpenAI API Error:', error);

  if (error.response?.status === 401) {
    return "Por favor, configure uma chave API OpenAI válida no arquivo .env";
  }

  if (error.response?.status === 429) {
    return "Limite de requisições atingido. Por favor, aguarde alguns momentos e tente novamente.";
  }

  if (error.code === 'ECONNABORTED') {
    return "A conexão expirou. Por favor, verifique sua conexão com a internet e tente novamente.";
  }

  return "Desculpe, estou tendo dificuldades técnicas. Por favor, tente novamente em alguns momentos.";
}