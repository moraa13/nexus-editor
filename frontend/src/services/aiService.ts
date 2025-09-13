// AI Service for generating character stat content
import type { AIGenerationRequest, AIGenerationResponse, ProjectSettings } from '../types/project';

export class AIService {
  private static readonly API_BASE_URL = 'https://api.openai.com/v1';
  private static readonly MODEL = 'gpt-3.5-turbo';
  
  // Mock API key for development - в продакшене должно быть в env переменных
  private static readonly API_KEY = 'sk-mock-key-for-development';
  
  /**
   * Generate content for a character stat based on tone settings
   */
  static async generateStatContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      // Для разработки используем mock данные
      // В продакшене здесь будет реальный вызов OpenAI API
      return await this.mockGenerateStatContent(request);
      
      // Реальный вызов API (закомментирован для разработки):
      // return await this.callOpenAIAPI(request);
    } catch (error) {
      console.error('AI generation failed:', error);
      throw new Error('Не удалось сгенерировать контент. Попробуйте позже.');
    }
  }
  
  /**
   * Mock генерация для разработки
   */
  private static async mockGenerateStatContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    // Имитируем задержку API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { statName, category, tone } = request;
    
    // Базовые шаблоны в зависимости от тональности
    const toneTemplates = {
      'dark-noir': {
        description: `В мрачном мире, где правда скрыта в тенях, ${statName.toLowerCase()} становится вашим единственным инструментом для проникновения в суть вещей.`,
        history: `Темная история вашего прошлого сформировала эту способность. Вы знаете, что в этом мире нельзя доверять никому.`,
        skills: ['анализ улик', 'чтение между строк', 'выявление лжи']
      },
      'satire': {
        description: `В этом абсурдном мире ${statName.toLowerCase()} помогает вам сохранить здравый смысл, пока все вокруг теряют его с невероятной скоростью.`,
        history: `Ваш жизненный опыт научил вас видеть комедию в трагедии и трагедию в комедии.`,
        skills: ['ироничный анализ', 'саркастические замечания', 'разоблачение абсурда']
      },
      'absurd': {
        description: `В мире, где логика перевернута с ног на голову, ${statName.toLowerCase()} - это ваш компас в хаосе безумия.`,
        history: `Вы научились находить смысл в бессмыслице и порядок в хаосе. Ваш разум адаптировался к нереальности.`,
        skills: ['принятие абсурда', 'творческое безумие', 'интуитивное понимание']
      },
      'heroic': {
        description: `В эпической саге вашей жизни ${statName.toLowerCase()} - это дар, который поможет вам совершить великие подвиги и спасти мир.`,
        history: `Ваше героическое прошлое и благородные поступки развили в вас эту способность до совершенства.`,
        skills: ['эпический анализ', 'героические решения', 'вдохновение других']
      },
      'psychological-drama': {
        description: `В глубинах человеческой психики ${statName.toLowerCase()} становится мостом между сознательным и бессознательным.`,
        history: `Ваши внутренние конфликты и психологические травмы сформировали уникальное понимание человеческой природы.`,
        skills: ['психологический анализ', 'эмпатическое понимание', 'глубокое проникновение']
      }
    };
    
    const template = toneTemplates[tone.mood] || toneTemplates['dark-noir'];
    
    // Адаптируем под стиль описания
    let description = template.description;
    let history = template.history;
    
    if (tone.descriptionStyle === 'ironic') {
      description = `Конечно же, ${statName.toLowerCase()} - это ваша суперспособность. Потому что в этом мире суперспособности - это норма.`;
      history = `Ваше прошлое научило вас относиться ко всему с иронией. Даже к своим собственным способностям.`;
    } else if (tone.descriptionStyle === 'roleplay') {
      description = `Герой обладает развитой способностью ${statName.toLowerCase()}, которая позволяет ему эффективно решать задачи в данной категории.`;
      history = `Прошлое персонажа сформировало его уникальные способности в этой области.`;
    }
    
    return {
      description,
      history,
      skills: template.skills,
      metadata: {
        generatedAt: new Date().toISOString(),
        tone: `${tone.mood}-${tone.descriptionStyle}`,
        model: this.MODEL
      }
    };
  }
  
  /**
   * Реальный вызов OpenAI API (для продакшена)
   */
  private static async callOpenAIAPI(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const { statName, category, tone } = request;
    
    const prompt = this.buildPrompt(request);
    
    const response = await fetch(`${this.API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.MODEL,
        messages: [
          {
            role: 'system',
            content: 'Ты эксперт по созданию игровых характеристик для интерактивных новелл. Создавай интересный и атмосферный контент.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    return this.parseAIResponse(content, request);
  }
  
  /**
   * Строит промпт для AI на основе настроек тональности
   */
  private static buildPrompt(request: AIGenerationRequest): string {
    const { statName, category, tone } = request;
    
    const toneDescriptions = {
      'dark-noir': 'мрачная нуарная атмосфера, детективные элементы',
      'satire': 'ироничный взгляд на мир, сатира',
      'absurd': 'абсурдные и неожиданные повороты',
      'heroic': 'эпические приключения и подвиги',
      'psychological-drama': 'глубокое погружение в психику'
    };
    
    const styleDescriptions = {
      'serious': 'серьёзный, официальный стиль',
      'ironic': 'ироничный стиль с долей юмора',
      'roleplay': 'стиль от третьего лица, как в книге'
    };
    
    return `
Создай контент для характеристики "${statName}" в категории "${category}" для интерактивной новеллы.

Настройки тональности:
- Настроение: ${toneDescriptions[tone.mood]}
- Стиль описания: ${styleDescriptions[tone.descriptionStyle]}

Нужно создать:
1. Описание (что даёт характеристика, какие задачи решает)
2. История (почему у героя высокий/низкий уровень - событие из прошлого)
3. Навыки (3-4 способности, которые развивает эта характеристика)

Отвечай в формате JSON:
{
  "description": "...",
  "history": "...",
  "skills": ["...", "...", "..."]
}
    `.trim();
  }
  
  /**
   * Парсит ответ от AI и преобразует в нужный формат
   */
  private static parseAIResponse(content: string, request: AIGenerationRequest): AIGenerationResponse {
    try {
      const parsed = JSON.parse(content);
      return {
        description: parsed.description || 'Описание не сгенерировано',
        history: parsed.history || 'История не сгенерирована',
        skills: parsed.skills || ['Базовый навык'],
        metadata: {
          generatedAt: new Date().toISOString(),
          tone: `${request.tone.mood}-${request.tone.descriptionStyle}`,
          model: this.MODEL
        }
      };
    } catch (error) {
      // Fallback если JSON не парсится
      return {
        description: content.substring(0, 200) + '...',
        history: 'История сгенерирована автоматически.',
        skills: ['Сгенерированный навык'],
        metadata: {
          generatedAt: new Date().toISOString(),
          tone: `${request.tone.mood}-${request.tone.descriptionStyle}`,
          model: this.MODEL
        }
      };
    }
  }
}
