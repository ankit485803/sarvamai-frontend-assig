
// src/types/index.ts

export type InputMode = 'text' | 'audio';

export interface Metrics {
  tokenCount: number;
  tokensPerSecond: number;
  startTime: number;
  lastTokenTime: number;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
  partialOutput: string;
  errorType: 'network' | 'timeout' | 'interrupted' | 'unknown';
}

export interface InferenceState {
  isLoading: boolean;
  output: string;
  metrics: Metrics | null;
  error: ErrorState | null;
}