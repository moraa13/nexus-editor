export interface GameTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  effects: {
    shadows: boolean;
    gradients: boolean;
    animations: boolean;
  };
  mood: 'dark' | 'light' | 'neutral';
}

export const GAME_THEMES: Record<string, GameTheme> = {
  'dark-noir': {
    id: 'dark-noir',
    name: 'Темный нуар',
    description: 'Мрачная атмосфера с контрастными цветами',
    colors: {
      primary: '#1a1a1a',
      secondary: '#2d2d2d',
      accent: '#ff6b6b',
      background: '#0f0f0f',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#b3b3b3',
      border: '#404040',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336'
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Courier New, monospace'
    },
    effects: {
      shadows: true,
      gradients: false,
      animations: true
    },
    mood: 'dark'
  },
  'cyberpunk': {
    id: 'cyberpunk',
    name: 'Киберпанк',
    description: 'Неоновые цвета и футуристический стиль',
    colors: {
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffff00',
      background: '#0a0a0a',
      surface: '#1a1a2e',
      text: '#00ff00',
      textSecondary: '#00ffff',
      border: '#00ff00',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000'
    },
    fonts: {
      primary: 'Orbitron, sans-serif',
      secondary: 'Courier New, monospace'
    },
    effects: {
      shadows: true,
      gradients: true,
      animations: true
    },
    mood: 'dark'
  },
  'fantasy': {
    id: 'fantasy',
    name: 'Фэнтези',
    description: 'Теплые цвета и магическая атмосфера',
    colors: {
      primary: '#8b4513',
      secondary: '#daa520',
      accent: '#ffd700',
      background: '#2c1810',
      surface: '#3d2817',
      text: '#f4e4bc',
      textSecondary: '#d4af37',
      border: '#8b4513',
      success: '#228b22',
      warning: '#ff8c00',
      error: '#dc143c'
    },
    fonts: {
      primary: 'Cinzel, serif',
      secondary: 'Cinzel Decorative, serif'
    },
    effects: {
      shadows: true,
      gradients: true,
      animations: true
    },
    mood: 'dark'
  },
  'sci-fi': {
    id: 'sci-fi',
    name: 'Научная фантастика',
    description: 'Чистые линии и технологичный дизайн',
    colors: {
      primary: '#2196f3',
      secondary: '#03a9f4',
      accent: '#00bcd4',
      background: '#0d1421',
      surface: '#1a2332',
      text: '#e3f2fd',
      textSecondary: '#90caf9',
      border: '#2196f3',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336'
    },
    fonts: {
      primary: 'Roboto, sans-serif',
      secondary: 'Roboto Mono, monospace'
    },
    effects: {
      shadows: false,
      gradients: true,
      animations: true
    },
    mood: 'dark'
  },
  'horror': {
    id: 'horror',
    name: 'Хоррор',
    description: 'Мрачные тона и тревожная атмосфера',
    colors: {
      primary: '#8b0000',
      secondary: '#2f2f2f',
      accent: '#ff0000',
      background: '#000000',
      surface: '#1a0000',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#8b0000',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#ff0000'
    },
    fonts: {
      primary: 'Creepster, cursive',
      secondary: 'Nosifer, cursive'
    },
    effects: {
      shadows: true,
      gradients: false,
      animations: true
    },
    mood: 'dark'
  },
  'drama': {
    id: 'drama',
    name: 'Драма',
    description: 'Сдержанные цвета и элегантный стиль',
    colors: {
      primary: '#424242',
      secondary: '#616161',
      accent: '#9c27b0',
      background: '#fafafa',
      surface: '#ffffff',
      text: '#212121',
      textSecondary: '#757575',
      border: '#e0e0e0',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336'
    },
    fonts: {
      primary: 'Playfair Display, serif',
      secondary: 'Source Sans Pro, sans-serif'
    },
    effects: {
      shadows: false,
      gradients: false,
      animations: false
    },
    mood: 'light'
  }
};
