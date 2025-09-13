import { api } from "../lib/api";
import { Dialogue, Post, DialogueOption, DialogueTreeResponse } from "../types";

// Re-export types for convenience
export type { Dialogue, Post, DialogueOption, DialogueTreeResponse };

const dialoguesBase = "/dialogues/";
const postsBase = "/posts/";
const optionsBase = "/dialogue-options/";

// Dialogue CRUD
export const listDialogues = () => api.get<Dialogue[]>(dialoguesBase);
export const getDialogue = (id: string) => api.get<Dialogue>(`${dialoguesBase}${id}/`);
export const createDialogue = (payload: Partial<Dialogue>) => api.post<Dialogue>(dialoguesBase, payload);
export const updateDialogue = (id: string, payload: Partial<Dialogue>) => api.patch<Dialogue>(`${dialoguesBase}${id}/`, payload);
export const deleteDialogue = (id: string) => api.delete(`${dialoguesBase}${id}/`);

// Dialogue Tree and Branching
export const getDialogueTree = (dialogueId: string, characterId?: string) => {
  const params = characterId ? `?character_id=${characterId}` : '';
  return api.get<DialogueTreeResponse>(`${dialoguesBase}${dialogueId}/tree/${params}`);
};

export const createDialogueBranch = (payload: {
  parent_dialogue_id: string;
  option_id: string;
  title: string;
}) => api.post<{ new_dialogue_id: string; message: string }>("/dialogues/branch/", payload);

export const createDialogueOption = (payload: {
  dialogue_id: string;
  text: string;
  option_type?: string;
  post_id?: string;
  color?: string;
  icon?: string;
}) => api.post<DialogueOption>("/dialogues/option/", payload);

// Posts CRUD
export const listPosts = () => api.get<Post[]>(postsBase);
export const getPost = (id: string) => api.get<Post>(`${postsBase}${id}/`);
export const createPost = (payload: Partial<Post>) => api.post<Post>(postsBase, payload);
export const updatePost = (id: string, payload: Partial<Post>) => api.patch<Post>(`${postsBase}${id}/`, payload);
export const deletePost = (id: string) => api.delete(`${postsBase}${id}/`);

// Dialogue Options CRUD
export const listDialogueOptions = () => api.get<DialogueOption[]>(optionsBase);
export const getDialogueOption = (id: string) => api.get<DialogueOption>(`${optionsBase}${id}/`);
export const updateDialogueOption = (id: string, payload: Partial<DialogueOption>) => 
  api.patch<DialogueOption>(`${optionsBase}${id}/`, payload);
export const deleteDialogueOption = (id: string) => api.delete(`${optionsBase}${id}/`);

// Legacy functions
export const generateReplicas = (character_id: string, dialogue_id: string) =>
  api.post<{ top: string; random: string[] }>("/generate_replicas/", { character_id, dialogue_id });
