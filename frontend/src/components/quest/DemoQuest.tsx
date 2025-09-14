import { useState } from 'react';
import type { DiscoElysiumCharacter } from '../../types/discoElysium';

interface DemoQuestProps {
  character: DiscoElysiumCharacter;
  onClose: () => void;
}

interface QuestStep {
  id: string;
  title: string;
  description: string;
  choices: QuestChoice[];
  requiredStat?: string;
  requiredValue?: number;
}

interface QuestChoice {
  id: string;
  text: string;
  result: string;
  statModifier?: { stat: string; value: number };
}

export default function DemoQuest({ character, onClose }: DemoQuestProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [characterState, setCharacterState] = useState(character);

  const questSteps: QuestStep[] = [
    {
      id: 'start',
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
          statModifier: { stat: 'analysis', value: 1 }
        },
        {
          id: 'shout',
          text: 'Крикнуть: "Кто здесь?!"',
          result: 'Ваш голос эхом отдается по комнате...',
          statModifier: { stat: 'rhetoric', value: 1 }
        }
      ]
    },
    {
      id: 'mystery',
      title: 'Загадочная встреча',
      description: 'Фигура поворачивается к вам. Это старик в длинном плаще. Его глаза светятся странным светом.',
      choices: [
        {
          id: 'talk',
          text: 'Заговорить с ним',
          result: 'Старик улыбается: "Наконец-то ты проснулся..."',
          statModifier: { stat: 'empathy', value: 1 }
        },
        {
          id: 'analyze',
          text: 'Попытаться понять, что происходит',
          result: 'Вы анализируете ситуацию...',
          statModifier: { stat: 'logic', value: 2 }
        },
        {
          id: 'defend',
          text: 'Принять оборонительную позицию',
          result: 'Вы готовитесь к обороне...',
          statModifier: { stat: 'impulse', value: 1 }
        }
      ]
    },
    {
      id: 'revelation',
      title: 'Откровение',
      description: 'Старик объясняет: "Ты в мире, где твои мысли становятся реальностью. Твои характеристики определяют, как ты воспринимаешь этот мир."',
      choices: [
        {
          id: 'accept',
          text: 'Принять это как данность',
          result: 'Вы понимаете, что это новый мир возможностей.',
          statModifier: { stat: 'will', value: 1 }
        },
        {
          id: 'question',
          text: 'Задать больше вопросов',
          result: 'Старик терпеливо отвечает на ваши вопросы...',
          statModifier: { stat: 'rhetoric', value: 2 }
        },
        {
          id: 'explore',
          text: 'Попытаться изучить свои способности',
          result: 'Вы начинаете экспериментировать с новыми силами...',
          statModifier: { stat: 'analysis', value: 1 }
        }
      ]
    },
    {
      id: 'choice',
      title: 'Выбор пути',
      description: 'Старик предлагает вам три пути: путь Мудрости, путь Силы или путь Равновесия. Какой вы выберете?',
      choices: [
        {
          id: 'wisdom',
          text: 'Путь Мудрости (Интеллект)',
          result: 'Вы выбираете путь знаний и понимания.',
          statModifier: { stat: 'logic', value: 2 }
        },
        {
          id: 'strength',
          text: 'Путь Силы (Физика)',
          result: 'Вы выбираете путь действия и решимости.',
          statModifier: { stat: 'endurance', value: 2 }
        },
        {
          id: 'balance',
          text: 'Путь Равновесия (Психика)',
          result: 'Вы выбираете путь гармонии и понимания.',
          statModifier: { stat: 'empathy', value: 2 }
        }
      ]
    },
    {
      id: 'end',
      title: 'Новое начало',
      description: 'Вы чувствуете, как ваши способности растут. Мир вокруг вас начинает меняться в соответствии с вашим выбором. Это только начало вашего путешествия...',
      choices: [
        {
          id: 'continue',
          text: 'Продолжить приключение',
          result: 'Вы готовы к новым вызовам!'
        }
      ]
    }
  ];

  const handleChoice = (choice: QuestChoice) => {
    // Применяем модификатор к характеристикам
    if (choice.statModifier) {
      const newStats = { ...characterState.stats };
      const statName = choice.statModifier.stat;
      if (newStats[statName]) {
        newStats[statName].value = Math.min(10, Math.max(0, newStats[statName].value + choice.statModifier.value));
      }
      setCharacterState({
        ...characterState,
        stats: newStats
      });
    }

    // Переходим к следующему шагу
    if (currentStep < questSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getStatValue = (statName: string): number => {
    return characterState.stats[statName]?.value || 0;
  };

  const canMakeChoice = (choice: QuestChoice): boolean => {
    if (!choice.statModifier) return true;
    
    const currentValue = getStatValue(choice.statModifier.stat);
    return currentValue >= (choice.statModifier.value || 0);
  };

  const currentStepData = questSteps[currentStep];
  const isLastStep = currentStep === questSteps.length - 1;

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-600 shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 rounded-t-xl border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎭</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Демо-квест</h2>
              <p className="text-purple-200 text-sm">Тестирование персонажа: {character.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center justify-center transition-colors"
            title="Закрыть"
          >
            ×
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 py-3 bg-gray-700 border-b border-gray-600">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Шаг {currentStep + 1} из {questSteps.length}</span>
          <div className="flex gap-2">
            {questSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentStep ? 'bg-purple-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-1 mt-2">
          <div
            className="bg-purple-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Character Stats */}
        <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span className="text-blue-400">📊</span>
            Характеристики персонажа
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(characterState.stats).map(([key, stat]) => (
              <div key={key} className="text-center">
                <div className="text-xs text-gray-400">{stat.name}</div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quest Step */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-3">{currentStepData.title}</h3>
          <p className="text-gray-300 leading-relaxed mb-6">{currentStepData.description}</p>

          {/* Choices */}
          <div className="space-y-3">
            {currentStepData.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                disabled={!canMakeChoice(choice)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  canMakeChoice(choice)
                    ? 'border-gray-600 bg-gray-700 hover:border-purple-500 hover:bg-purple-600/20'
                    : 'border-gray-700 bg-gray-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{choice.text}</span>
                  {choice.statModifier && (
                    <span className="text-xs text-gray-400">
                      {choice.statModifier.value > 0 ? '+' : ''}{choice.statModifier.value} {choice.statModifier.stat}
                    </span>
                  )}
                </div>
                {!canMakeChoice(choice) && (
                  <div className="text-xs text-red-400 mt-1">
                    Недостаточно характеристик
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              ← Назад
            </button>
          )}
          
          {isLastStep && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-medium transition-all duration-200 shadow-lg"
            >
              Завершить квест
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

