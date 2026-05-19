

// src/mocks/streamingApi.ts

// Mock token-by-token response for development
export async function* mockStreamingResponse(prompt: string) {
  const words = prompt.split(' ');
  const mockTokens = [
    ...words,
    ' This', ' is', ' a', ' streaming', ' response.',
    ' It', ' shows', ' token', ' by', ' token', ' output.',
  ];
  
  for (const token of mockTokens) {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
    yield token;
  }
}

// Simulated API call that returns ReadableStream
export async function callMockInferenceAPI(prompt: string, mode: 'text' | 'audio') {
  // Create a custom ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      const generator = mockStreamingResponse(prompt);
      for await (const token of generator) {
        controller.enqueue(new TextEncoder().encode(JSON.stringify({ token }) + '\n'));
      }
      controller.close();
    },
  });
  
  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  });
}