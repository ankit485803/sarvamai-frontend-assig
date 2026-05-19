

// src/components/InferencePlayground/hooks/useStreamingInference.ts

import { useState, useCallback, useRef } from 'react';
import { InferenceState, InputMode, Metrics, ErrorState } from '@/types';

// Mock streaming API - replace with real endpoint later
const mockStreamingFetch = async (prompt: string, mode: InputMode) => {
  const words = prompt.split(' ');
  const mockTokens = [...words, ' This', ' is', ' an', ' AI', ' response.', ' It', ' streams', ' token', ' by', ' token.'];

  const stream = new ReadableStream({
    async start(controller) {
      for (const token of mockTokens) {
        await new Promise(resolve => setTimeout(resolve, 80)); // Simulate network
        controller.enqueue(new TextEncoder().encode(JSON.stringify({ token }) + '\n'));
      }
      controller.enqueue(new TextEncoder().encode(JSON.stringify({ done: true }) + '\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  });
};

export const useStreamingInference = () => {
  const [state, setState] = useState<InferenceState>({
    isLoading: false,
    output: '',
    metrics: null,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const startInference = useCallback(async (prompt: string, mode: InputMode, audioBlob?: Blob) => {
    // Reset state
    setState({
      isLoading: true,
      output: '',
      metrics: {
        tokenCount: 0,
        tokensPerSecond: 0,
        startTime: Date.now(),
        lastTokenTime: Date.now(),
      },
      error: null,
    });

    abortControllerRef.current = new AbortController();

    try {
      const response = await mockStreamingFetch(prompt, mode);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let fullOutput = '';
      let tokenCount = 0;
      const startTime = Date.now();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.done) break;
            
            if (data.token) {
              fullOutput += data.token;
              tokenCount++;
              
              const elapsedSeconds = (Date.now() - startTime) / 1000;
              const tps = tokenCount / elapsedSeconds;
              
              setState(prev => ({
                ...prev,
                output: fullOutput,
                metrics: {
                  tokenCount,
                  tokensPerSecond: Math.round(tps * 10) / 10,
                  startTime,
                  lastTokenTime: Date.now(),
                },
              }));
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }

      setState(prev => ({ ...prev, isLoading: false }));
      
    } catch (error: any) {
      // Error handling - preserve partial output
      let errorType: ErrorState['errorType'] = 'unknown';
      let message = error.message || 'An error occurred';
      
      if (error.name === 'AbortError') {
        errorType = 'network';
        message = 'Network request was interrupted';
      } else if (error.message?.includes('timeout')) {
        errorType = 'timeout';
        message = 'Request timed out';
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          hasError: true,
          message,
          partialOutput: prev.output, // Preserve what we got
          errorType,
        },
      }));
    }
  }, []);

  const stopInference = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return { state, startInference, stopInference, clearError };
};