import { useState } from 'react';

interface TonePanelProps {
  currentTone: {
    mood: 'dark-noir' | 'satire' | 'absurd' | 'heroic' | 'psychological-drama';
    descriptionStyle: 'serious' | 'ironic' | 'roleplay';
    uiTheme: 'classic-dark' | 'cyberpunk' | 'paper-diary' | 'retro';
  };
  onToneChange: (tone: any) => void;
  compact?: boolean;
  onClose?: () => void;
}

export default function TonePanel({ currentTone, onToneChange, compact = false, onClose }: TonePanelProps) {
  const [tone, setTone] = useState(currentTone);

  const handleSave = () => {
    onToneChange(tone);
    if (onClose) onClose();
  };

  const moodOptions = [
    { id: 'dark-noir', name: 'Мрачная и нуарная', icon: '🌃', description: 'Тёмная атмосфера, детективные элементы' },
    { id: 'satire', name: 'Сатира', icon: '😏', description: 'Ироничный взгляд на мир' },
    { id: 'absurd', name: 'Абсурд', icon: '🤪', description: 'Безумные и неожиданные повороты' },
    { id: 'heroic', name: 'Героика', icon: '⚔️', description: 'Эпические приключения и подвиги' },
    { id: 'psychological-drama', name: 'Психологическая драма', icon: '🧠', description: 'Глубокое погружение в психику' }
  ];

  const descriptionStyles = [
    { id: 'serious', name: 'Серьёзный', icon: '🎭', description: 'Официальный, документальный стиль' },
    { id: 'ironic', name: 'Ироничный', icon: '😏', description: 'С долей юмора и сарказма' },
    { id: 'roleplay', name: 'Ролевой (3-е лицо)', icon: '📖', description: 'Как в книге, от третьего лица' }
  ];

  const uiThemes = [
    { id: 'classic-dark', name: 'Классическая тьма', icon: '🌙', description: 'Тёмная тема с синими акцентами' },
    { id: 'cyberpunk', name: 'Киберпанк', icon: '🔮', description: 'Неоновые цвета, футуристика' },
    { id: 'paper-diary', name: 'Бумажный дневник', icon: '📜', description: 'Стиль старинной бумаги' },
    { id: 'retro', name: 'Ретро', icon: '📺', description: 'Ностальгические 80-90е' }
  ];

  const handleMoodChange = (moodId: string) => {
    setTone(prev => ({ ...prev, mood: moodId as any }));
  };

  const handleDescriptionStyleChange = (styleId: string) => {
    setTone(prev => ({ ...prev, descriptionStyle: styleId as any }));
  };

  const handleUIThemeChange = (themeId: string) => {
    setTone(prev => ({ ...prev, uiTheme: themeId as any }));
  };

  if (compact) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-600 shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 rounded-t-xl border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛠️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Тональность игры</h2>
                <p className="text-purple-200 text-sm">Настройте стиль и атмосферу вашей новеллы</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center justify-center transition-colors"
                title="Закрыть"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Общее настроение */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-purple-400">🎭</span>
              Общее настроение
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {moodOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleMoodChange(option.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                    tone.mood === option.id
                      ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-medium text-white">{option.name}</span>
                  </div>
                  <p className="text-sm text-gray-400">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Стиль описаний */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">✍️</span>
              Стиль описаний характеристик
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {descriptionStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleDescriptionStyleChange(style.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                    tone.descriptionStyle === style.id
                      ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/25'
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{style.icon}</span>
                    <span className="font-medium text-white">{style.name}</span>
                  </div>
                  <p className="text-sm text-gray-400">{style.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Стиль интерфейса */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">🎨</span>
              Стиль интерфейса (темы)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {uiThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleUIThemeChange(theme.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                    tone.uiTheme === theme.id
                      ? 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/25'
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{theme.icon}</span>
                    <span className="font-medium text-white">{theme.name}</span>
                  </div>
                  <p className="text-sm text-gray-400">{theme.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span className="text-yellow-400">👁️</span>
              Предварительный просмотр
            </h4>
            <div className="text-sm text-gray-300 space-y-2">
              <p><span className="text-gray-400">Настроение:</span> {moodOptions.find(m => m.id === tone.mood)?.name}</p>
              <p><span className="text-gray-400">Стиль описаний:</span> {descriptionStyles.find(s => s.id === tone.descriptionStyle)?.name}</p>
              <p><span className="text-gray-400">Тема интерфейса:</span> {uiThemes.find(t => t.id === tone.uiTheme)?.name}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-700 px-6 py-4 rounded-b-xl border-t border-gray-600 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Сохранить тональность
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Компактная версия для интеграции */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Настроение</h3>
          <div className="space-y-2">
            {moodOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleMoodChange(option.id)}
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                  tone.mood === option.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <span className="text-white">{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Стиль описаний</h3>
          <div className="space-y-2">
            {descriptionStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleDescriptionStyleChange(style.id)}
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                  tone.descriptionStyle === style.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <span className="text-white">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Тема интерфейса</h3>
          <div className="space-y-2">
            {uiThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleUIThemeChange(theme.id)}
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                  tone.uiTheme === theme.id
                    ? 'border-green-500 bg-green-500/20'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <span className="text-white">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
