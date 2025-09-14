import { useState, useCallback } from 'react';
import type { Character } from '../types/character';

export interface AdventureState {
  activeSection: 'characters' | 'events' | 'branches' | 'projects';
  selectedAction: 'create-character' | 'create-event' | 'event-branch' | 'open-project' | 'game-setting' | 'game-tone' | 'manage-projects' | null;
  characters: Character[];
  currentProject: any | null;
  showDemoQuest: boolean;
}

export interface AdventureActions {
  setActiveSection: (section: AdventureState['activeSection']) => void;
  setSelectedAction: (action: AdventureState['selectedAction']) => void;
  setCharacters: (characters: Character[]) => void;
  setCurrentProject: (project: any | null) => void;
  setShowDemoQuest: (show: boolean) => void;
  handleActionClick: (action: NonNullable<AdventureState['selectedAction']>) => void;
  handleClosePanel: () => void;
}

export function useAdventureState(): AdventureState & AdventureActions {
  const [activeSection, setActiveSection] = useState<'characters' | 'events' | 'branches' | 'projects'>('characters');
  const [selectedAction, setSelectedAction] = useState<'create-character' | 'create-event' | 'event-branch' | 'open-project' | 'game-setting' | 'game-tone' | 'manage-projects' | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentProject, setCurrentProject] = useState<any | null>(null);
  const [showDemoQuest, setShowDemoQuest] = useState(false);

  const handleActionClick = useCallback((action: NonNullable<AdventureState['selectedAction']>) => {
    setSelectedAction(action);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedAction(null);
  }, []);

  return {
    // State
    activeSection,
    selectedAction,
    characters,
    currentProject,
    showDemoQuest,
    
    // Actions
    setActiveSection,
    setSelectedAction,
    setCharacters,
    setCurrentProject,
    setShowDemoQuest,
    handleActionClick,
    handleClosePanel,
  };
}

