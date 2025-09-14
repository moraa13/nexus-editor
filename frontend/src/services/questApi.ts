// Quest API Service for Frontend
import axios from 'axios';

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

class QuestApiService {
  private baseUrl: string;

  constructor() {
    // Use Vite environment variable
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  }

  // Generate full quest with multiple steps
  async generateFullQuest(context: QuestContext, stepCount: number = 2): Promise<QuestStep[]> {
    try {
      const response = await axios.post(`${this.baseUrl}/quests/generate/`, {
        character: context.character,
        current_step: context.currentStep,
        previous_choices: context.previousChoices,
        quest_theme: context.questTheme,
        difficulty: context.difficulty,
        step_count: stepCount
      });

      if (response.data.success) {
        return response.data.quest_steps;
      } else {
        throw new Error(response.data.error || 'Quest generation failed');
      }
    } catch (error) {
      console.error('Quest generation API error:', error);
      // Return fallback quest steps
      return this.getFallbackQuest(stepCount);
    }
  }

  // Generate single quest step
  async generateQuestStep(context: QuestContext): Promise<QuestStep> {
    try {
      const response = await axios.post(`${this.baseUrl}/quests/generate-step/`, {
        character: context.character,
        current_step: context.currentStep,
        previous_choices: context.previousChoices,
        quest_theme: context.questTheme,
        difficulty: context.difficulty
      });

      if (response.data.success) {
        return response.data.quest_step;
      } else {
        throw new Error(response.data.error || 'Quest step generation failed');
      }
    } catch (error) {
      console.error('Quest step generation API error:', error);
      // Return fallback quest step
      return this.getFallbackStep(context.currentStep);
    }
  }

  // Fallback quest steps when API is unavailable
  private getFallbackQuest(stepCount: number): QuestStep[] {
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
      },
      {
        id: 'fallback_third',
        title: 'Откровение',
        description: 'Незнакомец объясняет: "Ты в мире, где твои мысли становятся реальностью. Твои характеристики определяют, как ты воспринимаешь этот мир."',
        choices: [
          {
            id: 'accept',
            text: 'Принять это как данность',
            result: 'Вы понимаете, что это новый мир возможностей.',
            statModifier: { stat: 'logic', value: 2 }
          },
          {
            id: 'question',
            text: 'Задать больше вопросов',
            result: 'Вы начинаете расспрашивать о деталях...',
            statModifier: { stat: 'empathy', value: 1 }
          },
          {
            id: 'resist',
            text: 'Сопротивляться этому',
            result: 'Вы пытаетесь найти логическое объяснение...',
            statModifier: { stat: 'volition', value: 2 }
          }
        ]
      }
    ];

    return fallbackSteps.slice(0, stepCount);
  }

  // Fallback single step
  private getFallbackStep(stepIndex: number): QuestStep {
    const fallbackSteps = this.getFallbackQuest(3);
    return fallbackSteps[stepIndex % fallbackSteps.length];
  }
}

export const questApiService = new QuestApiService();
