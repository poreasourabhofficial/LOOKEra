import React from 'react';
import { Layers, Image as ImageIcon, Sparkles, Zap } from 'lucide-react';
import { GenerationMode } from '../types';

interface DashboardProps {
  onSelectMode: (mode: GenerationMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-4xl mx-auto px-6 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
          LOOKEra Studio
        </h1>
        <p className="text-zinc-400 text-lg max-w-md mx-auto">
          Create stunning studio renders from your reference images.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Option A: Multi-Reference Mix */}
        <button
          onClick={() => onSelectMode('mix')}
          className="group relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 text-left transition-all duration-300 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Layers size={120} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="bg-indigo-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <Layers size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Full Outfit Image Generate</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Combine up to 10 products image to create a unique Outfit Image. Perfect for style transfer and complex compositions.
              </p>
            </div>
            <div className="mt-8 flex items-center text-indigo-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Generate Outfit <Sparkles size={16} className="ml-2" />
            </div>
          </div>
        </button>

        {/* Option B: Single Variant */}
        <button
          onClick={() => onSelectMode('single')}
          className="group relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 text-left transition-all duration-300 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ImageIcon size={120} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Zap size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Product Image Generate</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Reimagine a single image with our high-fidelity renderer. Ideal for quick enhancements.
              </p>
            </div>
            <div className="mt-8 flex items-center text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Generate Variant <Sparkles size={16} className="ml-2" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
