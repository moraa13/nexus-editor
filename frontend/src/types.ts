export type UUID = string;

export interface Project {
  id: UUID;
  title: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: UUID;
  user: number | string;
  display_name?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}


