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
  user: number; // Changed to number for consistency
  display_name?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Character {
  id: UUID;
  name: string;
  portrait?: string;
  logic: number;
  encyclopedia: number;
  rhetoric: number;
  drama: number;
  conceptualization: number;
  visual_calculus: number;
  volition: number;
  inland_empire: number;
  empathy: number;
  authority: number;
  suggestion: number;
  espirit_de_corps: number;
  endurance: number;
  pain_threshold: number;
  physical_instrument: number;
  electrochemistry: number;
  shivers: number;
  half_light: number;
  hand_eye_coordination: number;
  perception: number;
  reaction_speed: number;
  savoir_faire: number;
  interfacing: number;
  composure: number;
  created_at?: string;
  updated_at?: string;
}

export interface Dialogue {
  id: UUID;
  title: string;
  project?: UUID;
  characters?: UUID[];
  posts?: Post[];
  options?: DialogueOption[];
  posts_count?: number;
  options_count?: number;
  branching_points_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SkillCheck {
  id: UUID;
  dialogue: UUID;
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

export interface Quest {
  id: UUID;
  title: string;
  description?: string;
  quest_type: string;
  difficulty_level: number;
  assigned_character?: UUID;
  status: string;
  project?: UUID;
  dialogue?: UUID;
  created_at?: string;
  updated_at?: string;
}

export interface RollResult {
  id: UUID;
  skill_check: UUID;
  character: UUID;
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

export interface Post {
  id: UUID;
  dialogue: UUID;
  speaker?: string;
  text: string;
  is_generated: boolean;
  order: number;
  has_options: boolean;
  is_branching_point: boolean;
  post_type: 'statement' | 'question' | 'action' | 'narration';
  color: string;
  icon: string;
  available_options?: DialogueOption[];
  options_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DialogueOption {
  id: UUID;
  dialogue: UUID;
  text: string;
  option_type: 'response' | 'choice' | 'skill_check' | 'condition';
  order: number;
  is_available: boolean;
  next_dialogue?: UUID;
  next_post?: UUID;
  skill_check?: UUID;
  required_skill?: string;
  required_skill_value?: number;
  condition_text?: string;
  condition_met: boolean;
  color: string;
  icon: string;
  metadata?: Record<string, any>;
  skill_check_details?: SkillCheck;
  next_dialogue_title?: string;
  next_post_text?: string;
  is_accessible?: boolean;
  option_type_display?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DialogueTree {
  id: UUID;
  title: string;
  posts: Post[];
  branches: DialogueTree[];
}

export interface DialogueTreeResponse {
  dialogue: Dialogue;
  tree_structure: DialogueTree;
}

export interface QuestObjective {
  id: UUID;
  quest: UUID;
  title: string;
  description?: string;
  objective_type: 'dialogue' | 'kill' | 'collect' | 'deliver' | 'reach' | 'interact' | 'skill_check' | 'time_limit';
  is_completed: boolean;
  is_optional: boolean;
  order: number;
  trigger_dialogue?: UUID;
  completion_dialogue?: UUID;
  required_count: number;
  current_count: number;
  metadata?: Record<string, any>;
  quest_title?: string;
  objective_type_display?: string;
  progress_percentage?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Quest {
  id: UUID;
  title: string;
  description?: string;
  quest_type: 'dialogue' | 'combat' | 'skill_check' | 'exploration' | 'puzzle' | 'social' | 'fetch' | 'elimination' | 'escort' | 'investigation';
  priority: 'low' | 'normal' | 'high' | 'critical';
  difficulty_level: number;
  status: 'available' | 'active' | 'completed' | 'failed' | 'locked' | 'paused';
  progress: number;
  max_progress: number;
  project?: UUID;
  assigned_character?: UUID;
  quest_giver?: UUID;
  start_dialogue?: UUID;
  completion_dialogue?: UUID;
  failure_dialogue?: UUID;
  prerequisites?: UUID[];
  required_skills?: Record<string, number>;
  required_items?: string[];
  experience_reward: number;
  skill_rewards?: Record<string, number>;
  item_rewards?: string[];
  time_limit?: string;
  deadline?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  color: string;
  icon: string;
  objectives?: QuestObjective[];
  assigned_character_name?: string;
  quest_giver_name?: string;
  project_name?: string;
  start_dialogue_title?: string;
  completion_dialogue_title?: string;
  failure_dialogue_title?: string;
  objectives_count?: number;
  completed_objectives_count?: number;
  progress_percentage?: number;
  status_display?: string;
  quest_type_display?: string;
  priority_display?: string;
  is_available_for_character?: boolean;
  can_start?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface QuestCharacter {
  id: UUID;
  quest: UUID;
  character: UUID;
  is_primary: boolean;
  quest_title?: string;
  character_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuestAction {
  type: 'quest_started' | 'quest_completed' | 'objective_started' | 'objective_completed';
  quest_id?: string;
  quest_title?: string;
  objective_id?: string;
  objective_title?: string;
}

export interface CharacterQuests {
  available: Quest[];
  active: Quest[];
  completed: Quest[];
}


