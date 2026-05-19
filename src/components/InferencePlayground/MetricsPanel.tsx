

// src/components/InferencePlayground/MetricsPanel.tsx

import React from 'react';
import { Metrics } from '../../types';

interface MetricsPanelProps {
  metrics: Metrics | null;
  isLoading: boolean;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics, isLoading }) => {
  if (!isLoading && !metrics) return null;

  return (
    <div 
      className="metrics-panel"
      role="complementary"
      aria-label="Live performance metrics"
      style={{
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '4px',
        marginTop: '1rem',
      }}
    >
      <h3>Live Metrics</h3>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div>
          <strong>Tokens Generated:</strong>{' '}
          <span aria-live="polite">{metrics?.tokenCount || 0}</span>
        </div>
        <div>
          <strong>Tokens/Second:</strong>{' '}
          <span aria-live="polite">{metrics?.tokensPerSecond || 0}</span>
        </div>
        {isLoading && <div>🔄 Streaming in progress...</div>}
      </div>
    </div>
  );
};