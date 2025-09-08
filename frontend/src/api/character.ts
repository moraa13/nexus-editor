import { api } from "../lib/api";

export interface Character {
  id?: string;
  name: string;
  portrait?: string;
  logic?: number; encyclopedia?: number; rhetoric?: number; drama?: number; conceptualization?: number; visual_calculus?: number;
  volition?: number; inland_empire?: number; empathy?: number; authority?: number; suggestion?: number; espirit_de_corps?: number;
  endurance?: number; pain_threshold?: number; physical_instrument?: number; electrochemistry?: number; shivers?: number; half_light?: number;
  hand_eye_coordination?: number; perception?: number; reaction_speed?: number; savoir_faire?: number; interfacing?: number; composure?: number;
  created_at?: string; updated_at?: string;
}

const base = "/characters/";

export const listCharacters = () => api.get<Character[]>(base);
export const getCharacter = (id: string) => api.get<Character>(`${base}${id}/`);
export const createCharacter = (payload: Partial<Character>) => api.post<Character>(base, payload);
export const updateCharacter = (id: string, payload: Partial<Character>) => api.patch<Character>(`${base}${id}/`, payload);
export const deleteCharacter = (id: string) => api.delete(`${base}${id}/`);
