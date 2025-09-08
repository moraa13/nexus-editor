import { api } from "../lib/api";

export interface Dialogue {
  id?: string;
  title: string;
  project?: string | null;
  characters?: string[];
  created_at?: string; updated_at?: string;
}

export interface Post {
  id?: string;
  dialogue: string;
  speaker?: string;
  text: string;
  is_generated?: boolean;
  order?: number;
  created_at?: string; updated_at?: string;
}

const dialoguesBase = "/dialogues/";
const postsBase = "/posts/";

export const listDialogues = () => api.get<Dialogue[]>(dialoguesBase);
export const getDialogue = (id: string) => api.get<Dialogue>(`${dialoguesBase}${id}/`);
export const createDialogue = (payload: Partial<Dialogue>) => api.post<Dialogue>(dialoguesBase, payload);
export const updateDialogue = (id: string, payload: Partial<Dialogue>) => api.patch<Dialogue>(`${dialoguesBase}${id}/`, payload);
export const deleteDialogue = (id: string) => api.delete(`${dialoguesBase}${id}/`);

export const listPosts = () => api.get<Post[]>(postsBase);
export const getPost = (id: string) => api.get<Post>(`${postsBase}${id}/`);
export const createPost = (payload: Partial<Post>) => api.post<Post>(postsBase, payload);
export const updatePost = (id: string, payload: Partial<Post>) => api.patch<Post>(`${postsBase}${id}/`, payload);
export const deletePost = (id: string) => api.delete(`${postsBase}${id}/`);

export const generateReplicas = (character_id: string, dialogue_id: string) =>
  api.post<{ top: string; random: string[] }>("/generate_replicas/", { character_id, dialogue_id });
