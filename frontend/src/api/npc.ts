import { api } from "../lib/api";

export interface NPC {
  id?: string;
  name: string;
  behavior?: Record<string, unknown>;
  created_at?: string; updated_at?: string;
}

const base = "/npcs/";

export const listNPCs = () => api.get<NPC[]>(base);
export const getNPC = (id: string) => api.get<NPC>(`${base}${id}/`);
export const createNPC = (payload: Partial<NPC>) => api.post<NPC>(base, payload);
export const updateNPC = (id: string, payload: Partial<NPC>) => api.patch<NPC>(`${base}${id}/`, payload);
export const deleteNPC = (id: string) => api.delete(`${base}${id}/`);
