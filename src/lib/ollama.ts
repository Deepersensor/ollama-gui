const OLLAMA_BASE_URL = 'http://localhost:11434/api';

export async function generateResponse(model: string, prompt: string) {
  const response = await fetch(`${OLLAMA_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response;
}

export async function listModels() {
  const response = await fetch(`${OLLAMA_BASE_URL}/tags`);
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`);
  }
  const data = await response.json();
  return data.models.map((model: any) => model.name);
}
