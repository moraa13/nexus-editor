import React from 'react';
import type { Character } from '../../types/character';

interface CharacterPanelProps {
  characters: Character[];
  activeSection: 'characters' | 'events' | 'branches' | 'projects';
  setActiveSection: (section: 'characters' | 'events' | 'branches' | 'projects') => void;
  onCharacterEdit: () => void;
  onDemoQuest: () => void;
}

export default function CharacterPanel({ 
  characters, 
  activeSection, 
  setActiveSection, 
  onCharacterEdit,
  onDemoQuest 
}: CharacterPanelProps) {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Navigation */}
      <nav className="p-4 border-b border-gray-700">
        <button
          onClick={() => setActiveSection('characters')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            activeSection === 'characters'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span className="text-xl">🎮</span>
          <span className="font-medium">Персонажи</span>
        </button>
        <button
          onClick={() => setActiveSection('events')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mt-2 ${
            activeSection === 'events'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span className="text-xl">📅</span>
          <span className="font-medium">События</span>
        </button>
        <button
          onClick={() => setActiveSection('branches')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mt-2 ${
            activeSection === 'branches'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span className="text-xl">🌳</span>
          <span className="font-medium">Ветки событий</span>
        </button>
        <button
          onClick={() => setActiveSection('projects')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mt-2 ${
            activeSection === 'projects'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span className="text-xl">📋</span>
          <span className="font-medium">Проекты</span>
        </button>
      </nav>
      
      {/* Characters List */}
      {activeSection === 'characters' && (
        <div className="mt-4 px-4">
          {characters.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Геймплейный персонаж:</h3>
              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                {characters[0] && (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🎮</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{characters[0].name}</h4>
                        <p className="text-gray-400 text-xs">Главный герой новеллы</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Уровень:</span>
                        <span className="text-white">1</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Очки характеристик:</span>
                        <span className="text-white">
                          {characters[0].intellect_total + characters[0].psyche_total + 
                           characters[0].physique_total + characters[0].motorics_total}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-600 space-y-2">
                      <button
                        onClick={onCharacterEdit}
                        className="w-full text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg transition-colors"
                      >
                        ✏️ Редактировать
                      </button>
                      <button
                        onClick={onDemoQuest}
                        className="w-full text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-3 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        🎭 Демо-квест
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {characters.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎮</div>
              <p className="text-gray-400 text-sm mb-3">Персонаж не создан</p>
              <button
                onClick={onCharacterEdit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
              >
                Создать персонажа
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

