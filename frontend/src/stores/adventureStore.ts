import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types
export interface Character {
  id: string;
  name: string;
  portrait?: string;
  project?: string;
  intellect: number;
  psyche: number;
  physique: number;
  motorics: number;
  // Skills
  logic: number;
  encyclopedia: number;
  rhetoric: number;
  drama: number;
  conceptualization: number;
  visual_calculus: number;
  volition: number;
  inland_empire: number;
  empathy: number;
  authority: number;
  suggestion: number;
  espirit_de_corps: number;
  endurance: number;
  pain_threshold: number;
  physical_instrument: number;
  electrochemistry: number;
  shivers: number;
  half_light: number;
  hand_eye_coordination: number;
  perception: number;
  reaction_speed: number;
  savoir_faire: number;
  interfacing: number;
  composure: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  gameTone?: {
    mood: string;
    descriptionStyle: string;
  };
}

export interface Scene {
  id: string;
  name: string;
  project: string;
  meta?: Record<string, any>;
}

export interface Dialogue {
  id: string;
  title: string;
  project?: string;
  characters: string[];
}

// Store interface
interface AdventureState {
  // Current state
  currentProject: Project | null;
  characters: Character[];
  currentScene: Scene | null;
  dialogues: Dialogue[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentProject: (project: Project | null) => void;
  setCharacters: (characters: Character[]) => void;
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  removeCharacter: (id: string) => void;
  setCurrentScene: (scene: Scene | null) => void;
  setDialogues: (dialogues: Dialogue[]) => void;
  addDialogue: (dialogue: Dialogue) => void;
  updateDialogue: (id: string, updates: Partial<Dialogue>) => void;
  removeDialogue: (id: string) => void;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

// Initial state
const initialState = {
  currentProject: null,
  characters: [],
  currentScene: null,
  dialogues: [],
  isLoading: false,
  error: null,
};

// Create store
export const useAdventureStore = create<AdventureState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Project actions
      setCurrentProject: (project) => 
        set({ currentProject: project }, false, 'setCurrentProject'),
      
      // Character actions
      setCharacters: (characters) => 
        set({ characters }, false, 'setCharacters'),
      
      addCharacter: (character) => 
        set((state) => ({ 
          characters: [...state.characters, character] 
        }), false, 'addCharacter'),
      
      updateCharacter: (id, updates) => 
        set((state) => ({
          characters: state.characters.map(char => 
            char.id === id ? { ...char, ...updates } : char
          )
        }), false, 'updateCharacter'),
      
      removeCharacter: (id) => 
        set((state) => ({
          characters: state.characters.filter(char => char.id !== id)
        }), false, 'removeCharacter'),
      
      // Scene actions
      setCurrentScene: (scene) => 
        set({ currentScene: scene }, false, 'setCurrentScene'),
      
      // Dialogue actions
      setDialogues: (dialogues) => 
        set({ dialogues }, false, 'setDialogues'),
      
      addDialogue: (dialogue) => 
        set((state) => ({ 
          dialogues: [...state.dialogues, dialogue] 
        }), false, 'addDialogue'),
      
      updateDialogue: (id, updates) => 
        set((state) => ({
          dialogues: state.dialogues.map(dialogue => 
            dialogue.id === id ? { ...dialogue, ...updates } : dialogue
          )
        }), false, 'updateDialogue'),
      
      removeDialogue: (id) => 
        set((state) => ({
          dialogues: state.dialogues.filter(dialogue => dialogue.id !== id)
        }), false, 'removeDialogue'),
      
      // Utility actions
      setLoading: (loading) => 
        set({ isLoading: loading }, false, 'setLoading'),
      
      setError: (error) => 
        set({ error }, false, 'setError'),
      
      clearError: () => 
        set({ error: null }, false, 'clearError'),
      
      reset: () => 
        set(initialState, false, 'reset'),
    }),
    {
      name: 'adventure-store',
    }
  )
);

// Selectors for better performance
export const useCurrentProject = () => useAdventureStore(state => state.currentProject);
export const useCharacters = () => useAdventureStore(state => state.characters);
export const useCurrentScene = () => useAdventureStore(state => state.currentScene);
export const useDialogues = () => useAdventureStore(state => state.dialogues);
export const useIsLoading = () => useAdventureStore(state => state.isLoading);
export const useError = () => useAdventureStore(state => state.error);
