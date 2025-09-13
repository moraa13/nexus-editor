// Disco Elysium style types for Nexus Adventure

// Game Setting and Tone System
export interface GameSetting {
  genre: 'noir' | 'fantasy' | 'cyberpunk' | 'magical-realism' | 'post-apocalyptic' | 'detective' | 'horror' | 'comedy';
  emotionalTone: 'dark' | 'ironic' | 'romantic' | 'absurd' | 'inspiring' | 'melancholic' | 'hopeful' | 'chaotic';
  abstractionLevel: 'realistic' | 'metaphysical' | 'dreamlike' | 'hallucinatory';
  narrativeStyle: 'third-person' | 'first-person' | 'stream-of-consciousness' | 'epistolary';
  uiTheme: 'dark-noir' | 'bright-fantasy' | 'neon-cyber' | 'muted-realism' | 'dreamy-abstract';
}

export interface ToneTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  statDescriptions: Record<string, string>;
  statHistories: Record<string, string>;
  uiTheme: string;
}

export interface DiscoElysiumStat {
  id: string;
  name: string;
  shortName: string;
  category: 'Intellect' | 'Psyche' | 'Physique' | 'Motorics';
  description: string;
  history: string;
  skills: string[];
  color: string;
  icon: string;
  value: number; // 0-10 for character creation
  modifier: number; // Calculated modifier (value - 5)
  isActive: boolean; // Whether this stat can be used
  isLocked: boolean; // Whether this stat is locked (red check failed)
}

export interface DiscoElysiumCharacter {
  id: string;
  name: string;
  portrait?: string;
  stats: {
    // Intellect (3 stats)
    logic: DiscoElysiumStat;
    rhetoric: DiscoElysiumStat;
    analysis: DiscoElysiumStat;
    
    // Psyche (3 stats)
    empathy: DiscoElysiumStat;
    volition: DiscoElysiumStat;
    intuition: DiscoElysiumStat;
    
    // Physique (3 stats)
    endurance: DiscoElysiumStat;
    shivers: DiscoElysiumStat;
    impulse: DiscoElysiumStat;
    
    // Motorics (3 stats)
    perception: DiscoElysiumStat;
    dexterity: DiscoElysiumStat;
    composure: DiscoElysiumStat;
  };
  // Character progression
  level: number;
  experience: number;
  experienceToNext: number;
  // Health and morale
  health: number;
  maxHealth: number;
  morale: number;
  maxMorale: number;
}

export interface SkillCheck {
  id: string;
  stat: keyof DiscoElysiumCharacter['stats'];
  difficulty: 'Trivial' | 'Easy' | 'Medium' | 'Hard' | 'Extreme' | 'Impossible';
  dcValue: number; // Difficulty Class value
  description: string;
  successText: string;
  failureText: string;
  criticalSuccessText?: string;
  criticalFailureText?: string;
  isPassive: boolean; // Passive check (automatic) vs Active (player choice)
  isRed: boolean; // Red checks (failure has consequences)
  isWhite: boolean; // White checks (can be retried)
  // AI Generation
  aiGeneratedOptions?: string[]; // Pre-generated dialogue options
  aiPrompt?: string; // Prompt used for AI generation
}

export interface DialogueNode {
  id: string;
  type: 'statement' | 'question' | 'choice' | 'skill_check' | 'narrative';
  speaker?: string;
  text: string;
  emotion?: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'confused';
  position: { x: number; y: number };
  
  // Skill Check specific
  skillCheck?: SkillCheck;
  
  // Choice specific
  choices?: DialogueChoice[];
  
  // Visual styling
  color?: string;
  icon?: string;
  
  // AI Generation
  isGenerated?: boolean;
  generationPrompt?: string;
  confidence?: number; // 0-1
}

export interface DialogueChoice {
  id: string;
  text: string;
  requiredSkill?: keyof DiscoElysiumCharacter['skills'];
  requiredValue?: number;
  skillCheck?: SkillCheck;
  nextNodeId?: string;
  consequence?: string;
  isLocked?: boolean;
  lockReason?: string;
}

