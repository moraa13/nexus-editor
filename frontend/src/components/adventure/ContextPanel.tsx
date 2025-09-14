import React from 'react';
import { toast } from '../ui/SimpleToast';

interface ContextPanelProps {
  selectedCharacterStat: {
    stat: string;
    description: string;
    history: string;
    skills: string[];
    icon?: string;
    category?: string;
    categoryName?: string;
  } | null;
  activeTab: 'description' | 'history' | 'skills';
  isGenerating: boolean;
  onTabChange: (tab: 'description' | 'history' | 'skills') => void;
  onGenerateText: () => void;
}

export default function ContextPanel({
  selectedCharacterStat,
  activeTab,
  isGenerating,
  onTabChange,
  onGenerateText
}: ContextPanelProps) {
  if (!selectedCharacterStat) {
    return (
      <div 
        className="fixed bottom-6 right-6 w-96 h-[480px] bg-gray-800 rounded-2xl border border-gray-600 shadow-2xl z-30 flex flex-col overflow-hidden"
        style={{ position: 'fixed', bottom: '24px', right: '24px' }}
      >
        <div className="p-6 text-center">
          <div className="text-4xl mb-3">💭</div>
          <h3 className="text-white font-semibold mb-2">О характеристике</h3>
          <p className="text-gray-400 text-sm">Выберите характеристику для просмотра подробной информации</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 w-96 h-[480px] bg-gray-800 rounded-2xl border border-gray-600 shadow-2xl z-30 flex flex-col overflow-hidden"
      style={{ position: 'fixed', bottom: '24px', right: '24px' }}
    >
      {/* Header */}
      <div className="bg-gray-700 px-4 py-3 flex items-center justify-between border-b border-gray-600 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm">{selectedCharacterStat.icon || '📊'}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{selectedCharacterStat.stat}</h3>
            <p className="text-gray-400 text-xs">{selectedCharacterStat.categoryName}</p>
          </div>
        </div>
        <button className="w-6 h-6 bg-gray-600 hover:bg-gray-500 text-white rounded-full flex items-center justify-center text-xs transition-colors">
          ×
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 py-2 bg-gray-800 flex-shrink-0">
        <div className="flex gap-1 bg-gray-600 p-1 rounded-lg mb-2">
          <button
            onClick={() => onTabChange('description')}
            className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
              activeTab === 'description'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-500'
            }`}
          >
            Описание
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-500'
            }`}
          >
            История
          </button>
          <button
            onClick={() => onTabChange('skills')}
            className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
              activeTab === 'skills'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-500'
            }`}
          >
            Навыки
          </button>
        </div>
        
        {/* Generate Text Button */}
        <div className="flex justify-center">
          <button
            onClick={onGenerateText}
            disabled={isGenerating}
            className={`px-3 py-1.5 text-white text-xs rounded-lg flex items-center gap-1.5 transition-all duration-200 ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
            } bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500`}
          >
            {isGenerating ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Генерация...</span>
              </>
            ) : (
              <>
                <span>✍️</span>
                <span>Сгенерировать текст</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="overflow-y-auto p-4 custom-scrollbar" style={{ height: '320px', maxHeight: '320px' }}>
        {activeTab === 'description' && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <span>📝</span>
              <span>Описание</span>
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed max-w-full overflow-hidden">
              {selectedCharacterStat.description}
            </p>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <span>📖</span>
              <span>История персонажа</span>
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed max-w-full overflow-hidden">
              {selectedCharacterStat.history}
            </p>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <span>⚡</span>
              <span>Навыки и способности</span>
            </h4>
            <div className="space-y-2">
              {selectedCharacterStat.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-lg p-3 border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer group"
                  title={`Навык: ${skill}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 text-sm">•</span>
                    <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                      {skill}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Character Bonus */}
            <div className="mt-4 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
              <h5 className="text-blue-300 font-medium text-sm mb-1">Бонус характеристики</h5>
              <p className="text-gray-300 text-xs">
                Высокий уровень этой характеристики дает дополнительные возможности в диалогах и взаимодействиях.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

