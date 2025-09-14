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
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
  }

  // Generate full quest with multiple steps
  async generateFullQuest(context: QuestContext, stepCount: number = 2): Promise<QuestStep[]> {
    try {
      const url = `${this.baseUrl}/quests/generate/`;
      const data = {
        character: context.character,
        current_step: context.currentStep,
        previous_choices: context.previousChoices,
        quest_theme: context.questTheme,
        difficulty: context.difficulty,
        step_count: stepCount
      };
      
      console.log('Quest API Request:', { url, data });
      
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false, // Don't send cookies for now
      });

      if (response.data.success) {
        return response.data.quest_steps;
      } else {
        throw new Error(response.data.error || 'Quest generation failed');
      }
    } catch (error) {
      console.error('Quest generation API error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
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
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false, // Don't send cookies for now
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
  public getFallbackQuest(stepCount: number): QuestStep[] {
    const fallbackSteps: QuestStep[] = [
      {
        id: 'fallback_start',
        title: 'Пробуждение в Ревяхоле',
        description: 'Вы просыпаетесь в грязном номере отеля "Вершина". Голова раскалывается от похмелья, а в зеркале отражается лицо детектива с путаными мыслями. На полу валяется пустая бутылка, а в кармане — значок полиции. Что-то определенно пошло не так.',
        choices: [
          {
            id: 'check_badge',
            text: 'Изучить значок полиции',
            result: 'На значке выгравировано: "Гарри Дюбуа, Ревяхольская полиция". Ваша память начинает возвращаться...',
            statModifier: { stat: 'logic', value: 2 }
          },
          {
            id: 'examine_room',
            text: 'Осмотреть номер',
            result: 'Комната выглядит как место преступления. На стене висит портрет женщины, а на столе лежит записка с адресом...',
            statModifier: { stat: 'perception', value: 2 }
          },
          {
            id: 'talk_to_mirror',
            text: 'Поговорить с отражением',
            result: 'Ваше отражение отвечает: "Ты снова все испортил, Гарри. Но у тебя есть шанс все исправить."',
            statModifier: { stat: 'inland_empire', value: 2 }
          }
        ]
      },
      {
        id: 'fallback_second',
        title: 'Встреча с Кимом',
        description: 'Дверь номера открывается, и входит ваш напарник — лейтенант Ким Кицураги. Он смотрит на вас с выражением, которое можно описать как "снова?". "Дюбуа, у нас есть дело. Труп в парке. И судя по всему, это не самоубийство."',
        choices: [
          {
            id: 'ask_details',
            text: 'Узнать детали дела',
            result: '"Жертва — бывший полицейский. Висит на дереве, но веревка не его. Кто-то его повесил." Ким протягивает фотографии.',
            statModifier: { stat: 'rhetoric', value: 2 }
          },
          {
            id: 'check_photos',
            text: 'Изучить фотографии',
            result: 'На снимках видно тело мужчины средних лет. Лицо искажено ужасом. На шее — следы от веревки, но не от петли...',
            statModifier: { stat: 'visual_calculus', value: 2 }
          },
          {
            id: 'ask_motivation',
            text: 'Спросить о мотивах',
            result: '"Возможно, это месть. Или предупреждение. В любом случае, нам нужно найти убийцу до того, как он убьет снова."',
            statModifier: { stat: 'empathy', value: 2 }
          }
        ]
      },
      {
        id: 'fallback_third',
        title: 'Начало расследования',
        description: 'Вы с Кимом едете к месту преступления. По дороге он рассказывает: "Жертва — капитан Рене Арно. Уволился из полиции год назад после скандала с коррупцией. Многие считали, что он получил по заслугам."',
        choices: [
          {
            id: 'ask_scandal',
            text: 'Узнать о скандале',
            result: '"Арно брал взятки от наркоторговцев. Но некоторые говорят, что он работал под прикрытием. Правду знает только он."',
            statModifier: { stat: 'authority', value: 2 }
          },
          {
            id: 'check_connections',
            text: 'Проверить связи',
            result: 'В вашей памяти всплывают имена: "Мартинез", "Клаасье", "Эллис". Все они были связаны с делом Арно...',
            statModifier: { stat: 'espirit_de_corps', value: 2 }
          },
          {
            id: 'prepare_mentally',
            text: 'Подготовиться морально',
            result: 'Вы готовитесь к тому, что увидите. Смерть всегда тяжела, но это ваша работа — найти правду.',
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
