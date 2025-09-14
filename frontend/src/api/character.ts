import { api } from "../lib/api";
import type { Character } from "../types/character";

const base = "/characters/";

export const listCharacters = () => api.get<Character[]>(base);
export const getCharacter = (id: string) => api.get<Character>(`${base}${id}/`);
export const createCharacter = (payload: Partial<Character>) => api.post<Character>(base, payload);
export const updateCharacter = (id: string, payload: Partial<Character>) => api.patch<Character>(`${base}${id}/`, payload);
export const deleteCharacter = (id: string) => api.delete(`${base}${id}/`);
