import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

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
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Создание нового проекта</h2>
              <p className="text-[#B9BBBE] text-lg">
                Выберите способ создания вашей интерактивной новеллы
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                variant="elevated" 
                className={`text-center cursor-pointer transition-all duration-200 ${
                  creationMode === 'wizard' ? 'ring-2 ring-[#5865F2] bg-[#2F3136]' : 'hover:bg-[#2F3136]'
                }`}
                onClick={() => setCreationMode('wizard')}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-[#5865F2] rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Пошаговый мастер</h3>
                  <p className="text-[#B9BBBE] text-sm">
                    5 простых шагов для создания проекта
                  </p>
                </div>
              </Card>

              <Card 
                variant="elevated" 
                className={`text-center cursor-pointer transition-all duration-200 ${
                  creationMode === 'parser' ? 'ring-2 ring-[#5865F2] bg-[#2F3136]' : 'hover:bg-[#2F3136]'
                }`}
                onClick={() => setCreationMode('parser')}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Автоматический режим</h3>
                  <p className="text-[#B9BBBE] text-sm">
                    Опишите игру - система создаст проект автоматически
                  </p>
                </div>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Название проекта</h2>
              <p className="text-[#B9BBBE]">Дайте имя вашему миру</p>
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
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Выберите жанр</h2>
              <p className="text-[#B9BBBE]">Какой стиль истории вы хотите создать?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GENRES.map((genre) => (
                <button
                  key={genre.value}
                  onClick={() => updateProjectData('genre', genre.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    projectData.genre === genre.value
                      ? 'border-[#5865F2] bg-[#5865F2]/10'
                      : 'border-[#40444B] hover:border-[#5865F2]/50'
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
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    // Показываем мини-парсер для автозаполнения
                    const description = prompt("Опишите ваш мир в нескольких предложениях:");
                    if (description) {
                      // Здесь можно вызвать API парсера для автозаполнения
                      updateProjectData('setting', description);
                    }
                  }}
                  className="text-sm"
                >
                  ✨ Автозаполнить
                </Button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Тональность</h2>
              <p className="text-[#B9BBBE]">Какое настроение будет у истории?</p>
            </div>
            
            <div className="space-y-3">
              {TONES.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => updateProjectData('tone', tone.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    projectData.tone === tone.value
                      ? 'border-[#5865F2] bg-[#5865F2]/10'
                      : 'border-[#40444B] hover:border-[#5865F2]/50'
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
      <div className="min-h-screen bg-[#36393F] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Автоматическое создание проекта</h2>
            <p className="text-[#B9BBBE] text-lg">
              Опишите вашу игру - система автоматически создаст проект
            </p>
          </div>
          
          <Card variant="elevated" padding="lg">
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Описание игры
                </label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => updateProjectData('description', e.target.value)}
                  placeholder="Например: 'Это киберпанк-игра про детектива в неоновом городе. Главный герой - бывший полицейский, который расследует серию убийств, связанных с корпорациями...'"
                  className="w-full h-32 p-4 bg-[#2F3136] border border-[#40444B] rounded-lg text-white placeholder-[#B9BBBE] focus:border-[#5865F2] focus:outline-none resize-none"
                />
              </div>
              
              <div className="text-center">
                <Button
                  variant="primary"
                  onClick={handleComplete}
                  disabled={!projectData.description.trim()}
                >
                  ✨ Создать проект
                </Button>
              </div>
            </div>
          </Card>
          
          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => setCreationMode('wizard')}
            >
              ← Пошаговый режим
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#36393F] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
        <Card variant="elevated" padding="lg">
          {renderStep()}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
          >
            Назад
          </Button>
          
          {step < 5 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Далее
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleComplete}
              disabled={!canProceed()}
            >
              Создать проект
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
