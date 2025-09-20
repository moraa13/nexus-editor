import React, { useState } from 'react';
import Input from './ui/Input';

interface StartupWizardProps {
  onComplete: (projectData: ProjectData) => void;
}

interface ProjectData {
  name: string;
  genre: string;
  setting: string;
  tone: string;
  description: string;
}

const GENRES = [
  { value: 'noir', label: 'Нуар', description: 'Темные улицы, моральные дилеммы' },
  { value: 'cyberpunk', label: 'Киберпанк', description: 'Технологии и корпорации' },
  { value: 'fantasy', label: 'Фэнтези', description: 'Магия и приключения' },
  { value: 'sci-fi', label: 'Научная фантастика', description: 'Космос и технологии' },
  { value: 'horror', label: 'Хоррор', description: 'Ужас и напряжение' },
  { value: 'drama', label: 'Драма', description: 'Эмоциональные истории' }
];

const TONES = [
  { value: 'dark-noir', label: 'Темный нуар', description: 'Мрачный, ироничный' },
  { value: 'philosophical', label: 'Философский', description: 'Глубокий, размышляющий' },
  { value: 'satirical', label: 'Сатирический', description: 'Остроумный, критичный' },
  { value: 'melancholic', label: 'Меланхоличный', description: 'Грустный, ностальгический' },
  { value: 'energetic', label: 'Энергичный', description: 'Динамичный, активный' }
];

