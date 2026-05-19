

// export default function InferencePlayground() {
//   return <div>Inference Playground</div>
// }


// src/components/InferencePlayground/index.tsx

import React, { useState } from 'react';
import { InputMode } from '../../types';
import { useStreamingInference } from './hooks/useStreamingInference';
import { InputPanel } from './InputPanel';
import { MetricsPanel } from './MetricsPanel';
import { StreamOutput } from './StreamOutput';

export const InferencePlayground: React.FC = () => {
  const [mode, setMode] = useState<InputMode>('text');
  const { state, startInference, stopInference, clearError } = useStreamingInference();

  const handleSubmit = (prompt: string, audioBlob?: Blob) => {
    startInference(prompt, mode, audioBlob);
  };

  return (
    <div 
      className="inference-playground"
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}
    >
      <h2>Inference Playground</h2>
      
      <InputPanel
        mode={mode}
        onModeChange={setMode}
        onSubmit={handleSubmit}
        isLoading={state.isLoading}
        onStop={stopInference}
      />
      
      <MetricsPanel
        metrics={state.metrics}
        isLoading={state.isLoading}
      />
      
      <StreamOutput
        output={state.output}
        isLoading={state.isLoading}
        error={state.error}
        onClearError={clearError}
      />
    </div>
  );
};