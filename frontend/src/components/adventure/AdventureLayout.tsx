import { useState } from 'react';
import { ToastContainer, toast } from '../ui/SimpleToast';
import CharacterCreator from '../character/CharacterCreator';
import SettingPanel from '../setting/SettingPanel';
import type { DiscoElysiumCharacter, GameSetting } from '../../types/discoElysium';
import { generateId } from '../../types/discoElysium';

interface AdventureLayoutProps {
  children?: React.ReactNode;
}

export default function AdventureLayout({ children }: AdventureLayoutProps) {
  const [activeSection, setActiveSection] = useState<'characters' | 'events' | 'branches' | 'projects'>('characters');
  const [selectedAction, setSelectedAction] = useState<'create-character' | 'create-event' | 'event-branch' | 'open-project' | 'game-setting' | null>(null);
  const [selectedCharacterStat, setSelectedCharacterStat] = useState<{
    stat: string, 
    description: string, 
    history: string, 
    skills: string[],
    icon?: string,
    category?: string,
    categoryName?: string
  } | null>(null);
  const [characters, setCharacters] = useState<DiscoElysiumCharacter[]>([]);
  const [characterFilter, setCharacterFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'description' | 'history' | 'skills'>('description');
  const [gameSetting, setGameSetting] = useState<GameSetting>({
    genre: 'noir',
    emotionalTone: 'dark',
    abstractionLevel: 'realistic',
    narrativeStyle: 'first-person',
    uiTheme: 'dark-noir'
  });

  const handleActionClick = (action: 'create-character' | 'create-event' | 'event-branch' | 'open-project' | 'game-setting') => {
    setSelectedAction(action);
  };

  const handleClosePanel = () => {
    setSelectedAction(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Header Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">f</span>
            </div>
            <span className="text-white font-medium">Мои проекты</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🎮</span>
            </div>
            <span className="text-white font-medium">Режим игры</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">🔒</span>
          </div>
          <span className="text-white font-medium">Выйти</span>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection('characters')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === 'characters' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-xl">👤</span>
              <span className="font-medium">Персонажи</span>
              {characters.length > 0 && (
                <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                  {characters.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveSection('events')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === 'events' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-xl">👥</span>
              <span className="font-medium">События</span>
            </button>
            
            <button
              onClick={() => setActiveSection('branches')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === 'branches' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-xl">🌿</span>
              <span className="font-medium">Ветки событий</span>
            </button>
            
            <button
              onClick={() => setActiveSection('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
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
            <div className="mt-4">
              {characters.length > 0 && (
                <>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Поиск персонажей..."
                      value={characterFilter}
                      onChange={(e) => setCharacterFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Созданные персонажи:</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {characters
                      .filter(char => char.name.toLowerCase().includes(characterFilter.toLowerCase()))
                      .map((character) => (
                        <div key={character.id} className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">👤</span>
                              <span className="text-sm font-medium text-white">{character.name}</span>
                            </div>
          <button
                              onClick={() => {
                                // Clone character
                                const clonedCharacter = {
                                  ...character,
                                  id: generateId('character'),
                                  name: `${character.name} (копия)`
                                };
                                setCharacters(prev => [...prev, clonedCharacter]);
                                toast(`✅ Персонаж "${clonedCharacter.name}" создан!`, 'success');
                              }}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                              title="Клонировать персонажа"
                            >
                              📋
          </button>
        </div>
                          <div className="text-xs text-gray-400">
                            Уровень {character.level} • {Object.values(character.stats).reduce((sum, stat) => sum + stat.value, 0)} очков
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
      </div>
          )}
          
          {activeSection === 'characters' && characters.length === 0 && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">Персонажи не созданы</p>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-2">Добро пожаловать в Nexus!</h1>
              
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-gray-300 text-lg">Начните с одного из следующих действий:</p>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 gap-6 max-w-3xl">
                <button
                  onClick={() => handleActionClick('create-character')}
                  className="group bg-gradient-to-br from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 text-white p-6 rounded-xl transition-all duration-300 text-left border border-blue-500/30 hover:border-blue-400/50 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">👤</div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-300 transition-colors duration-300">Создать персонажа</h3>
                    <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">Создайте уникальных персонажей для вашей истории</p>
                  </div>
                </button>

                <button
                  onClick={() => handleActionClick('create-event')}
                  className="group bg-gradient-to-br from-green-600/20 to-teal-600/20 hover:from-green-600/30 hover:to-teal-600/30 text-white p-6 rounded-xl transition-all duration-300 text-left border border-green-500/30 hover:border-green-400/50 shadow-lg hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">🎭</div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-green-300 transition-colors duration-300">Создать событие</h3>
                    <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">Добавьте захватывающие события в вашу историю</p>
                  </div>
                </button>

                <button
                  onClick={() => handleActionClick('event-branch')}
                  className="group bg-gradient-to-br from-yellow-600/20 to-orange-600/20 hover:from-yellow-600/30 hover:to-orange-600/30 text-white p-6 rounded-xl transition-all duration-300 text-left border border-yellow-500/30 hover:border-yellow-400/50 shadow-lg hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">🌳</div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-yellow-300 transition-colors duration-300">Ветка событий</h3>
                    <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">Создайте разветвления и альтернативные пути</p>
                  </div>
                </button>

                <button
                  onClick={() => handleActionClick('open-project')}
                  className="group bg-gradient-to-br from-indigo-600/20 to-blue-600/20 hover:from-indigo-600/30 hover:to-blue-600/30 text-white p-6 rounded-xl transition-all duration-300 text-left border border-indigo-500/30 hover:border-indigo-400/50 shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">📁</div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-300 transition-colors duration-300">Открыть проект</h3>
                    <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">Откройте существующий проект для работы</p>
                  </div>
                </button>

                <button
                  onClick={() => handleActionClick('game-setting')}
                  className="group bg-gradient-to-br from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-white p-6 rounded-xl transition-all duration-300 text-left border border-purple-500/30 hover:border-purple-400/50 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">🎭</div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-300 transition-colors duration-300">Сеттинг</h3>
                    <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">Настроить тональность и стиль игры</p>
                  </div>
                </button>
              </div>

              {/* Action Content */}
              {selectedAction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-gray-800 rounded-xl border border-gray-600 shadow-2xl w-[900px] mx-auto max-h-[90vh] overflow-y-auto">
                    {selectedAction === 'create-character' ? (
                      <CharacterCreator 
                        onSave={(character) => {
                          console.log('Character saved:', character);
                          setCharacters(prev => [...prev, character]);
                          toast(`✅ Персонаж "${character.name}" создан!`, 'success');
                          handleClosePanel();
                        }}
                        onCancel={handleClosePanel}
                        compact={true}
                        onStatSelect={(stat, description, history, skills, icon, category, categoryName) => {
                          setSelectedCharacterStat({ 
                            stat, 
                            description, 
                            history, 
                            skills, 
                            icon, 
                            category, 
                            categoryName 
                          });
                        }}
                      />
                    ) : selectedAction === 'game-setting' ? (
                      <SettingPanel 
                        currentSetting={gameSetting}
                        onSettingChange={setGameSetting}
                        compact={true}
                        onClose={handleClosePanel}
                      />
                    ) : (
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-2xl font-bold text-white">
                            {selectedAction === 'create-event' && 'Создание события'}
                            {selectedAction === 'event-branch' && 'Ветка событий'}
                            {selectedAction === 'open-project' && 'Открытие проекта'}
                          </h2>
                          <button
                            onClick={handleClosePanel}
                            className="text-gray-400 hover:text-white text-xl"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className="text-gray-300">
                          {selectedAction === 'create-event' && (
                            <p>Здесь будет форма создания события с настройками триггеров, условий и последствий.</p>
                          )}
                          {selectedAction === 'event-branch' && (
                            <p>Здесь будет конструктор веток событий с возможностью создания разветвлений и альтернативных путей.</p>
                          )}
                          {selectedAction === 'open-project' && (
                            <p>Здесь будет список существующих проектов для выбора и открытия.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
              </div>
            )}
        </div>

        {/* Right Context Panel - Fixed Position */}
        {selectedCharacterStat && (
          <div className="fixed top-20 right-0 w-80 h-[calc(100vh-5rem)] bg-gradient-to-b from-gray-800 to-gray-900 border-l border-gray-700 p-6 flex flex-col z-30 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🧠</span>
                </div>
                <h3 className="text-xl font-bold text-white">Справочник</h3>
              </div>
              <button
                onClick={() => setSelectedCharacterStat(null)}
                className="w-6 h-6 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-colors text-sm"
                title="Закрыть справочник"
              >
                ×
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('description')}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition-all ${
                  activeTab === 'description' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                Описание
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition-all ${
                  activeTab === 'history' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                История
              </button>
                <button
                onClick={() => setActiveTab('skills')}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition-all ${
                  activeTab === 'skills' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                Навыки
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {selectedCharacterStat ? (
                <div className="space-y-4 min-h-full">
                  {/* Character Stat Header */}
                  <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 p-5 rounded-xl border border-blue-500/40 shadow-xl backdrop-blur-sm enhanced-text">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl drop-shadow-lg">{selectedCharacterStat.icon || '💡'}</span>
                      <h4 className="text-xl font-bold text-white drop-shadow-md">{selectedCharacterStat.stat}</h4>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 text-xs rounded-full border shadow-md ${
                        selectedCharacterStat.category === 'intellect' ? 'bg-blue-600/40 text-blue-200 border-blue-500/40' :
                        selectedCharacterStat.category === 'psyche' ? 'bg-purple-600/40 text-purple-200 border-purple-500/40' :
                        selectedCharacterStat.category === 'physique' ? 'bg-red-600/40 text-red-200 border-red-500/40' :
                        'bg-green-600/40 text-green-200 border-green-500/40'
                      }`}>
                        {selectedCharacterStat.categoryName || 'Характеристика'}
                      </span>
                      <span className="px-3 py-1 bg-gray-600/40 text-gray-200 text-xs rounded-full border border-gray-500/40 shadow-md">Уровень 1</span>
          </div>
        </div>

                  {/* Tab Content */}
                  <div className="relative">
                    {activeTab === 'description' && (
                      <div className="bg-gray-700/30 p-6 rounded-xl border border-blue-500/30 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out">
                        <h5 className="text-sm font-semibold text-blue-300 mb-4 flex items-center gap-2 enhanced-text">
                          <span className="text-lg">📖</span>
                          Описание
                        </h5>
                        <div className="w-full enhanced-description">
                          <p className="text-gray-100 text-sm enhanced-text-delayed w-full leading-relaxed">{selectedCharacterStat.description}</p>
                        </div>
                      </div>
                    )}
                  
                    {activeTab === 'history' && (
                      <div className="bg-gray-700/30 p-6 rounded-xl border border-purple-500/30 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out">
                        <h5 className="text-sm font-semibold text-purple-300 mb-4 flex items-center gap-2 enhanced-text">
                          <span className="text-lg">📜</span>
                          История персонажа
                        </h5>
                        <div className="w-full enhanced-history">
                          <p className="text-gray-100 text-sm italic enhanced-text-delayed w-full leading-relaxed">{selectedCharacterStat.history}</p>
                        </div>
                      </div>
                    )}
                  
                    {activeTab === 'skills' && (
                      <div className="bg-gray-700/30 p-6 rounded-xl border border-green-500/30 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out">
                        <h5 className="text-sm font-semibold text-green-300 mb-4 flex items-center gap-2 enhanced-text">
                          <span className="text-lg">⚡</span>
                          Навыки
                        </h5>
                        <div className="flex flex-wrap gap-3">
                          {selectedCharacterStat.skills.map((skill, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-gradient-to-r from-green-600/40 to-blue-600/40 text-green-100 px-4 py-2 rounded-full border border-green-500/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 enhanced-text-delayed"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Welcome State */}
                  <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-6 rounded-lg border border-gray-600/50 text-center">
                    <div className="text-4xl mb-3">🎯</div>
                    <h4 className="text-lg font-semibold text-white mb-2">Добро пожаловать!</h4>
                    <p className="text-gray-300 text-sm leading-relaxed break-words">
                      Выберите характеристику в создании персонажа, чтобы узнать подробную информацию о ней.
                    </p>
                  </div>

                  {/* Quick Tips */}
                  <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
                    <h5 className="text-sm font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                      <span>💡</span>
                      Подсказка
                    </h5>
                    <div className="space-y-2 text-xs text-gray-300">
                      <p>• <span className="text-blue-300">Описание</span> — основная информация о характеристике</p>
                      <p>• <span className="text-purple-300">История</span> — личная история персонажа</p>
                      <p>• <span className="text-green-300">Навыки</span> — связанные умения и способности</p>
                    </div>

                  {/* Current Game Setting */}
                  <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded-lg border border-purple-500/30">
                    <h5 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                      <span>🎭</span>
                      Текущий стиль игры
                    </h5>
                    <div className="space-y-1 text-xs text-gray-300">
                      <p><span className="text-white">Жанр:</span> {gameSetting.genre}</p>
                      <p><span className="text-white">Тон:</span> {gameSetting.emotionalTone}</p>
                      <p><span className="text-white">Стиль:</span> {gameSetting.narrativeStyle}</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Toast Container */}
        <ToastContainer />
    </div>
  );
}