export interface DialogueTree {
  id: string;
  title: string;
  description?: string;
  startNodeId: string;
  nodes: DialogueNode[];
  characters: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Utility function for generating IDs
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface RollResult {
  id: string;
  skillCheckId: string;
  characterId: string;
  diceRoll: number; // 1-20
  statValue: number;
  statModifier: number;
  total: number; // diceRoll + statModifier
  dcValue: number;
  isSuccess: boolean;
  isCriticalSuccess: boolean;
  isCriticalFailure: boolean;
  resultText: string;
  selectedOption?: string; // AI-generated option that was selected
  timestamp: string;
}

// Dice roll system
export interface DiceRoll {
  id: string;
  diceType: 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
  result: number;
  maxValue: number;
  isCritical: boolean;
  timestamp: string;
}

// AI Dialogue Generation
export interface AIDialogueGeneration {
  id: string;
  stat: keyof DiscoElysiumCharacter['stats'];
  context: {
    character: string;
    situation: string;
    previousDialogue: string[];
    characterPersonality: string;
    mood: string;
    statValue: number;
    statModifier: number;
  };
  generatedOptions: AIDialogueOption[];
  selectedOption?: string;
  rollResult?: RollResult;
  timestamp: string;
}

export interface AIDialogueOption {
  id: string;
  text: string;
  stat: keyof DiscoElysiumCharacter['stats'];
  requiredValue: number;
  difficulty: 'Trivial' | 'Easy' | 'Medium' | 'Hard' | 'Extreme' | 'Impossible';
  dcValue: number;
  successText: string;
  failureText: string;
  isAvailable: boolean; // Based on stat value and roll
  confidence: number; // AI confidence in this option (0-1)
}

export interface AIGenerationRequest {
  type: 'dialogue' | 'choice' | 'narrative' | 'skill_check';
  context: {
    character?: string;
    situation?: string;
    previousDialogue?: string[];
    availableSkills?: string[];
    characterPersonality?: string;
    mood?: string;
  };
  constraints?: {
    maxLength?: number;
    tone?: 'formal' | 'casual' | 'dramatic' | 'comedic';
    style?: 'disco_elysium' | 'generic' | 'custom';
  };
}

export interface AIGenerationResponse {
  id: string;
  type: 'dialogue' | 'choice' | 'narrative' | 'skill_check';
  content: string;
  confidence: number;
  alternatives?: string[];
  metadata?: {
    tokens_used?: number;
    model?: string;
    generation_time?: number;
  };
}

export interface DialogueEditorState {
  selectedNodeId?: string;
  selectedCharacterId?: string;
  zoom: number;
  pan: { x: number; y: number };
  showGrid: boolean;
  showMinimap: boolean;
  autoSave: boolean;
  lastSaved?: string;
}

export interface DialogueValidationError {
  nodeId: string;
  type: 'missing_connection' | 'invalid_skill_check' | 'orphaned_node' | 'circular_reference';
  message: string;
  severity: 'warning' | 'error';
}

// Utility types
export type SkillCategory = 'Intellect' | 'Psyche' | 'Physique' | 'Motorics';
export type DifficultyLevel = 'Trivial' | 'Easy' | 'Medium' | 'Hard' | 'Extreme' | 'Impossible';
export type NodeType = 'statement' | 'question' | 'choice' | 'skill_check' | 'narrative';
export type EmotionType = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'confused';

// Constants
export const DIFFICULTY_DC_VALUES = {
  Trivial: 5,
  Easy: 10,
  Medium: 15,
  Hard: 20,
  Extreme: 25,
  Impossible: 30
} as const;

export const STAT_CATEGORIES = {
  Intellect: {
    color: '#3B82F6',
    stats: ['logic', 'rhetoric', 'analysis'],
    description: 'Thinking, reasoning, and understanding'
  },
  Psyche: {
    color: '#8B5CF6',
    stats: ['empathy', 'volition', 'intuition'],
    description: 'Emotions, willpower, and intuition'
  },
  Physique: {
    color: '#EF4444',
    stats: ['endurance', 'shivers', 'impulse'],
    description: 'Physical strength and resilience'
  },
  Motorics: {
    color: '#10B981',
    stats: ['perception', 'dexterity', 'composure'],
    description: 'Coordination, reflexes, and awareness'
  }
} as const;

// Character creation constants
export const CHARACTER_CREATION = {
  TOTAL_POINTS: 10, // Total points to distribute
  MIN_STAT_VALUE: 0,
  MAX_STAT_VALUE: 10,
  DEFAULT_STAT_VALUE: 0
} as const;

// Character creation stat definitions
export const CHARACTER_STATS = {
  // Intellect
  logic: {
    name: 'Логика',
    shortName: 'Лог',
    description: 'Способность анализировать, строить выводы и улавливать несостыковки',
    history: 'Ты всегда задаёшь вопросы, даже там, где не стоит. Разложить всё по полочкам — это твоя внутренняя потребность.',
    skills: ['дедукция', 'логический анализ', 'разоблачение лжи', 'опровержение аргументов'],
    icon: '💡',
    category: 'Intellect' as const,
    color: '#3B82F6'
  },
  rhetoric: {
    name: 'Риторика',
    shortName: 'Рит',
    description: 'Искусство убеждать, спорить и доминировать словом',
    history: 'Слова — твои клинки. Ты с детства выигрывал ссоры, даже если был неправ.',
    skills: ['ораторство', 'манипуляция', 'убеждение', 'ведение переговоров'],
    icon: '🗣️',
    category: 'Intellect' as const,
    color: '#3B82F6'
  },
  analysis: {
    name: 'Анализ',
    shortName: 'Анл',
    description: 'Способность видеть связи, прогнозировать и обобщать',
    history: 'Ты замечаешь закономерности там, где другие видят хаос.',
    skills: ['стратегическое мышление', 'анализ ситуации', 'планирование'],
    icon: '🧮',
    category: 'Intellect' as const,
    color: '#3B82F6'
  },
  
  // Psyche
  empathy: {
    name: 'Эмпатия',
    shortName: 'Эмп',
    description: 'Способность чувствовать других, их эмоции и состояние',
    history: 'Ты всегда знал, когда кто-то врёт, грустит или влюблён.',
    skills: ['чтение эмоций', 'настройка на собеседника', 'поддержка', 'искренность'],
    icon: '💗',
    category: 'Psyche' as const,
    color: '#8B5CF6'
  },
  volition: {
    name: 'Воля',
    shortName: 'Вол',
    description: 'Внутренняя устойчивость, сила духа и способность держаться',
    history: 'Даже когда весь мир рушился, ты стоял на ногах.',
    skills: ['сопротивление стрессу', 'моральная стойкость', 'контроль себя в критике'],
    icon: '🛡️',
    category: 'Psyche' as const,
    color: '#8B5CF6'
  },
  intuition: {
    name: 'Интуиция',
    shortName: 'Инт',
    description: 'Голос внутри. Что-то говорит тебе "не делай этого", и ты слушаешь',
    history: 'Твоя чуйка спасала тебя не раз. И никто не понимал — как?',
    skills: ['предчувствие', 'шестое чувство', 'принятие решений без фактов'],
    icon: '🌌',
    category: 'Psyche' as const,
    color: '#8B5CF6'
  },
  
  // Physique
  endurance: {
    name: 'Выносливость',
    shortName: 'Вын',
    description: 'Способность терпеть, тянуть, выживать',
    history: 'Сколько бы ни шли, ты всегда дойдёшь до конца.',
    skills: ['физическая живучесть', 'сопротивление урону', 'длительное напряжение'],
    icon: '💪',
    category: 'Physique' as const,
    color: '#EF4444'
  },
  shivers: {
    name: 'Мурашки',
    shortName: 'Мур',
    description: 'Твоя кожа чует приближение беды. Холод в позвоночнике — предупреждение',
    history: 'Ты всегда первым знал, что "что-то не так".',
    skills: ['ощущение надвигающейся опасности', 'восприятие атмосферы', 'страх'],
    icon: '😰',
    category: 'Physique' as const,
    color: '#EF4444'
  },
  impulse: {
    name: 'Импульс',
    shortName: 'Имп',
    description: 'Вспышки, реактивность, сила воли без фильтра',
    history: 'Ты действуешь до того, как осмыслишь. Иногда — это спасает. Иногда — нет.',
    skills: ['агрессия', 'спонтанные решения', 'атака первым'],
    icon: '⚡',
    category: 'Physique' as const,
    color: '#EF4444'
  },
  
  // Motorics
  perception: {
    name: 'Восприятие',
    shortName: 'Вос',
    description: 'Глаза, уши, кожа — твои инструменты. Ты замечаешь детали',
    history: 'Ты замечал пятна крови на ботинках, которые никто не видел.',
    skills: ['внимательность', 'острота чувств', 'детализация'],
    icon: '👁️',
    category: 'Motorics' as const,
    color: '#10B981'
  },
  dexterity: {
    name: 'Ловкость',
    shortName: 'Лов',
    description: 'Пластика, скорость, рефлексы',
    history: 'Твоя рука ловила мяч ещё до того, как мозг осознал, что он летит.',
    skills: ['акробатика', 'уход от атак', 'ловля предметов', 'кража'],
    icon: '🕺',
    category: 'Motorics' as const,
    color: '#10B981'
  },
  composure: {
    name: 'Самообладание',
    shortName: 'Сам',
    description: 'Контроль над лицом, голосом, телом. Ты не даёшь слабину',
    history: 'Даже когда тебя били — ты не показал страха.',
    skills: ['эмоциональная маска', 'подавление реакции', 'внешняя стойкость'],
    icon: '😐',
    category: 'Motorics' as const,
    color: '#10B981'
  },
} as const;

// Tone Templates for different genres
export const TONE_TEMPLATES: Record<string, ToneTemplate> = {
  noir: {
    id: 'noir',
    name: 'Нуар',
    description: 'Мрачный детектив с дождём, тенями и моральными дилеммами',
    icon: '🌧️',
    color: '#1F2937',
    uiTheme: 'dark-noir',
    statDescriptions: {
      logic: 'Холодный анализ улик и мотивов. В мире лжи это твой единственный якорь.',
      rhetoric: 'Слова как ножи в темноте. Ты умеешь говорить так, что люди раскрываются.',
      analysis: 'Видеть связи там, где другие видят хаос. Паттерны преступлений, паттерны жизни.',
      empathy: 'Инструмент выживания на улицах, где ложь — норма. Чувствовать, когда тебя обманывают.',
      volition: 'Внутренний стержень в мире, где всё рушится. Держаться за свои принципы.',
      intuition: 'Голос улиц. Знать, когда что-то не так, ещё до того, как это произойдёт.',
      endurance: 'Выживать в дождь, холод и отчаяние. Терпеть, когда больше нечего делать.',
      shivers: 'Холод по коже. Предчувствие беды, которое не подведёт.',
      impulse: 'Реакция до мысли. В тёмном переулке это может спасти жизнь.',
      perception: 'Замечать детали в полумраке. Тени, которые рассказывают истории.',
      dexterity: 'Быстрые руки в медленном мире. Ловкость, которая спасает от пуль.',
      composure: 'Каменное лицо в шторме эмоций. Не показывать страх, когда внутри всё кричит.'
    },
    statHistories: {
      logic: 'Ты всегда видел логику там, где другие видели хаос. Улицы научили тебя читать людей.',
      rhetoric: 'Слова были твоим оружием в мире, где правда — роскошь.',
      analysis: 'Ты научился видеть закономерности в преступлениях, потому что жизнь сама по себе преступление.',
      empathy: 'На улицах эмпатия — это не слабость, а способность выжить.',
      volition: 'Когда весь мир против тебя, воля — это всё, что у тебя остаётся.',
      intuition: 'Улицы научили тебя доверять чуйке больше, чем фактам.',
      endurance: 'Ты прошёл через ад и вышел с другой стороны. Не сломался.',
      shivers: 'Твоя кожа помнит каждую опасность. Холод по спине — предупреждение.',
      impulse: 'В тёмных переулках думать некогда. Действовать нужно мгновенно.',
      perception: 'Ты научился видеть в темноте то, что другие не видят при свете.',
      dexterity: 'Быстрые руки спасали тебя не раз. Рефлексы, заточенные на выживание.',
      composure: 'Ты научился не показывать страх, даже когда внутри всё дрожит.'
    }
  },
  
  fantasy: {
    id: 'fantasy',
    name: 'Фэнтези',
    description: 'Магический мир с драконами, эльфами и древними тайнами',
    icon: '🧙‍♂️',
    color: '#7C3AED',
    uiTheme: 'bright-fantasy',
    statDescriptions: {
      logic: 'Мудрость веков и понимание магических законов. Логика в мире чудес.',
      rhetoric: 'Искусство зачаровывать словом. Говорить так, что даже драконы слушают.',
      analysis: 'Читать древние тексты и понимать язык звёзд. Анализ магических паттернов.',
      empathy: 'Дар слушать эхо чужих душ. Понимать сердца всех живых существ.',
      volition: 'Сила духа, способная противостоять тёмной магии. Непоколебимая воля.',
      intuition: 'Магическое чутьё. Слышать шёпот духов и предчувствовать судьбу.',
      endurance: 'Выносливость героя, способного пройти через любые испытания.',
      shivers: 'Чувствительность к магическим потокам. Ощущать приближение тёмных сил.',
      impulse: 'Реакция воина, закалённого в битвах. Инстинкты, спасающие жизнь.',
      perception: 'Зрение орла, слух кошки. Замечать то, что скрыто от смертных глаз.',
      dexterity: 'Ловкость эльфа, грация кошки. Движения, зачарованные магией.',
      composure: 'Спокойствие мудреца. Сохранять ясность ума в самых безумных ситуациях.'
    },
    statHistories: {
      logic: 'Ты изучал древние книги и постигал мудрость веков. Логика — твой магический дар.',
      rhetoric: 'Ты научился говорить на языке драконов и зачаровывать словом.',
      analysis: 'Магические артефакты рассказывали тебе свои истории. Ты научился их слушать.',
      empathy: 'Ты слышал песни эльфов и плач единорогов. Эмпатия — твой дар от природы.',
      volition: 'Ты противостоял тёмным лордам и не дрогнул. Воля — твоя сила.',
      intuition: 'Духи говорили с тобой во снах. Твоя интуиция — голос древней магии.',
      endurance: 'Ты прошёл через огненные горы и ледяные пустыни. Выносливость — твоя суть.',
      shivers: 'Твоя кожа чувствовала приближение тёмных магов. Магическое предчувствие.',
      impulse: 'В битвах с орками ты действовал без раздумий. Инстинкты воина.',
      perception: 'Ты видел то, что скрыто за завесой реальности. Магическое зрение.',
      dexterity: 'Ты танцевал с эльфами и летал с драконами. Ловкость — твой дар.',
      composure: 'Даже перед лицом дракона ты оставался спокоен. Хладнокровие героя.'
    }
  },
  
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Киберпанк',
    description: 'Неоновое будущее с киборгами, хакерами и корпорациями',
    icon: '🤖',
    color: '#EC4899',
    uiTheme: 'neon-cyber',
    statDescriptions: {
      logic: 'Алгоритмическое мышление в мире, где всё — код. Логика как операционная система.',
      rhetoric: 'Виртуальная харизма. Убеждать через интерфейсы и нейросети.',
      analysis: 'Анализ данных в реальном времени. Видеть паттерны в информационных потоках.',
      empathy: 'Эмоциональный интерфейс. Читать людей через их цифровые следы.',
      volition: 'Защита от ментальных атак. Сохранять личность в цифровом хаосе.',
      intuition: 'Нейроинтуиция. Предчувствовать кибератаки и цифровые ловушки.',
      endurance: 'Кибернетическая выносливость. Работать без сна в цифровом пространстве.',
      shivers: 'Сенсоры угроз. Ощущать приближение вирусов и хакерских атак.',
      impulse: 'Рефлексы киборга. Реагировать на угрозы со скоростью процессора.',
      perception: 'Улучшенное восприятие. Видеть в инфракрасном спектре и за стенами.',
      dexterity: 'Точность робота. Выполнять движения с кибернетической точностью.',
      composure: 'Эмоциональный контроль. Подавлять панику в критические моменты.'
    },
    statHistories: {
      logic: 'Ты научился мыслить как машина в мире, где люди и роботы сливаются.',
      rhetoric: 'Твои слова проникают через цифровые барьеры и нейросети.',
      analysis: 'Ты читаешь данные как открытую книгу, видя скрытые связи.',
      empathy: 'Ты чувствуешь эмоции через их цифровые отпечатки.',
      volition: 'Твоя воля — единственная защита от ментального взлома.',
      intuition: 'Твоя интуиция работает как антивирус, предчувствуя угрозы.',
      endurance: 'Ты можешь работать в цифровом пространстве сутками без усталости.',
      shivers: 'Твои сенсоры предупреждают о кибератаках ещё до их начала.',
      impulse: 'Твои рефлексы синхронизированы с процессором.',
      perception: 'Твои глаза видят то, что скрыто от обычных людей.',
      dexterity: 'Твоя ловкость усилена кибернетическими имплантами.',
      composure: 'Ты сохраняешь хладнокровие даже при сбое системы.'
    }
  }
} as const;

// Roll result types for dialogue options
export const ROLL_RESULT_TYPES = {
  CRITICAL_SUCCESS: {
    color: '#10B981',
    icon: '🎯',
    name: 'Critical Success',
    description: 'Exceptional performance'
  },
  SUCCESS: {
    color: '#3B82F6',
    icon: '✅',
    name: 'Success',
    description: 'Good result'
  },
  FAILURE: {
    color: '#EF4444',
    icon: '❌',
    name: 'Failure',
    description: 'Poor performance'
  },
  ALTERNATIVE: {
    color: '#6B7280',
    icon: '🤔',
    name: 'Alternative',
    description: 'Different approach'
  }
} as const;
