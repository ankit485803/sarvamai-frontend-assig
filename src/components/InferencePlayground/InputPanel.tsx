

// src/components/InferencePlayground/InputPanel.tsx

import React, { useState, useRef } from 'react';
import { InputMode } from '../../types';

interface InputPanelProps {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  onSubmit: (prompt: string, audioBlob?: Blob) => void;
  isLoading: boolean;
  onStop: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  mode,
  onModeChange,
  onSubmit,
  isLoading,
  onStop,
}) => {
  const [textPrompt, setTextPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      onSubmit('Audio input recorded', audioBlob);
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSubmit = () => {
    if (mode === 'text' && textPrompt.trim()) {
      onSubmit(textPrompt);
      setTextPrompt('');
    } else if (mode === 'audio' && !isRecording) {
      startRecording();
    }
  };

  return (
    <div 
      className="input-panel"
      role="region"
      aria-label="Input controls"
    >
      <div 
        className="mode-toggle"
        role="tablist"
        aria-label="Input mode selector"
      >
        <button
          role="tab"
          aria-selected={mode === 'text'}
          onClick={() => onModeChange('text')}
          disabled={isLoading}
          style={{
            background: mode === 'text' ? '#007bff' : '#ccc',
            color: mode === 'text' ? 'white' : 'black',
          }}
        >
          Text Input
        </button>
        <button
          role="tab"
          aria-selected={mode === 'audio'}
          onClick={() => onModeChange('audio')}
          disabled={isLoading}
          style={{
            background: mode === 'audio' ? '#007bff' : '#ccc',
            color: mode === 'audio' ? 'white' : 'black',
          }}
        >
          Audio Input
        </button>
      </div>

      {mode === 'text' ? (
        <textarea
          value={textPrompt}
          onChange={(e) => setTextPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          disabled={isLoading}
          rows={4}
          aria-label="Text prompt input"
          style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}
        />
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            style={{
              background: isRecording ? 'red' : '#28a745',
              color: 'white',
              padding: '0.5rem 1rem',
            }}
          >
            {isRecording ? '🔴 Stop Recording' : '🎤 Start Recording'}
          </button>
          {isRecording && <p>Recording... Click stop when done</p>}
        </div>
      )}

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={handleSubmit}
          disabled={isLoading || (mode === 'text' && !textPrompt.trim())}
          aria-label={isLoading ? 'Processing' : 'Submit input'}
          style={{
            background: '#007bff',
            color: 'white',
            padding: '0.5rem 1rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Streaming...' : mode === 'audio' ? 'Start Recording' : 'Submit'}
        </button>
        
        {isLoading && (
          <button
            onClick={onStop}
            aria-label="Stop streaming"
            style={{
              background: '#dc3545',
              color: 'white',
              padding: '0.5rem 1rem',
            }}
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
};