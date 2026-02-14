import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, X, Loader2, Download, RefreshCw, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { GenerationMode } from '../types';
import { MAX_IMAGES_MULTI, MAX_IMAGES_SINGLE } from '../constants';
import { validateFileSelection } from '../utils/imageUtils';
import { generateImageFromReferences } from '../services/geminiService';

interface GeneratorProps {
  mode: GenerationMode;
  onBack: () => void;
  onResetKey: () => void;
}

const Generator: React.FC<GeneratorProps> = ({ mode, onBack, onResetKey }) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxLimit = mode === 'single' ? MAX_IMAGES_SINGLE : MAX_IMAGES_MULTI;
  const isSingleMode = mode === 'single';

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const combinedFiles = isSingleMode ? newFiles : [...selectedImages, ...newFiles];
      
      const validatedFiles = validateFileSelection(combinedFiles, maxLimit);
      
      if (combinedFiles.length > maxLimit) {
        // Optional: Notify user about truncation
      }
      
      setSelectedImages(validatedFiles);
      setError(null);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (selectedImages.length === 0) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Pass the selected images AND the current mode to the service
      const imageUrl = await generateImageFromReferences(selectedImages, mode);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to generate image. Please try again.";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Check if the error is related to API Key authentication
  const isAuthError = error && (
    error.includes('Requested entity was not found') || 
    error.includes('API Key') ||
    error.includes('403') ||
    error.includes('401')
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center mb-8 pt-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
            <h2 className="text-xl font-semibold text-white">
                {isSingleMode ? 'Single Variant Generator' : 'Multi-Reference Mix'}
            </h2>
            <p className="text-zinc-500 text-sm">
                {isSingleMode 
                    ? `Upload 1 reference image.` 
                    : `Upload up to ${MAX_IMAGES_MULTI} reference images.`}
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left Column: Inputs */}
        <div className="flex flex-col gap-6">
            
            {/* Upload Area */}
            <div 
                className={`
                    relative border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center p-8
                    ${selectedImages.length >= maxLimit ? 'border-zinc-800 bg-zinc-900/50 opacity-80 cursor-not-allowed' : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 cursor-pointer'}
                `}
                onClick={() => {
                    if (selectedImages.length < maxLimit) {
                        fileInputRef.current?.click();
                    }
                }}
            >
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple={!isSingleMode}
                    onChange={handleFileChange}
                    disabled={selectedImages.length >= maxLimit}
                />
                <div className="bg-zinc-800 p-4 rounded-full mb-4">
                    <Upload size={24} className="text-zinc-400" />
                </div>
                <p className="text-zinc-300 font-medium mb-1">
                    {selectedImages.length >= maxLimit ? 'Limit Reached' : 'Click to Upload'}
                </p>
                <p className="text-zinc-500 text-sm">
                    {selectedImages.length} / {maxLimit} selected
                </p>
            </div>

            {/* Selected Images List */}
            {selectedImages.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                    {selectedImages.map((file, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800">
                            <img 
                                src={URL.createObjectURL(file)} 
                                alt={`Reference ${idx}`} 
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(idx);
                                }}
                                className="absolute top-1 right-1 bg-black/60 hover:bg-red-500/80 p-1 rounded-full text-white backdrop-blur-sm transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={selectedImages.length === 0 || isGenerating}
                className={`
                    w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all
                    ${selectedImages.length === 0 
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                        : isGenerating 
                            ? 'bg-indigo-600/50 text-indigo-200 cursor-wait' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'}
                `}
            >
                {isGenerating ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <RefreshCw size={20} />
                        Generate Image
                    </>
                )}
            </button>
            
            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-xl flex flex-col gap-2 text-red-300 text-sm animate-fade-in">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                    {isAuthError && (
                        <button 
                            onClick={onResetKey}
                            className="self-end text-xs bg-red-800/50 hover:bg-red-800 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors border border-red-700"
                        >
                            <KeyRound size={12} /> Reconnect API Key
                        </button>
                    )}
                </div>
            )}
        </div>

        {/* Right Column: Output */}
        <div className="flex flex-col h-full min-h-[400px] lg:min-h-0">
            <div className={`
                flex-1 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 relative flex items-center justify-center
                ${generatedImage ? 'shadow-2xl shadow-indigo-900/20' : ''}
            `}>
                {generatedImage ? (
                    <img 
                        src={generatedImage} 
                        alt="AI Generated" 
                        className="w-full h-full object-contain animate-fade-in"
                    />
                ) : isGenerating ? (
                    <div className="flex flex-col items-center gap-4 text-zinc-500">
                         <div className="relative">
                            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                         </div>
                         <p className="animate-pulse">Thinking & Rendering...</p>
                    </div>
                ) : (
                    <div className="text-zinc-700 flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center">
                            <Sparkles size={32} className="text-zinc-800" />
                        </div>
                        <p>Output will appear here</p>
                    </div>
                )}

                {/* Download Action */}
                {generatedImage && (
                    <div className="absolute bottom-6 right-6 flex gap-4">
                        <a 
                            href={generatedImage} 
                            download={`nanogen-${Date.now()}.png`}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all"
                        >
                            <Download size={18} />
                            Save
                        </a>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;