// Project Settings and Management Types

export interface ProjectSettings {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  
  // Game Settings
  gameSetting: {
    genre: 'noir' | 'fantasy' | 'cyberpunk' | 'magical-realism' | 'post-apocalyptic' | 'detective' | 'horror' | 'comedy';
    emotionalTone: 'dark' | 'ironic' | 'romantic' | 'absurd' | 'inspiring' | 'melancholic' | 'hopeful' | 'chaotic';
    abstractionLevel: 'realistic' | 'metaphysical' | 'dreamlike' | 'hallucinatory';
    narrativeStyle: 'third-person' | 'first-person' | 'stream-of-consciousness' | 'epistolary';
    uiTheme: 'dark-noir' | 'bright-fantasy' | 'neon-cyber' | 'muted-realism' | 'dreamy-abstract';
  };
  
  // Game Tone Settings
  gameTone: {
    mood: 'dark-noir' | 'satire' | 'absurd' | 'heroic' | 'psychological-drama';
    descriptionStyle: 'serious' | 'ironic' | 'roleplay';
    uiTheme: 'classic-dark' | 'cyberpunk' | 'paper-diary' | 'retro';
  };
  
  // Character Settings
  character?: {
    id: string;
    name: string;
    stats: Record<string, number>;
    level: number;
    createdAt: string;
  };
  
  // Generated Content Cache
  generatedContent: {
    statDescriptions: Record<string, {
      description: string;
      history: string;
      skills: string[];
      lastGenerated: string;
    }>;
  };
}

export interface AIGenerationRequest {
  statName: string;
  category: string;
  tone: ProjectSettings['gameTone'];
  existingContent?: {
    description?: string;
    history?: string;
    skills?: string[];
  };
}

export interface AIGenerationResponse {
  description: string;
  history: string;
  skills: string[];
  metadata: {
    generatedAt: string;
    tone: string;
    model: string;
  };
}

// Default project settings
export const DEFAULT_PROJECT_SETTINGS: Partial<ProjectSettings> = {
  gameSetting: {
    genre: 'noir',
    emotionalTone: 'dark',
    abstractionLevel: 'realistic',
    narrativeStyle: 'first-person',
    uiTheme: 'dark-noir'
  },
  gameTone: {
    mood: 'dark-noir',
    descriptionStyle: 'serious',
    uiTheme: 'classic-dark'
  },
  generatedContent: {
    statDescriptions: {}
  }
};

// Project management utilities
export class ProjectManager {
  private static readonly STORAGE_KEY = 'nexus_projects';
  
  static saveProject(project: ProjectSettings): void {
    const projects = this.getAllProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.push({ ...project, updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }
  
  static getAllProjects(): ProjectSettings[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }
  
  static getProject(id: string): ProjectSettings | null {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === id) || null;
  }
  
  static deleteProject(id: string): boolean {
    const projects = this.getAllProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    
    if (filteredProjects.length < projects.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProjects));
      return true;
    }
    return false;
  }
  
  static createNewProject(name: string, description?: string): ProjectSettings {
    const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const project: ProjectSettings = {
      id,
      name,
      description,
      createdAt: now,
      updatedAt: now,
      ...DEFAULT_PROJECT_SETTINGS,
      generatedContent: {
        statDescriptions: {}
      }
    };
    
    this.saveProject(project);
    return project;
  }
}
