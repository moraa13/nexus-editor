import { useState, useCallback } from 'react';
import type { Character } from '../types/character';

export interface DialogueState {
  selectedCharacterStat: {
    stat: string;
    description: string;
    history: string;
    skills: string[];
    icon?: string;
    category?: string;
    categoryName?: string;
  } | null;
  activeTab: 'description' | 'history' | 'skills';
  isGenerating: boolean;
}

export interface DialogueActions {
  setSelectedCharacterStat: (stat: DialogueState['selectedCharacterStat']) => void;
  setActiveTab: (tab: DialogueState['activeTab']) => void;
  setIsGenerating: (generating: boolean) => void;
  handleStatSelect: (stat: any) => void;
  handleTabChange: (tab: DialogueState['activeTab']) => void;
  handleGenerateText: (character: Character, currentProject: any) => Promise<void>;
}

export function useDialogueLogic(): DialogueState & DialogueActions {
  const [selectedCharacterStat, setSelectedCharacterStat] = useState<DialogueState['selectedCharacterStat']>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'history' | 'skills'>('description');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStatSelect = useCallback((stat: any) => {
    setSelectedCharacterStat(stat);
  }, []);

  const handleTabChange = useCallback((tab: DialogueState['activeTab']) => {
    setActiveTab(tab);
  }, []);

  const handleGenerateText = useCallback(async (character: Character, currentProject: any) => {
    if (!selectedCharacterStat || !currentProject) {
      throw new Error('Выберите характеристику и откройте проект');
    }

    setIsGenerating(true);
    try {
      // Import AIService dynamically to avoid circular imports
      const { AIService } = await import('../services/aiService');
      
      const response = await AIService.generateStatContent({
        statName: selectedCharacterStat.stat,
        category: selectedCharacterStat.categoryName || 'Unknown',
        tone: currentProject.gameTone,
        existingContent: {
          description: selectedCharacterStat.description,
          history: selectedCharacterStat.history,
          skills: selectedCharacterStat.skills
        }
      });

      // Update the stat content
      setSelectedCharacterStat({
        ...selectedCharacterStat,
        description: response.description,
        history: response.history,
        skills: response.skills
      });

      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [selectedCharacterStat]);

  return {
    // State
    selectedCharacterStat,
    activeTab,
    isGenerating,
    
    // Actions
    setSelectedCharacterStat,
    setActiveTab,
    setIsGenerating,
    handleStatSelect,
    handleTabChange,
    handleGenerateText,
  };
}

