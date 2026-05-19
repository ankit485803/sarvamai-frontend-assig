import { useState } from 'react'
import './App.css'

import InferencePlayground from './components/InferencePlayground'
import DiffView from './components/DiffView'

type Tab = 'inference' | 'diff'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('inference')

  return (
    <div className="app-container">
      <header className="header">
        <h1>Developer Portal - Model Playground</h1>

        <nav className="nav">
          <button
            onClick={() => setActiveTab('inference')}
            aria-pressed={activeTab === 'inference'}
          >
            Inference Playground
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            aria-pressed={activeTab === 'diff'}
          >
            Model Output Diff
          </button>
        </nav>
      </header>

      <main className="main">
        {activeTab === 'inference' && <InferencePlayground />}
        {activeTab === 'diff' && <DiffView />}
      </main>
    </div>
  )
}

export default App