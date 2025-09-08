import { api } from "../lib/api";

// Export types explicitly
export type SkillCheck = {
  id?: string;
  dialogue: string;
  skill: string;
  difficulty: string;
  dc_value: number;
  description?: string;
  success_text?: string;
  failure_text?: string;
  critical_success_text?: string;
  critical_failure_text?: string;
  created_at?: string;
  updated_at?: string;
}

export type DialogueOption = {
  id?: string;
  dialogue: string;
  text: string;
  skill_check?: string;
  order: number;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export type RollResult = {
  id?: string;
  skill_check: string;
  character: string;
  dice_roll: number;
  skill_value: number;
  total: number;
  is_success: boolean;
  is_critical_success: boolean;
  is_critical_failure: boolean;
  result_text?: string;
  created_at?: string;
  updated_at?: string;
}

export type RollRequest = {
  character_id: string;
  skill_check_id: string;
}

export type RollResponse = {
  roll_result_id: string;
  character_name: string;
  skill: string;
  dice_roll: number;
  skill_value: number;
  total: number;
  dc_value: number;
  is_success: boolean;
  is_critical_success: boolean;
  is_critical_failure: boolean;
  result_text: string;
}

export type CharacterSkills = {
  character_name: string;
  skills: Record<string, number>;
}

const skillChecksBase = "/skill-checks/";
const dialogueOptionsBase = "/dialogue-options/";
const rollResultsBase = "/roll-results/";

// SkillCheck CRUD
export const listSkillChecks = () => api.get<SkillCheck[]>(skillChecksBase);
export const getSkillCheck = (id: string) => api.get<SkillCheck>(`${skillChecksBase}${id}/`);
export const createSkillCheck = (payload: Partial<SkillCheck>) => api.post<SkillCheck>(skillChecksBase, payload);
export const updateSkillCheck = (id: string, payload: Partial<SkillCheck>) => api.patch<SkillCheck>(`${skillChecksBase}${id}/`, payload);
export const deleteSkillCheck = (id: string) => api.delete(`${skillChecksBase}${id}/`);

// DialogueOption CRUD
export const listDialogueOptions = () => api.get<DialogueOption[]>(dialogueOptionsBase);
export const getDialogueOption = (id: string) => api.get<DialogueOption>(`${dialogueOptionsBase}${id}/`);
export const createDialogueOption = (payload: Partial<DialogueOption>) => api.post<DialogueOption>(dialogueOptionsBase, payload);
export const updateDialogueOption = (id: string, payload: Partial<DialogueOption>) => api.patch<DialogueOption>(`${dialogueOptionsBase}${id}/`, payload);
export const deleteDialogueOption = (id: string) => api.delete(`${dialogueOptionsBase}${id}/`);

// RollResult CRUD
export const listRollResults = () => api.get<RollResult[]>(rollResultsBase);
export const getRollResult = (id: string) => api.get<RollResult>(`${rollResultsBase}${id}/`);

// Special endpoints
export const rollSkillCheck = (payload: RollRequest) => api.post<RollResponse>("/roll_skill_check/", payload);
export const getCharacterSkills = (characterId: string) => api.get<CharacterSkills>(`/characters/${characterId}/skills/`);

// Skill choices for UI
export const SKILL_CHOICES = [
  { value: 'logic', label: 'Logic' },
  { value: 'encyclopedia', label: 'Encyclopedia' },
  { value: 'rhetoric', label: 'Rhetoric' },
  { value: 'drama', label: 'Drama' },
  { value: 'conceptualization', label: 'Conceptualization' },
  { value: 'visual_calculus', label: 'Visual Calculus' },
  { value: 'volition', label: 'Volition' },
  { value: 'inland_empire', label: 'Inland Empire' },
  { value: 'empathy', label: 'Empathy' },
  { value: 'authority', label: 'Authority' },
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'espirit_de_corps', label: 'Espirit de Corps' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'pain_threshold', label: 'Pain Threshold' },
  { value: 'physical_instrument', label: 'Physical Instrument' },
  { value: 'electrochemistry', label: 'Electrochemistry' },
  { value: 'shivers', label: 'Shivers' },
  { value: 'half_light', label: 'Half Light' },
  { value: 'hand_eye_coordination', label: 'Hand/Eye Coordination' },
  { value: 'perception', label: 'Perception' },
  { value: 'reaction_speed', label: 'Reaction Speed' },
  { value: 'savoir_faire', label: 'Savoir Faire' },
  { value: 'interfacing', label: 'Interfacing' },
  { value: 'composure', label: 'Composure' },
];

export const DIFFICULTY_CHOICES = [
  { value: 'trivial', label: 'Trivial (DC 5)' },
  { value: 'easy', label: 'Easy (DC 10)' },
  { value: 'medium', label: 'Medium (DC 15)' },
  { value: 'hard', label: 'Hard (DC 20)' },
  { value: 'extreme', label: 'Extreme (DC 25)' },
  { value: 'impossible', label: 'Impossible (DC 30)' },
];
