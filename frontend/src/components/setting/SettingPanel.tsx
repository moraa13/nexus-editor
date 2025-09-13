import { useState } from 'react';
import { TONE_TEMPLATES, type GameSetting, type ToneTemplate } from '../../types/discoElysium';
import { toast } from '../ui/SimpleToast';

interface SettingPanelProps {
  currentSetting?: GameSetting;
  onSettingChange?: (setting: GameSetting) => void;
  compact?: boolean;
  onClose?: () => void;
}

export default function SettingPanel({ currentSetting, onSettingChange, compact = false, onClose }: SettingPanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('noir');
  const [customSetting, setCustomSetting] = useState<GameSetting>(currentSetting || {
    genre: 'noir',
    emotionalTone: 'dark',
    abstractionLevel: 'realistic',
    narrativeStyle: 'first-person',
    uiTheme: 'dark-noir'
  });
  
  // AI Tone Assistant states
  const [aiKeywords, setAiKeywords] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = TONE_TEMPLATES[templateId];
    
    const newSetting: GameSetting = {
      genre: templateId as any,
      emotionalTone: templateId === 'noir' ? 'dark' : templateId === 'fantasy' ? 'inspiring' : 'ironic',
      abstractionLevel: templateId === 'cyberpunk' ? 'metaphysical' : 'realistic',
      narrativeStyle: 'first-person',
      uiTheme: template.uiTheme as any
    };
    
    setCustomSetting(newSetting);
    onSettingChange?.(newSetting);
  };

  const handleCustomChange = (field: keyof GameSetting, value: string) => {
    const newSetting = { ...customSetting, [field]: value };
    setCustomSetting(newSetting);
    onSettingChange?.(newSetting);
  };

  // AI Tone Generation
  const generateToneFromKeywords = async () => {
    if (!aiKeywords.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation with predefined responses based on keywords
    const keywordLower = aiKeywords.toLowerCase();
    
    // Simple keyword-based tone generation
    let suggestedGenre = 'noir';
    let suggestedTone = 'dark';
    let suggestedAbstraction = 'realistic';
    let generatedDescription = '';
    
    if (keywordLower.includes('кибер') || keywordLower.includes('робот') || keywordLower.includes('неон')) {
      suggestedGenre = 'cyberpunk';
      suggestedTone = 'ironic';
      suggestedAbstraction = 'metaphysical';
      generatedDescription = 'Неоновый мир киборгов и хакеров. Реальность смешалась с виртуальностью, а люди стали машинами.';
    } else if (keywordLower.includes('магия') || keywordLower.includes('дракон') || keywordLower.includes('эльф')) {
      suggestedGenre = 'fantasy';
      suggestedTone = 'inspiring';
      suggestedAbstraction = 'metaphysical';
      generatedDescription = 'Магический мир, где древние силы пробуждаются, а герои вступают в эпические битвы добра и зла.';
    } else if (keywordLower.includes('дождь') || keywordLower.includes('город') || keywordLower.includes('одиночество')) {
      suggestedGenre = 'noir';
      suggestedTone = 'melancholic';
      suggestedAbstraction = 'realistic';
      generatedDescription = 'Мрачный город под дождём, где каждый переулок хранит свои секреты, а одиночество — постоянный спутник.';
    } else if (keywordLower.includes('космос') || keywordLower.includes('звезда') || keywordLower.includes('галактика')) {
      suggestedGenre = 'post-apocalyptic';
      suggestedTone = 'hopeful';
      suggestedAbstraction = 'dreamlike';
      generatedDescription = 'Бесконечный космос, где человечество ищет новый дом среди звёзд, а надежда — единственный спутник.';
    } else {
      generatedDescription = 'Уникальный мир, созданный из ваших слов. Каждое описание будет адаптировано под выбранную тональность.';
    }
    
    // Update settings based on AI suggestion
    const aiSuggestedSetting: GameSetting = {
      genre: suggestedGenre as any,
      emotionalTone: suggestedTone as any,
      abstractionLevel: suggestedAbstraction as any,
      narrativeStyle: 'first-person',
      uiTheme: suggestedGenre === 'cyberpunk' ? 'neon-cyber' : 
                suggestedGenre === 'fantasy' ? 'bright-fantasy' : 'dark-noir'
    };
    
    setCustomSetting(aiSuggestedSetting);
    setSelectedTemplate(suggestedGenre);
    setGeneratedContent(generatedDescription);
    
    // Simulate delay
    setTimeout(() => {
      setIsGenerating(false);
      onSettingChange?.(aiSuggestedSetting);
    }, 1500);
  };

  const templateOptions = [
    { id: 'noir', ...TONE_TEMPLATES.noir },
    { id: 'fantasy', ...TONE_TEMPLATES.fantasy },
    { id: 'cyberpunk', ...TONE_TEMPLATES.cyberpunk }
  ];

  const genreOptions = [
    { value: 'noir', label: 'Нуар', icon: '🌧️' },
    { value: 'fantasy', label: 'Фэнтези', icon: '🧙‍♂️' },
    { value: 'cyberpunk', label: 'Киберпанк', icon: '🤖' },
    { value: 'magical-realism', label: 'Магический реализм', icon: '✨' },
    { value: 'post-apocalyptic', label: 'Постапокалипсис', icon: '💀' },
    { value: 'detective', label: 'Детектив', icon: '🔍' },
    { value: 'horror', label: 'Хоррор', icon: '👻' },
    { value: 'comedy', label: 'Комедия', icon: '😄' }
  ];

  const emotionalToneOptions = [
    { value: 'dark', label: 'Мрачно', icon: '🌑' },
    { value: 'ironic', label: 'Иронично', icon: '😏' },
    { value: 'romantic', label: 'Романтично', icon: '💕' },
    { value: 'absurd', label: 'Абсурдно', icon: '🤪' },
    { value: 'inspiring', label: 'Вдохновляюще', icon: '🌟' },
    { value: 'melancholic', label: 'Меланхолично', icon: '😔' },
    { value: 'hopeful', label: 'Надеждно', icon: '🌈' },
    { value: 'chaotic', label: 'Хаотично', icon: '🌀' }
  ];

  const abstractionOptions = [
    { value: 'realistic', label: 'Приземлённый реализм' },
    { value: 'metaphysical', label: 'Метафизика' },
    { value: 'dreamlike', label: 'Сны' },
    { value: 'hallucinatory', label: 'Галлюцинации' }
  ];

  const narrativeOptions = [
    { value: 'third-person', label: 'От третьего лица' },
    { value: 'first-person', label: 'От лица героя' },
    { value: 'stream-of-consciousness', label: 'Поток сознания' },
    { value: 'epistolary', label: 'Эпистолярный' }
  ];

  if (compact) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">🎭 Сеттинг и тональность</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ←
          </button>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-300 text-sm">
            Настройте тон вашей истории. Выбранные параметры влияют на тексты характеристик и подсказок в игре.
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* ЖАНР */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">ЖАНР</h3>
            <div className="space-y-3">
              {[
                { value: 'noir', label: 'Нуар', icon: '🌧️' },
                { value: 'fantasy', label: 'Фэнтези', icon: '🧙‍♂️' },
                { value: 'cyberpunk', label: 'Киберпанк', icon: '🤖' },
                { value: 'post-apocalyptic', label: 'Постапок', icon: '💀' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="genre"
                    value={option.value}
                    checked={customSetting.genre === option.value}
                    onChange={(e) => handleCustomChange('genre', e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-xl">{option.icon}</span>
                  <span className="text-white font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ЭМОЦИОНАЛЬНЫЙ ТОН */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">ЭМОЦИОНАЛЬНЫЙ ТОН</h3>
            <div className="space-y-3">
              {[
                { value: 'dark', label: 'Мрачно', icon: '🌑' },
                { value: 'ironic', label: 'Иронично', icon: '😏' },
                { value: 'romantic', label: 'Романтично', icon: '💕' },
                { value: 'absurd', label: 'Абсурдно', icon: '🤪' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="emotionalTone"
                    value={option.value}
                    checked={customSetting.emotionalTone === option.value}
                    onChange={(e) => handleCustomChange('emotionalTone', e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-xl">{option.icon}</span>
                  <span className="text-white font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* НАРРАТИВНЫЙ СТИЛЬ */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">НАРРАТИВНЫЙ СТИЛЬ</h3>
            <div className="space-y-3">
              {[
                { value: 'third-person', label: 'От третьего лица' },
                { value: 'stream-of-consciousness', label: 'Поток сознания' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="narrativeStyle"
                    value={option.value}
                    checked={customSetting.narrativeStyle === option.value}
                    onChange={(e) => handleCustomChange('narrativeStyle', e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-white font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* НАСТРОЙКА */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">НАСТРОЙКА</h3>
            <div className="text-gray-300">
              <p className="text-sm">Рекомендуется</p>
            </div>
          </div>
        </div>

        {/* AI Tone Assistant */}
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">🤖 AI Помощник</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Введите ключевые слова: дождь, город, одиночество"
              value={aiKeywords}
              onChange={(e) => setAiKeywords(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={generateToneFromKeywords}
              disabled={isGenerating || !aiKeywords.trim()}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isGenerating || !aiKeywords.trim()
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isGenerating ? '⏳' : '🎨'}
            </button>
          </div>
          {generatedContent && (
            <div className="p-3 bg-gray-600 rounded border-l-4 border-blue-500">
              <p className="text-sm text-gray-200 italic">{generatedContent}</p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              onSettingChange?.(customSetting);
              toast('✅ Настройки сохранены!', 'success');
            }}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            СОХРАНИТЬ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🎭 Сеттинг и тональность игры</h1>
        
        {/* AI Tone Assistant */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🤖 AI Tone Assistant</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
            <p className="text-gray-300 mb-4">
              Опишите атмосферу вашей игры 2-3 ключевыми словами, и AI автоматически настроит стиль:
            </p>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="например: киберпанк, неон, хакер"
                value={aiKeywords}
                onChange={(e) => setAiKeywords(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={generateToneFromKeywords}
                disabled={isGenerating || !aiKeywords.trim()}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isGenerating || !aiKeywords.trim()
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isGenerating ? '⏳ Генерирую...' : '🎨 Создать стиль'}
              </button>
            </div>
            {generatedContent && (
              <div className="p-4 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                <h4 className="text-sm font-medium text-blue-300 mb-2">AI предлагает:</h4>
                <p className="text-gray-200 italic">{generatedContent}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Template Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Быстрый выбор шаблона</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templateOptions.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-900/30'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{template.icon}</span>
                  <h3 className="text-lg font-medium">{template.name}</h3>
                </div>
                <p className="text-sm text-gray-300">{template.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Настройки</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  🎭 Жанр
                </label>
                <select
                  value={customSetting.genre}
                  onChange={(e) => handleCustomChange('genre', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {genreOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  🌈 Эмоциональный тон
                </label>
                <select
                  value={customSetting.emotionalTone}
                  onChange={(e) => handleCustomChange('emotionalTone', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {emotionalToneOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Дополнительно</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  🧠 Уровень абстракции
                </label>
                <select
                  value={customSetting.abstractionLevel}
                  onChange={(e) => handleCustomChange('abstractionLevel', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {abstractionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  📚 Нарративный стиль
                </label>
                <select
                  value={customSetting.narrativeStyle}
                  onChange={(e) => handleCustomChange('narrativeStyle', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {narrativeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-8 p-6 bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Предпросмотр настроек</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Жанр:</p>
              <p className="font-medium">{genreOptions.find(g => g.value === customSetting.genre)?.label}</p>
            </div>
            <div>
              <p className="text-gray-400">Тон:</p>
              <p className="font-medium">{emotionalToneOptions.find(t => t.value === customSetting.emotionalTone)?.label}</p>
            </div>
            <div>
              <p className="text-gray-400">Абстракция:</p>
              <p className="font-medium">{abstractionOptions.find(a => a.value === customSetting.abstractionLevel)?.label}</p>
            </div>
            <div>
              <p className="text-gray-400">Стиль:</p>
              <p className="font-medium">{narrativeOptions.find(n => n.value === customSetting.narrativeStyle)?.label}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
