import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Generator from './components/Generator';
import { AppState, GenerationMode } from './types';
import { KeyRound, Loader2, ExternalLink, Info } from 'lucide-react';

const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isCheckingKey, setIsCheckingKey] = useState<boolean>(true);

  const [appState, setAppState] = useState<AppState>({
    view: 'dashboard',
    mode: null,
  });

  // Check for existing API Key selection on mount
  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } else {
           // Fallback for local dev environments where window.aistudio might not exist
           // We assume if they are running locally, they might have set process.env.API_KEY
           // If not, the API call will fail later, which is handled in Generator.tsx.
           if (process.env.API_KEY) {
               setHasApiKey(true);
           }
        }
      } catch (e) {
        console.error("Failed to check API key status", e);
      } finally {
        setIsCheckingKey(false);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    try {
      if (window.aistudio) {
        await window.aistudio.openSelectKey();
        // Assume success to mitigate race condition
        setHasApiKey(true);
      } else {
        alert("API Key selection dialog is only available in the Project IDX / AI Studio environment. For local development, please set 'process.env.API_KEY' in your environment variables.");
      }
    } catch (e) {
      console.error("Failed to select API key", e);
    }
  };

  const handleResetKey = () => {
    setHasApiKey(false);
  };

  const handleSelectMode = (mode: GenerationMode) => {
    setAppState({
      view: 'generator',
      mode,
    });
  };

  const handleBack = () => {
    setAppState({
      view: 'dashboard',
      mode: null,
    });
  };

  // Loading Screen
  if (isCheckingKey) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">
        <Loader2 className="animate-spin mr-2" /> Initializing...
      </div>
    );
  }

  // API Key Selection Screen (Mandatory for Pro Model)
  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <KeyRound size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">NanoGen Studio</h1>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            To use the high-fidelity <strong>Nano Banana Pro</strong> model, you need to connect a paid API key from Google AI Studio.
          </p>
          
          <button
            onClick={handleSelectKey}
            className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 mb-6"
          >
            <KeyRound size={18} />
            Connect API Key
          </button>

          <div className="flex flex-col gap-3 text-sm text-zinc-600">
             <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-zinc-400 flex items-center justify-center gap-1 transition-colors"
            >
                About Gemini API Billing <ExternalLink size={10} />
            </a>
            <div className="flex items-center justify-center gap-1.5 opacity-60">
                <Info size={12} />
                <span>The key is securely injected by the environment.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
        {/* Navigation / Header */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/50 backdrop-blur-sm border-b border-white/5">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={handleBack}>
                    <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
                    <span className="font-bold text-lg tracking-tight text-white">NanoGen</span>
                </div>
                {/* Status Indicator */}
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Nano Banana Pro
                </div>
            </div>
        </nav>

        {/* Main Content Area */}
        <main className="pt-24 pb-8 min-h-screen flex items-center justify-center">
            {appState.view === 'dashboard' ? (
                <Dashboard onSelectMode={handleSelectMode} />
            ) : appState.mode ? (
                <Generator 
                    mode={appState.mode} 
                    onBack={handleBack} 
                    onResetKey={handleResetKey}
                />
            ) : (
                <Dashboard onSelectMode={handleSelectMode} />
            )}
        </main>
    </div>
  );
};

export default App;
