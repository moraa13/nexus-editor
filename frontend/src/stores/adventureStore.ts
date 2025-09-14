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

export interface Event {
  id: string;
  name: string;
  type: 'dialogue' | 'skill_check' | 'combat' | 'transition' | 'script';
  description: string;
  triggerConditions: string[];
  consequences: string[];
  relatedNPCs: string[];
  script?: string;
  scenePreview?: string;
  scene: string;
  project: string;
  order: number;
}

export interface QuestStep {
  id: string;
  eventId: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  steps: QuestStep[];
  startConditions: string[];
  initiatorNPC: string;
  rewards: string[];
  status: 'not_started' | 'in_progress' | 'completed';
  project: string;
}

// Store interface
interface AdventureState {
  // Current state
  currentProject: Project | null;
  characters: Character[];
  currentScene: Scene | null;
  dialogues: Dialogue[];
  events: Event[];
  quests: Quest[];
  
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
  
  // Event actions
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  removeEvent: (id: string) => void;
  getEventsByScene: (sceneId: string) => Event[];
  
  // Quest actions
  setQuests: (quests: Quest[]) => void;
  addQuest: (quest: Quest) => void;
  updateQuest: (id: string, updates: Partial<Quest>) => void;
  removeQuest: (id: string) => void;
  addQuestStep: (questId: string, step: QuestStep) => void;
  updateQuestStep: (questId: string, stepId: string, updates: Partial<QuestStep>) => void;
  removeQuestStep: (questId: string, stepId: string) => void;
  
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
  events: [],
  quests: [],
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
      
      // Event actions
      setEvents: (events) => 
        set({ events }, false, 'setEvents'),
      
      addEvent: (event) => 
        set((state) => ({ 
          events: [...state.events, event] 
        }), false, 'addEvent'),
      
      updateEvent: (id, updates) => 
        set((state) => ({
          events: state.events.map(event => 
            event.id === id ? { ...event, ...updates } : event
          )
        }), false, 'updateEvent'),
      
      removeEvent: (id) => 
        set((state) => ({
          events: state.events.filter(event => event.id !== id)
        }), false, 'removeEvent'),
      
      getEventsByScene: (sceneId) => 
        get().events.filter(event => event.scene === sceneId),
      
      // Quest actions
      setQuests: (quests) => 
        set({ quests }, false, 'setQuests'),
      
      addQuest: (quest) => 
        set((state) => ({ 
          quests: [...state.quests, quest] 
        }), false, 'addQuest'),
      
      updateQuest: (id, updates) => 
        set((state) => ({
          quests: state.quests.map(quest => 
            quest.id === id ? { ...quest, ...updates } : quest
          )
        }), false, 'updateQuest'),
      
      removeQuest: (id) => 
        set((state) => ({
          quests: state.quests.filter(quest => quest.id !== id)
        }), false, 'removeQuest'),
      
      addQuestStep: (questId, step) => 
        set((state) => ({
          quests: state.quests.map(quest => 
            quest.id === questId 
              ? { ...quest, steps: [...quest.steps, step] }
              : quest
          )
        }), false, 'addQuestStep'),
      
      updateQuestStep: (questId, stepId, updates) => 
        set((state) => ({
          quests: state.quests.map(quest => 
            quest.id === questId 
              ? { 
                  ...quest, 
                  steps: quest.steps.map(step => 
                    step.id === stepId ? { ...step, ...updates } : step
                  )
                }
              : quest
          )
        }), false, 'updateQuestStep'),
      
      removeQuestStep: (questId, stepId) => 
        set((state) => ({
          quests: state.quests.map(quest => 
            quest.id === questId 
              ? { ...quest, steps: quest.steps.filter(step => step.id !== stepId) }
              : quest
          )
        }), false, 'removeQuestStep'),
      
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
export const useEvents = () => useAdventureStore(state => state.events);
export const useQuests = () => useAdventureStore(state => state.quests);
export const useIsLoading = () => useAdventureStore(state => state.isLoading);
export const useError = () => useAdventureStore(state => state.error);
