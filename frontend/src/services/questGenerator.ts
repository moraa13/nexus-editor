// AI Quest Generation Service
export interface QuestStep {
  id: string;
  title: string;
  description: string;
  choices: QuestChoice[];
  requiredStat?: string;
  requiredValue?: number;
}

export interface QuestChoice {
  id: string;
  text: string;
  result: string;
  statModifier?: { stat: string; value: number };
  nextStepId?: string;
}

export interface Character {
  name: string;
  stats: Record<string, { name: string; value: number }>;
  skills: Record<string, { name: string; value: number }>;
}

export interface QuestContext {
  character: Character;
  currentStep: number;
  previousChoices: string[];
  questTheme: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

class QuestGenerator {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    // В реальном приложении API ключ должен быть в переменных окружения
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || null;
  }

  // Генерирует следующий шаг квеста на основе контекста
  async generateNextStep(context: QuestContext): Promise<QuestStep> {
    if (!this.apiKey) {
      // Fallback к предустановленным шагам если нет API ключа
      return this.getFallbackStep(context.currentStep);
    }

    try {
      const prompt = this.buildPrompt(context);
      const response = await this.callOpenAI(prompt);
      return this.parseResponse(response, context.currentStep);
    } catch (error) {
      console.error('AI generation failed, using fallback:', error);
      return this.getFallbackStep(context.currentStep);
    }
  }

  // Генерирует полный квест (несколько шагов)
  async generateFullQuest(context: QuestContext, stepCount: number = 5): Promise<QuestStep[]> {
    const steps: QuestStep[] = [];
    let currentContext = { ...context };

    for (let i = 0; i < stepCount; i++) {
      currentContext.currentStep = i;
      const step = await this.generateNextStep(currentContext);
      steps.push(step);
      
      // Обновляем контекст для следующего шага
      currentContext.previousChoices.push(`Step ${i}: ${step.title}`);
    }

    return steps;
  }

  private buildPrompt(context: QuestContext): string {
    const characterStats = Object.entries(context.character.stats)
      .map(([key, stat]) => `${stat.name}: ${stat.value}`)
      .join(', ');

    const characterSkills = Object.entries(context.character.skills)
      .slice(0, 6) // Показываем только первые 6 навыков
      .map(([key, skill]) => `${skill.name}: ${skill.value}`)
      .join(', ');

    return `
Создай шаг квеста в стиле Disco Elysium для персонажа "${context.character.name}".

Характеристики персонажа: ${characterStats}
Навыки: ${characterSkills}
Тема квеста: ${context.questTheme}
Сложность: ${context.difficulty}
Шаг: ${context.currentStep + 1}

Предыдущие выборы: ${context.previousChoices.join(', ')}

Создай один шаг квеста в формате JSON:
{
  "title": "Название шага",
  "description": "Подробное описание ситуации в стиле Disco Elysium",
  "choices": [
    {
      "text": "Вариант выбора",
      "result": "Результат выбора",
      "statModifier": {"stat": "название_стата", "value": число}
    }
  ]
}

Варианты статов: logic, empathy, volition, endurance, perception, composure
Значения модификаторов: от -2 до +2
Создай 3-4 варианта выбора с разными требованиями к характеристикам.
    `.trim();
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Ты создаешь квесты в стиле Disco Elysium. Отвечай только валидным JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private parseResponse(response: string, stepIndex: number): QuestStep {
    try {
      const parsed = JSON.parse(response);
      return {
        id: `ai_step_${stepIndex}`,
        title: parsed.title || `Шаг ${stepIndex + 1}`,
        description: parsed.description || 'Описание шага',
        choices: (parsed.choices || []).map((choice: any, index: number) => ({
          id: `choice_${stepIndex}_${index}`,
          text: choice.text || 'Выбор',
          result: choice.result || 'Результат',
          statModifier: choice.statModifier || undefined,
        })),
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.getFallbackStep(stepIndex);
    }
  }

  private getFallbackStep(stepIndex: number): QuestStep {
    const fallbackSteps: QuestStep[] = [
      {
        id: 'fallback_start',
        title: 'Начало приключения',
        description: 'Вы просыпаетесь в темной комнате. Голова болит, и вы не помните, как сюда попали. В углу комнаты стоит загадочная фигура.',
        choices: [
          {
            id: 'approach',
            text: 'Подойти к фигуре',
            result: 'Вы решаете подойти ближе...',
            statModifier: { stat: 'logic', value: 1 }
          },
          {
            id: 'observe',
            text: 'Внимательно осмотреться',
            result: 'Вы начинаете изучать комнату...',
            statModifier: { stat: 'perception', value: 1 }
          },
          {
            id: 'shout',
            text: 'Крикнуть: "Кто здесь?!"',
            result: 'Ваш голос эхом отдается по комнате...',
            statModifier: { stat: 'volition', value: 1 }
          }
        ]
      },
      {
        id: 'fallback_second',
        title: 'Встреча с незнакомцем',
        description: 'Фигура поворачивается к вам. Это человек в длинном плаще, лицо скрыто в тени. Он протягивает руку с каким-то предметом.',
        choices: [
          {
            id: 'take_item',
            text: 'Взять предмет',
            result: 'Вы берете предмет...',
            statModifier: { stat: 'endurance', value: 1 }
          },
          {
            id: 'ask_questions',
            text: 'Задать вопросы',
            result: 'Вы начинаете расспрашивать...',
            statModifier: { stat: 'empathy', value: 1 }
          },
          {
            id: 'refuse',
            text: 'Отказаться',
            result: 'Вы отказываетесь...',
            statModifier: { stat: 'composure', value: 1 }
          }
        ]
      }
    ];

    return fallbackSteps[stepIndex % fallbackSteps.length];
  }
}

export const questGenerator = new QuestGenerator();
