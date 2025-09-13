import { api } from "../lib/api";
import { Quest, QuestObjective, QuestCharacter, QuestAction, CharacterQuests } from "../types";

// Re-export types for convenience
export type { Quest, QuestObjective, QuestCharacter, QuestAction, CharacterQuests };

const questsBase = "/quests/";
const objectivesBase = "/quest-objectives/";
const questCharactersBase = "/quest-characters/";

// Quest CRUD
export const listQuests = (characterId?: string) => {
  const params = characterId ? `?character_id=${characterId}` : '';
  return api.get<Quest[]>(`${questsBase}${params}`);
};

export const getQuest = (id: string, characterId?: string) => {
  const params = characterId ? `?character_id=${characterId}` : '';
  return api.get<Quest>(`${questsBase}${id}/${params}`);
};

export const createQuest = (payload: Partial<Quest>) => api.post<Quest>(questsBase, payload);
export const updateQuest = (id: string, payload: Partial<Quest>) => api.patch<Quest>(`${questsBase}${id}/`, payload);
export const deleteQuest = (id: string) => api.delete(`${questsBase}${id}/`);

// Quest management
export const startQuest = (questId: string, characterId: string) =>
  api.post<{ quest: Quest; message: string }>("/quests/start/", {
    quest_id: questId,
    character_id: characterId,
  });

export const completeQuest = (questId: string) =>
  api.post<{ quest: Quest; message: string }>("/quests/complete/", {
    quest_id: questId,
  });

export const failQuest = (questId: string) =>
  api.post<{ quest: Quest; message: string }>("/quests/fail/", {
    quest_id: questId,
  });

export const updateQuestProgress = (questId: string, progressAmount: number = 1) =>
  api.post<{ quest: Quest; message: string }>("/quests/progress/", {
    quest_id: questId,
    progress_amount: progressAmount,
  });

export const getCharacterQuests = (characterId: string) =>
  api.get<CharacterQuests>(`/characters/${characterId}/quests/`);

// Quest Objectives CRUD
export const listQuestObjectives = () => api.get<QuestObjective[]>(objectivesBase);
export const getQuestObjective = (id: string) => api.get<QuestObjective>(`${objectivesBase}${id}/`);
export const createQuestObjective = (payload: Partial<QuestObjective>) => api.post<QuestObjective>(objectivesBase, payload);
export const updateQuestObjective = (id: string, payload: Partial<QuestObjective>) => 
  api.patch<QuestObjective>(`${objectivesBase}${id}/`, payload);
export const deleteQuestObjective = (id: string) => api.delete(`${objectivesBase}${id}/`);

// Quest Characters CRUD
export const listQuestCharacters = () => api.get<QuestCharacter[]>(questCharactersBase);
export const getQuestCharacter = (id: string) => api.get<QuestCharacter>(`${questCharactersBase}${id}/`);
export const createQuestCharacter = (payload: Partial<QuestCharacter>) => api.post<QuestCharacter>(questCharactersBase, payload);
export const updateQuestCharacter = (id: string, payload: Partial<QuestCharacter>) => 
  api.patch<QuestCharacter>(`${questCharactersBase}${id}/`, payload);
export const deleteQuestCharacter = (id: string) => api.delete(`${questCharactersBase}${id}/`);

// Quest utility functions
export const getQuestStatusColor = (status: Quest['status']): string => {
  switch (status) {
    case 'available': return '#10B981'; // green
    case 'active': return '#3B82F6'; // blue
    case 'completed': return '#8B5CF6'; // purple
    case 'failed': return '#EF4444'; // red
    case 'locked': return '#6B7280'; // gray
    case 'paused': return '#F59E0B'; // yellow
    default: return '#6B7280';
  }
};

export const getQuestTypeIcon = (type: Quest['quest_type']): string => {
  switch (type) {
    case 'dialogue': return '💬';
    case 'combat': return '⚔️';
    case 'skill_check': return '🎲';
    case 'exploration': return '🗺️';
    case 'puzzle': return '🧩';
    case 'social': return '👥';
    case 'fetch': return '📦';
    case 'elimination': return '🎯';
    case 'escort': return '🛡️';
    case 'investigation': return '🔍';
    default: return '📋';
  }
};

export const getObjectiveTypeIcon = (type: QuestObjective['objective_type']): string => {
  switch (type) {
    case 'dialogue': return '💬';
    case 'kill': return '⚔️';
    case 'collect': return '📦';
    case 'deliver': return '🚚';
    case 'reach': return '📍';
    case 'interact': return '👆';
    case 'skill_check': return '🎲';
    case 'time_limit': return '⏰';
    default: return '📋';
  }
};

export const getPriorityColor = (priority: Quest['priority']): string => {
  switch (priority) {
    case 'low': return '#10B981'; // green
    case 'normal': return '#3B82F6'; // blue
    case 'high': return '#F59E0B'; // yellow
    case 'critical': return '#EF4444'; // red
    default: return '#6B7280';
  }
};