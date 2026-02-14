export type GenerationMode = 'single' | 'mix';

export interface GeneratedImageResult {
  imageUrl: string;
  timestamp: number;
}

export interface AppState {
  view: 'dashboard' | 'generator';
  mode: GenerationMode | null;
}

export interface AIStudioClient {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio?: AIStudioClient;
  }
}
