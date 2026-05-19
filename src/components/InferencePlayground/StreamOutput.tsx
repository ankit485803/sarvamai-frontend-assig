

// src/components/InferencePlayground/StreamOutput.tsx

import React, { useRef, useEffect } from 'react';
import { ErrorState } from '../../types';

interface StreamOutputProps {
  output: string;
  isLoading: boolean;
  error: ErrorState | null;
  onClearError: () => void;
}

export const StreamOutput: React.FC<StreamOutputProps> = ({
  output,
  isLoading,
  error,
  onClearError,
}) => {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div 
      className="stream-output"
      style={{
        marginTop: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '1rem',
        background: '#fafafa',
      }}
    >
      <h3>Model Output</h3>
      
      {error?.hasError && (
        <div 
          role="alert"
          aria-live="assertive"
          style={{
            background: '#fee',
            border: '1px solid #fcc',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '4px',
          }}
        >
          <strong>⚠️ Error:</strong> {error.message}
          {error.partialOutput && (
            <div style={{ marginTop: '0.5rem' }}>
              <strong>Partial output preserved:</strong>
              <p style={{ fontFamily: 'monospace' }}>{error.partialOutput}</p>
            </div>
          )}
          <button
            onClick={onClearError}
            style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem' }}
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div
        ref={outputRef}
        style={{
          minHeight: '200px',
          maxHeight: '400px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
        aria-live="polite"
        aria-label="Streaming model output"
      >
        {output || (isLoading ? 'Waiting for response...' : 'No output yet. Submit a prompt above.')}
        {isLoading && !error && output && <span className="cursor">▊</span>}
      </div>
    </div>
  );
};