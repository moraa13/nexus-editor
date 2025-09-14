import { useState, useEffect } from 'react';
import type { DiscoElysiumCharacter } from '../../types/discoElysium';
import { questApiService, type QuestStep as AIStep, type QuestContext } from '../../services/questApi';

interface DemoQuestProps {
  character?: DiscoElysiumCharacter | null;
  onClose: () => void;
}

interface QuestChoice {
  id: string;
  text: string;
  result: string;
  statModifier?: { stat: string; value: number };
}

export default function DemoQuest({ character, onClose }: DemoQuestProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questSteps, setQuestSteps] = useState<AIStep[]>([]);
  const [characterState, setCharacterState] = useState(character || {
    name: 'Демо Персонаж',
    level: 1,
    stats: {
      intellect: { name: 'Интеллект', value: 4 },
      psyche: { name: 'Психика', value: 4 },
      physique: { name: 'Физика', value: 4 },
      motorics: { name: 'Моторика', value: 4 }
    },
    skills: {
      logic: { name: 'Логика', value: 2 },
      encyclopedia: { name: 'Энциклопедия', value: 2 },
      rhetoric: { name: 'Риторика', value: 2 },
      drama: { name: 'Драма', value: 2 },
      conceptualization: { name: 'Концептуализация', value: 2 },
      visual_calculus: { name: 'Визуальное исчисление', value: 2 },
      volition: { name: 'Воля', value: 2 },
      inland_empire: { name: 'Внутренняя империя', value: 2 },
      empathy: { name: 'Эмпатия', value: 2 },
      authority: { name: 'Авторитет', value: 2 },
      suggestion: { name: 'Внушение', value: 2 },
      espirit_de_corps: { name: 'Дух корпуса', value: 2 },
      endurance: { name: 'Выносливость', value: 2 },
      pain_threshold: { name: 'Порог боли', value: 2 },
      physical_instrument: { name: 'Физический инструмент', value: 2 },
      electrochemistry: { name: 'Электрохимия', value: 2 },
      shivers: { name: 'Дрожь', value: 2 },
      half_light: { name: 'Полусвет', value: 2 },
      hand_eye_coordination: { name: 'Координация рук и глаз', value: 2 },
      perception: { name: 'Восприятие', value: 2 },
      reaction_speed: { name: 'Скорость реакции', value: 2 },
      savoir_faire: { name: 'Самообладание', value: 2 },
      interfacing: { name: 'Интерфейс', value: 2 },
      composure: { name: 'Спокойствие', value: 2 }
    }
  });

  // Генерируем квест при загрузке компонента
  useEffect(() => {
    generateQuest();
  }, []);

  const generateQuest = async () => {
    setIsGenerating(true);
    try {
      const context: QuestContext = {
        character: characterState,
        currentStep: 0,
        previousChoices: [],
        questTheme: 'Детективное расследование в стиле Disco Elysium',
        difficulty: 'medium'
      };

      // Генерируем 2 шага для демо
      const steps = await questApiService.generateFullQuest(context, 2);
      setQuestSteps(steps);
    } catch (error) {
      console.error('Failed to generate quest:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChoice = (choice: QuestChoice) => {
    // Применяем модификатор к характеристикам
    if (choice.statModifier && characterState.stats) {
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
    return characterState.stats?.[statName]?.value || 0;
  };

  const canMakeChoice = (choice: QuestChoice): boolean => {
    if (!choice.statModifier) return true;
    
    const currentValue = getStatValue(choice.statModifier.stat);
    return currentValue >= (choice.statModifier.value || 0);
  };

  const currentStepData = questSteps[currentStep];
  const isLastStep = currentStep === questSteps.length - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-600 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 rounded-t-xl border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎭</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Демо-квест</h2>
                <p className="text-purple-200 text-sm">Тестирование персонажа: {characterState.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={generateQuest}
                disabled={isGenerating}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium"
              >
                {isGenerating ? '🔄 Генерация...' : '🎲 Перегенерировать'}
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isGenerating ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-white mb-2">Генерируем квест...</h3>
                <p className="text-gray-400">AI создает уникальную историю для вашего персонажа</p>
              </div>
            </div>
          ) : questSteps.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold text-white mb-2">Квест не загружен</h3>
              <p className="text-gray-400 mb-4">Нажмите кнопку генерации для создания квеста</p>
              <button
                onClick={generateQuest}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
              >
                Сгенерировать квест
              </button>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Прогресс квеста</span>
                  <span className="text-sm text-gray-400">{currentStep + 1} / {questSteps.length}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / questSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Quest Content */}
              {currentStepData && (
                <>
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
                </>
              )}

              {/* Character Stats */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="text-blue-400">📊</span>
                  Характеристики персонажа
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(characterState.stats || {}).map(([key, stat]) => (
                    <div key={key} className="text-center">
                      <div className="text-xs text-gray-400">{stat.name}</div>
                      <div className="text-lg font-bold text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quest Complete */}
              {isLastStep && currentStepData && (
                <div className="mt-6 p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400">🎉</span>
                    <span className="text-green-400 font-semibold">Квест завершен!</span>
                  </div>
                  <p className="text-green-300 text-sm">
                    Это была демонстрация AI-генерации квестов. В полной версии квесты будут генерироваться динамически на основе ваших выборов.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};