export default function StartupWizard({ onComplete }: StartupWizardProps) {
  const [step, setStep] = useState(1);
  const [creationMode, setCreationMode] = useState<'wizard' | 'parser'>('wizard');
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    genre: '',
    setting: '',
    tone: '',
    description: ''
  });

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    onComplete(projectData);
  };

  const updateProjectData = (field: keyof ProjectData, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };


  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-3">Создание нового проекта</h2>
              <p className="text-[#B9BBBE] text-sm">
                Выберите способ создания вашей интерактивной новеллы
              </p>
            </div>
            
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div 
                    className={`text-center cursor-pointer transition-all duration-300 p-5 rounded-xl border-2 transform hover:scale-105 ${
                      creationMode === 'wizard' 
                        ? 'border-[#5865F2] bg-gradient-to-br from-[#5865F2]/20 to-blue-600/20 shadow-lg shadow-[#5865F2]/25' 
                        : 'border-gray-600 bg-gray-800/50 hover:border-[#5865F2] hover:bg-gradient-to-br hover:from-[#5865F2]/10 hover:to-blue-600/10 hover:shadow-lg hover:shadow-[#5865F2]/15'
                    }`}
                    onClick={() => setCreationMode('wizard')}
                  >
                    <div className="space-y-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                        creationMode === 'wizard' 
                          ? 'bg-gradient-to-br from-[#5865F2] to-blue-600 shadow-lg' 
                          : 'bg-[#5865F2]'
                      }`}>
                        <span className="text-xl">⚡</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">Пошаговый мастер</h3>
                      <p className="text-[#B9BBBE] text-sm leading-relaxed">
                        5 простых шагов для создания проекта
                      </p>
                      {creationMode === 'wizard' && (
                        <div className="flex items-center justify-center gap-1 text-[#5865F2] text-sm font-medium">
                          <span>✓</span>
                          <span>Выбрано</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div 
                    className={`text-center cursor-pointer transition-all duration-300 p-5 rounded-xl border-2 transform hover:scale-105 ${
                      creationMode === 'parser' 
                        ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/25' 
                        : 'border-gray-600 bg-gray-800/50 hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-pink-500/10 hover:shadow-lg hover:shadow-purple-500/15'
                    }`}
                    onClick={() => setCreationMode('parser')}
                  >
                    <div className="space-y-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                        creationMode === 'parser' 
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg' 
                          : 'bg-gradient-to-br from-purple-500 to-pink-500'
                      }`}>
                        <span className="text-xl">🤖</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">Автоматический режим</h3>
                      <p className="text-[#B9BBBE] text-sm leading-relaxed">
                        Опишите игру - система создаст проект автоматически
                      </p>
                      {creationMode === 'parser' && (
                        <div className="flex items-center justify-center gap-1 text-purple-400 text-sm font-medium">
                          <span>✓</span>
                          <span>Выбрано</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Название проекта</h2>
              <p className="text-[#B9BBBE] text-sm">Дайте имя вашему миру</p>
            </div>
            
            <Input
              label="Название проекта"
              value={projectData.name}
              onChange={(e) => updateProjectData('name', e.target.value)}
              placeholder="Например: 'Тени Реваколи' или 'Кибер-Детектив 2077'"
              className="text-lg"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Выберите жанр</h2>
              <p className="text-[#B9BBBE] text-sm">Какой стиль истории вы хотите создать?</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {GENRES.map((genre) => (
                <button
                  key={genre.value}
                  onClick={() => updateProjectData('genre', genre.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    projectData.genre === genre.value
                      ? 'border-[#5865F2] bg-[#5865F2]/20'
                      : 'border-gray-600 bg-gray-800/50 hover:border-[#5865F2] hover:bg-[#5865F2]/10'
                  }`}
                >
                  <h3 className="font-semibold text-white mb-1">{genre.label}</h3>
                  <p className="text-sm text-[#B9BBBE]">{genre.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Сеттинг</h2>
              <p className="text-[#B9BBBE]">Где происходит действие?</p>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Описание мира"
                value={projectData.setting}
                onChange={(e) => updateProjectData('setting', e.target.value)}
                placeholder="Например: 'Неоновые улицы будущего' или 'Средневековый город'"
                className="text-lg"
              />
              
              <div className="text-center">
                <button 
                  onClick={() => {
                    // Показываем мини-парсер для автозаполнения
                    const description = prompt("Опишите ваш мир в нескольких предложениях:");
                    if (description) {
                      // Здесь можно вызвать API парсера для автозаполнения
                      updateProjectData('setting', description);
                    }
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                >
                  ✨ Автозаполнить
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Тональность</h2>
              <p className="text-[#B9BBBE] text-sm">Какое настроение будет у истории?</p>
            </div>
            
            <div className="space-y-3">
              {TONES.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => updateProjectData('tone', tone.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    projectData.tone === tone.value
                      ? 'border-[#5865F2] bg-[#5865F2]/20'
                      : 'border-gray-600 bg-gray-800/50 hover:border-[#5865F2] hover:bg-[#5865F2]/10'
                  }`}
                >
                  <h3 className="font-semibold text-white mb-1">{tone.label}</h3>
                  <p className="text-sm text-[#B9BBBE]">{tone.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return creationMode !== null;
      case 2: return projectData.name.trim().length > 0;
      case 3: return projectData.genre.length > 0;
      case 4: return projectData.setting.trim().length > 0;
      case 5: return projectData.tone.length > 0;
      default: return true;
    }
  };

  // Если выбран режим парсера, показываем простую форму
  if (creationMode === 'parser') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-3">Автоматическое создание проекта</h2>
            <p className="text-[#B9BBBE]">
              Опишите вашу игру - система автоматически создаст проект
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Описание игры
                </label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => updateProjectData('description', e.target.value)}
                  placeholder="Например: 'Это киберпанк-игра про детектива в неоновом городе. Главный герой - бывший полицейский, который расследует серию убийств, связанных с корпорациями...'"
                  className="w-full h-32 p-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#5865F2] focus:outline-none resize-none"
                />
              </div>
              
              <div className="text-center">
                <button
                  onClick={handleComplete}
                  disabled={!projectData.description.trim()}
                  className="bg-gradient-to-r from-[#5865F2] to-purple-600 hover:from-[#4752C4] hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                >
                  ✨ Создать проект
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <button
              onClick={() => setCreationMode('wizard')}
              className="text-[#B9BBBE] hover:text-white transition-colors duration-200"
            >
              ← Пошаговый режим
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-[#B9BBBE] mb-2">
            <span>Шаг {step} из 5</span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-[#40444B] rounded-full h-2">
            <div 
              className="bg-[#5865F2] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl p-4">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="text-[#B9BBBE] hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            ← Назад
          </button>
          
          {step < 5 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-[#5865F2] to-purple-600 hover:from-[#4752C4] hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
            >
              Далее →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
            >
              ✨ Создать проект
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
