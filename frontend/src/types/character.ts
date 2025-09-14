// Unified Character types for Nexus Editor

export interface Character {
  id: string;
  name: string;
  portrait?: string;
  project?: string;
  
  // Main attributes (1-20)
  intellect: number;
  psyche: number;
  physique: number;
  motorics: number;
  
  // Intellect skills (1-20)
  logic: number;
  encyclopedia: number;
  rhetoric: number;
  drama: number;
  conceptualization: number;
  visual_calculus: number;
  
  // Psyche skills (1-20)
  volition: number;
  inland_empire: number;
  empathy: number;
  authority: number;
  suggestion: number;
  espirit_de_corps: number;
  
  // Physique skills (1-20)
  endurance: number;
  pain_threshold: number;
  physical_instrument: number;
  electrochemistry: number;
  shivers: number;
  half_light: number;
  
  // Motorics skills (1-20)
  hand_eye_coordination: number;
  perception: number;
  reaction_speed: number;
  savoir_faire: number;
  interfacing: number;
  composure: number;
  
  // Computed totals (from backend)
  intellect_total?: number;
  psyche_total?: number;
  physique_total?: number;
  motorics_total?: number;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export interface CharacterStat {
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

export interface CharacterCreationData {
  name: string;
  stats: Record<string, number>;
  remainingPoints: number;
  selectedStat?: string;
}

// Character skill categories
export const CHARACTER_SKILLS = {
  intellect: [
    'logic', 'encyclopedia', 'rhetoric', 'drama', 'conceptualization', 'visual_calculus'
  ],
  psyche: [
    'volition', 'inland_empire', 'empathy', 'authority', 'suggestion', 'espirit_de_corps'
  ],
  physique: [
    'endurance', 'pain_threshold', 'physical_instrument', 'electrochemistry', 'shivers', 'half_light'
  ],
  motorics: [
    'hand_eye_coordination', 'perception', 'reaction_speed', 'savoir_faire', 'interfacing', 'composure'
  ]
} as const;

// Character creation constants
export const CHARACTER_CREATION = {
  MAX_POINTS: 10,
  MIN_STAT_VALUE: 0,
  MAX_STAT_VALUE: 10,
  DEFAULT_STAT_VALUE: 2
} as const;

// Skill descriptions and metadata
export const SKILL_METADATA: Record<string, Omit<CharacterStat, 'value' | 'modifier' | 'isActive' | 'isLocked'>> = {
  // Intellect skills
  logic: {
    id: 'logic',
    name: 'Logic',
    shortName: 'LOG',
    category: 'Intellect',
    description: 'Рациональное мышление и логический анализ',
    history: 'Ваше образование и тренировка разума развили способность к логическому мышлению',
    skills: ['анализ фактов', 'выявление противоречий', 'систематическое мышление'],
    color: '#3B82F6',
    icon: '🧠'
  },
  encyclopedia: {
    id: 'encyclopedia',
    name: 'Encyclopedia',
    shortName: 'ENC',
    category: 'Intellect',
    description: 'Знания и эрудиция',
    history: 'Ваша любовь к знаниям и образованию накопила обширную базу информации',
    skills: ['знание истории', 'общие знания', 'академическая эрудиция'],
    color: '#8B5CF6',
    icon: '📚'
  },
  rhetoric: {
    id: 'rhetoric',
    name: 'Rhetoric',
    shortName: 'RHET',
    category: 'Intellect',
    description: 'Искусство убеждения и красноречие',
    history: 'Ваш опыт в дебатах и публичных выступлениях развил навыки убеждения',
    skills: ['публичные выступления', 'убеждение', 'риторические приемы'],
    color: '#F59E0B',
    icon: '🎭'
  },
  drama: {
    id: 'drama',
    name: 'Drama',
    shortName: 'DRM',
    category: 'Intellect',
    description: 'Театральность и эмоциональное воздействие',
    history: 'Ваш актерский опыт и понимание человеческих эмоций',
    skills: ['актерское мастерство', 'эмоциональное воздействие', 'театральность'],
    color: '#EF4444',
    icon: '🎪'
  },
  conceptualization: {
    id: 'conceptualization',
    name: 'Conceptualization',
    shortName: 'CON',
    category: 'Intellect',
    description: 'Абстрактное мышление и концептуализация',
    history: 'Ваша способность мыслить абстрактно и создавать концепции',
    skills: ['абстрактное мышление', 'концептуализация', 'философские размышления'],
    color: '#10B981',
    icon: '💭'
  },
  visual_calculus: {
    id: 'visual_calculus',
    name: 'Visual Calculus',
    shortName: 'VIS',
    category: 'Intellect',
    description: 'Пространственное мышление и визуальный анализ',
    history: 'Ваша способность анализировать пространство и визуальные паттерны',
    skills: ['пространственный анализ', 'визуальное мышление', 'геометрия'],
    color: '#06B6D4',
    icon: '📐'
  },
  
  // Psyche skills
  volition: {
    id: 'volition',
    name: 'Volition',
    shortName: 'VOL',
    category: 'Psyche',
    description: 'Сила воли и решимость',
    history: 'Ваша внутренняя сила и способность противостоять искушениям',
    skills: ['самоконтроль', 'решимость', 'сопротивление искушениям'],
    color: '#DC2626',
    icon: '💪'
  },
  inland_empire: {
    id: 'inland_empire',
    name: 'Inland Empire',
    shortName: 'INL',
    category: 'Psyche',
    description: 'Внутренний мир и интуиция',
    history: 'Ваш богатый внутренний мир и развитая интуиция',
    skills: ['интуиция', 'самоанализ', 'внутренние переживания'],
    color: '#7C3AED',
    icon: '🌌'
  },
  empathy: {
    id: 'empathy',
    name: 'Empathy',
    shortName: 'EMP',
    category: 'Psyche',
    description: 'Способность понимать чувства других',
    history: 'Ваша способность чувствовать и понимать эмоции других людей',
    skills: ['понимание эмоций', 'сострадание', 'эмоциональная связь'],
    color: '#EC4899',
    icon: '❤️'
  },
  authority: {
    id: 'authority',
    name: 'Authority',
    shortName: 'AUT',
    category: 'Psyche',
    description: 'Лидерские качества и авторитет',
    history: 'Ваш опыт лидерства и способность влиять на других',
    skills: ['лидерство', 'командование', 'влияние на людей'],
    color: '#B91C1C',
    icon: '👑'
  },
  suggestion: {
    id: 'suggestion',
    name: 'Suggestion',
    shortName: 'SUG',
    category: 'Psyche',
    description: 'Способность внушать идеи и убеждения',
    history: 'Ваша способность мягко влиять на мнения и решения других',
    skills: ['внушение', 'манипуляция', 'психологическое воздействие'],
    color: '#7C2D12',
    icon: '🎯'
  },
  espirit_de_corps: {
    id: 'espirit_de_corps',
    name: 'Espirit de Corps',
    shortName: 'ESP',
    category: 'Psyche',
    description: 'Чувство команды и коллективного духа',
    history: 'Ваш опыт работы в команде и понимание групповой динамики',
    skills: ['командная работа', 'групповая динамика', 'коллективный дух'],
    color: '#059669',
    icon: '🤝'
  },
  
  // Physique skills
  endurance: {
    id: 'endurance',
    name: 'Endurance',
    shortName: 'END',
    category: 'Physique',
    description: 'Физическая выносливость',
    history: 'Ваша физическая подготовка и способность выдерживать нагрузки',
    skills: ['физическая выносливость', 'выносливость к боли', 'длительные усилия'],
    color: '#16A34A',
    icon: '🏃'
  },
  pain_threshold: {
    id: 'pain_threshold',
    name: 'Pain Threshold',
    shortName: 'PAI',
    category: 'Physique',
    description: 'Порог болевой чувствительности',
    history: 'Ваша способность переносить боль и физические страдания',
    skills: ['переносимость боли', 'стойкость', 'физическая выносливость'],
    color: '#CA8A04',
    icon: '🩹'
  },
  physical_instrument: {
    id: 'physical_instrument',
    name: 'Physical Instrument',
    shortName: 'PHY',
    category: 'Physique',
    description: 'Физическая сила и координация',
    history: 'Ваша физическая сила и координация движений',
    skills: ['физическая сила', 'координация', 'физические навыки'],
    color: '#DC2626',
    icon: '💪'
  },
  electrochemistry: {
    id: 'electrochemistry',
    name: 'Electrochemistry',
    shortName: 'ELC',
    category: 'Physique',
    description: 'Химические зависимости и стимуляция',
    history: 'Ваши отношения с различными химическими веществами и зависимостями',
    skills: ['понимание зависимостей', 'химическая чувствительность', 'стимуляция'],
    color: '#9333EA',
    icon: '⚡'
  },
  shivers: {
    id: 'shivers',
    name: 'Shivers',
    shortName: 'SHV',
    category: 'Physique',
    description: 'Интуитивное восприятие окружения',
    history: 'Ваша способность чувствовать атмосферу и настроение места',
    skills: ['чувство атмосферы', 'интуитивное восприятие', 'эмпатия к месту'],
    color: '#0891B2',
    icon: '🌬️'
  },
  half_light: {
    id: 'half_light',
    name: 'Half Light',
    shortName: 'HLF',
    category: 'Physique',
    description: 'Агрессивные инстинкты и насилие',
    history: 'Ваши скрытые агрессивные импульсы и способность к насилию',
    skills: ['агрессия', 'насилие', 'защитные инстинкты'],
    color: '#991B1B',
    icon: '⚔️'
  },
  
  // Motorics skills
  hand_eye_coordination: {
    id: 'hand_eye_coordination',
    name: 'Hand/Eye Coordination',
    shortName: 'HEC',
    category: 'Motorics',
    description: 'Координация рук и глаз',
    history: 'Ваша способность точно координировать движения рук и глаз',
    skills: ['точность движений', 'координация', 'мелкая моторика'],
    color: '#0D9488',
    icon: '🎯'
  },
  perception: {
    id: 'perception',
    name: 'Perception',
    shortName: 'PER',
    category: 'Motorics',
    description: 'Восприятие деталей и наблюдение',
    history: 'Ваша способность замечать детали и изменения в окружении',
    skills: ['наблюдение', 'внимание к деталям', 'восприятие'],
    color: '#7C3AED',
    icon: '👁️'
  },
  reaction_speed: {
    id: 'reaction_speed',
    name: 'Reaction Speed',
    shortName: 'RSP',
    category: 'Motorics',
    description: 'Скорость реакции',
    history: 'Ваша способность быстро реагировать на изменения',
    skills: ['быстрая реакция', 'рефлексы', 'мгновенные реакции'],
    color: '#EA580C',
    icon: '⚡'
  },
  savoir_faire: {
    id: 'savoir_faire',
    name: 'Savoir Faire',
    shortName: 'SAV',
    category: 'Motorics',
    description: 'Изящество и стиль в движениях',
    history: 'Ваша способность двигаться с изяществом и стилем',
    skills: ['изящество движений', 'стиль', 'элегантность'],
    color: '#BE185D',
    icon: '💃'
  },
  interfacing: {
    id: 'interfacing',
    name: 'Interfacing',
    shortName: 'INT',
    category: 'Motorics',
    description: 'Взаимодействие с технологиями',
    history: 'Ваша способность работать с различными технологиями и интерфейсами',
    skills: ['работа с техникой', 'технологические навыки', 'интерфейсы'],
    color: '#1F2937',
    icon: '💻'
  },
  composure: {
    id: 'composure',
    name: 'Composure',
    shortName: 'COM',
    category: 'Motorics',
    description: 'Спокойствие и контроль в стрессовых ситуациях',
    history: 'Ваша способность сохранять спокойствие в сложных ситуациях',
    skills: ['самоконтроль', 'спокойствие', 'стрессоустойчивость'],
    color: '#374151',
    icon: '😌'
  }
};

