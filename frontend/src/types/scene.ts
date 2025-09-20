export interface Scene {
  id: string;
  title: string;
  description: string;
  location: string;
  characters: string[];
  events: Event[];
  conditions?: SceneCondition[];
  nextScenes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'dialogue' | 'action' | 'choice' | 'skill_check';
  content: string;
  options?: EventOption[];
  skillCheck?: SkillCheck;
  consequences?: EventConsequence[];
  order: number;
}

export interface EventOption {
  id: string;
  text: string;
  condition?: string;
  consequence: string;
  nextEventId?: string;
}

export interface SkillCheck {
  skill: string;
  difficulty: number;
  successEventId: string;
  failureEventId: string;
  description: string;
}

export interface EventConsequence {
  type: 'stat_change' | 'item_gain' | 'relationship_change' | 'unlock_scene';
  target: string;
  value: number | string;
  description: string;
}

export interface SceneCondition {
  type: 'stat_requirement' | 'item_requirement' | 'completed_scene' | 'relationship_level';
  target: string;
  value: number | string;
  operator: '>=' | '<=' | '==' | '!=' | 'contains';
}

export interface SceneTemplate {
  id: string;
  name: string;
  description: string;
  category: 'introduction' | 'conflict' | 'resolution' | 'exploration' | 'dialogue';
  template: Partial<Scene>;
}
