import { useState } from 'react';
import { ToastContainer, toast } from '../ui/SimpleToast';
import CharacterCreator from '../character/CharacterCreator';
import SettingPanel from '../setting/SettingPanel';
import TonePanel from '../setting/TonePanel';
import ProjectManager from '../project/ProjectManager';
import DemoQuest from '../quest/DemoQuest';
import type { DiscoElysiumCharacter, GameSetting } from '../../types/discoElysium';
import type { ProjectSettings } from '../../types/project';
import { AIService } from '../../services/aiService';
import { ProjectManager as PM } from '../../types/project';

interface AdventureLayoutProps {
  children?: React.ReactNode;
  onNavigateToLanding?: () => void;
}

export default function AdventureLayout({ children: _, onNavigateToLanding }: AdventureLayoutProps) {
  const [activeSection, setActiveSection] = useState<'characters' | 'events' | 'branches' | 'projects'>('characters');
  const [selectedAction, setSelectedAction] = useState<'create-character' | 'create-event' | 'event-branch' | 'open-project' | 'game-setting' | 'game-tone' | 'manage-projects' | null>(null);
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
  const [activeTab, setActiveTab] = useState<'description' | 'history' | 'skills'>('description');
  const [gameSetting, setGameSetting] = useState<GameSetting>({
    genre: 'noir',
    emotionalTone: 'dark',
    abstractionLevel: 'realistic',
    narrativeStyle: 'first-person',
    uiTheme: 'dark-noir'
  });
  const [gameTone, setGameTone] = useState({
    mood: 'dark-noir' as 'dark-noir' | 'satire' | 'absurd' | 'heroic' | 'psychological-drama',
    descriptionStyle: 'serious' as 'serious' | 'ironic' | 'roleplay',
    uiTheme: 'classic-dark' as 'classic-dark' | 'cyberpunk' | 'paper-diary' | 'retro'
  });
  const [currentProject, setCurrentProject] = useState<ProjectSettings | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDemoQuest, setShowDemoQuest] = useState(false);

  const handleActionClick = (action: 'create-character' | 'create-event' | 'event-branch' | 'open-project' | 'game-setting' | 'game-tone' | 'manage-projects') => {
    setSelectedAction(action);
  };

  const handleClosePanel = () => {
    setSelectedAction(null);
  };

  const handleGenerateText = async () => {
    if (!selectedCharacterStat || !currentProject) {
      toast.error('Выберите характеристику и откройте проект');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await AIService.generateStatContent({
        statName: selectedCharacterStat.stat,
        category: selectedCharacterStat.categoryName || 'Unknown',
        tone: currentProject.gameTone,
        existingContent: {
          description: selectedCharacterStat.description,
          history: selectedCharacterStat.history,
          skills: selectedCharacterStat.skills
        }
      });

      // Обновляем содержимое характеристики
      setSelectedCharacterStat({
        ...selectedCharacterStat,
        description: response.description,
        history: response.history,
        skills: response.skills
      });

      // Сохраняем в проект
      if (currentProject) {
        const updatedProject = {
          ...currentProject,
          generatedContent: {
            ...currentProject.generatedContent,
            statDescriptions: {
              ...currentProject.generatedContent.statDescriptions,
              [selectedCharacterStat.stat]: {
                description: response.description,
                history: response.history,
                skills: response.skills,
                lastGenerated: response.metadata.generatedAt
              }
            }
          }
        };
        PM.saveProject(updatedProject);
        setCurrentProject(updatedProject);
      }

      toast.success(`✨ Контент для "${selectedCharacterStat.stat}" сгенерирован!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка генерации');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Header Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="text-white font-medium">Nexus</span>
          </div>
          {currentProject ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">📁</span>
              </div>
              <span className="text-white font-medium">{currentProject.name}</span>
              <span className="text-xs text-gray-400">
                {currentProject.gameTone.mood} • {currentProject.gameTone.descriptionStyle}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">❓</span>
              </div>
              <span className="text-gray-400 font-medium">Проект не выбран</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {onNavigateToLanding && (
            <button
              onClick={onNavigateToLanding}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">←</span>
              </div>
              <span className="text-white font-medium">Назад</span>
            </button>
          )}
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
              <span className="text-xl">🎮</span>
              <span className="font-medium">Персонаж</span>
              {characters.length > 0 && (
                <span className="ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  ✓
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
              <span className="text-xl">📜</span>
              <span className="font-medium">Квесты</span>
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
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Геймплейный персонаж:</h3>
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    {characters[0] && (
                      <>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🎮</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{characters[0].name || 'Безымянный'}</h4>
                            <p className="text-gray-400 text-xs">Главный герой новеллы</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Уровень:</span>
                            <span className="text-white">{characters[0].level || 1}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Очки характеристик:</span>
                            <span className="text-white">{characters[0].stats ? Object.values(characters[0].stats).reduce((sum, stat) => sum + stat.value, 0) : 0}</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-600 space-y-2">
                          <button
                            onClick={() => handleActionClick('create-character')}
                            className="w-full text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg transition-colors"
                          >
                            ✏️ Редактировать
                          </button>
                          <button
                            onClick={() => setShowDemoQuest(true)}
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
                <div className="mt-4 text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Геймплейный персонаж не создан</p>
          <button
                    onClick={() => handleActionClick('create-character')}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
                    Создать персонажа
          </button>
                </div>
              )}
            </div>
          )}
        </div>

      {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Top Action Buttons Row */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-gray-300 text-lg">Начните с одного из следующих действий:</p>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              
              {/* Horizontal Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
              <button
                onClick={() => handleActionClick('create-character')}
                className="action-button group bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-xl transition-all duration-200 text-center border border-gray-600 hover:border-gray-500 hover:shadow-lg hover:-translate-y-1 relative min-w-[200px]"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors shadow-lg">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Геймплейный персонаж</h3>
                    <p className="text-gray-400 text-xs leading-tight">Создать главного героя новеллы</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleActionClick('create-event')}
                className="action-button group bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-xl transition-all duration-200 text-center border border-gray-600 hover:border-gray-500 hover:shadow-lg hover:-translate-y-1 relative min-w-[200px]"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Создать событие</h3>
                    <p className="text-gray-400 text-xs leading-tight">Отдельные события в игре</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleActionClick('event-branch')}
                className="action-button group bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-xl transition-all duration-200 text-center border border-gray-600 hover:border-gray-500 hover:shadow-lg hover:-translate-y-1 relative min-w-[200px]"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-yellow-600 rounded-xl flex items-center justify-center group-hover:bg-yellow-500 transition-colors shadow-lg">
                    <span className="text-2xl">📜</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Квесты</h3>
                    <p className="text-gray-400 text-xs leading-tight">Создать квестовые ветки</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleActionClick('open-project')}
                className="action-button group bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-xl transition-all duration-200 text-center border border-gray-600 hover:border-gray-500 hover:shadow-lg hover:-translate-y-1 relative min-w-[200px]"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 transition-colors shadow-lg">
                    <span className="text-2xl">📁</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Открыть проект</h3>
                    <p className="text-gray-400 text-xs leading-tight">Существующие проекты</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleActionClick('game-setting')}
                className="action-button group bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-xl transition-all duration-200 text-center border border-gray-600 hover:border-gray-500 hover:shadow-lg hover:-translate-y-1 relative min-w-[200px]"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition-colors shadow-lg">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Сеттинг</h3>
                    <p className="text-gray-400 text-xs leading-tight">Настройки игры</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleActionClick('game-tone')}
                className="action-button group bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-xl transition-all duration-200 text-center border border-gray-600 hover:border-gray-500 hover:shadow-lg hover:-translate-y-1 relative min-w-[200px]"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-200 shadow-lg">
                    <span className="text-2xl">🛠️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Тональность игры</h3>
                    <p className="text-gray-400 text-xs leading-tight">Стиль и атмосфера</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleActionClick('manage-projects')}
                className="action-button group bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-xl transition-all duration-200 text-center border border-gray-600 hover:border-gray-500 hover:shadow-lg hover:-translate-y-1 relative min-w-[200px]"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-200 shadow-lg">
                    <span className="text-2xl">📁</span>
                  </div>
            <div>
                    <h3 className="text-lg font-semibold mb-1">Управление проектами</h3>
                    <p className="text-gray-400 text-xs leading-tight">Создание и настройка</p>
                  </div>
                </div>
              </button>
              </div>
            </div>
            
            {/* Welcome Section */}
            <div className="text-center mt-16">
              <h1 className="text-5xl font-bold text-white mb-4">Добро пожаловать в Nexus!</h1>
              <p className="text-gray-400 text-lg">Инструмент для создания интерактивных новелл</p>
              <div className="mt-6 text-sm text-gray-500">
                <p>Создайте геймплейного персонажа, разработайте квесты и события</p>
              </div>
            </div>

            {/* Action Content */}
            {selectedAction && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 rounded-xl border border-gray-600 shadow-2xl w-[900px] mx-auto max-h-[90vh] overflow-y-auto">
                  {selectedAction === 'create-character' ? (
                    <CharacterCreator 
                      onSave={(character) => {
                        console.log('Character saved:', character);
                        // Заменяем существующего персонажа или добавляем нового (только один персонаж)
                        setCharacters([character]);
                        toast.success(`✅ Геймплейный персонаж "${character.name}" создан!`);
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
                  ) : selectedAction === 'game-tone' ? (
                    <TonePanel 
                      currentTone={gameTone}
                      onToneChange={(tone) => {
                        setGameTone(tone);
                        // Обновляем тональность в проекте
                        if (currentProject) {
                          const updatedProject = { ...currentProject, gameTone: tone };
                          PM.saveProject(updatedProject);
                          setCurrentProject(updatedProject);
                        }
                        toast.success('✅ Тональность игры обновлена!');
                      }}
                      compact={true}
                      onClose={handleClosePanel}
                    />
                  ) : selectedAction === 'manage-projects' ? (
                    <ProjectManager
                      currentProject={currentProject}
                      onProjectChange={(project) => {
                        setCurrentProject(project);
                        if (project) {
                          setGameTone(project.gameTone);
                          setGameSetting(project.gameSetting);
                        }
                      }}
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
        </div>
      </div>

      {/* Messenger-style Context Panel - Bottom Right */}
      {selectedCharacterStat && (
          <div className="fixed bottom-6 right-6 w-96 h-[480px] bg-gray-800 rounded-2xl border border-gray-600 shadow-2xl z-50 flex flex-col overflow-hidden context-panel-static" style={{ position: 'fixed', bottom: '24px', right: '24px', width: '384px', height: '480px' }}>
            {/* Header */}
            <div className="bg-gray-700 px-4 py-3 rounded-t-2xl border-b border-gray-600 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">{selectedCharacterStat?.icon || '🧠'}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold truncate">{selectedCharacterStat?.stat || 'Справочник'}</h3>
                  <p className="text-gray-400 text-xs">Характеристика персонажа</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCharacterStat(null)}
                className="w-8 h-8 bg-gray-600 hover:bg-gray-500 text-gray-300 hover:text-white rounded-full flex items-center justify-center transition-colors text-lg flex-shrink-0"
                title="Закрыть"
              >
                ×
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="px-4 py-2 bg-gray-800 flex-shrink-0">
              <div className="flex gap-1 bg-gray-600 p-1 rounded-lg mb-2">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 px-2 py-2 text-xs rounded-md transition-all flex items-center justify-center gap-1 ${
                    activeTab === 'description' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-500'
                  }`}
                >
                  <span>📖</span>
                  <span>Описание</span>
              </button>
              <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 px-2 py-2 text-xs rounded-md transition-all flex items-center justify-center gap-1 ${
                    activeTab === 'history' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-500'
                  }`}
                >
                  <span>📜</span>
                  <span>История</span>
              </button>
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`flex-1 px-2 py-2 text-xs rounded-md transition-all flex items-center justify-center gap-1 ${
                    activeTab === 'skills' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-500'
                  }`}
                >
                  <span>⚡</span>
                  <span>Навыки</span>
                </button>
              </div>
              
              {/* Generate Text Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleGenerateText}
                  disabled={isGenerating}
                  className={`generate-button px-3 py-1.5 text-white text-xs rounded-lg flex items-center gap-1.5 transition-all duration-200 ${
                    isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                  }`}
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

            {/* Content Area - Fixed Height */}
            <div className="overflow-y-auto p-4 custom-scrollbar context-panel-content" style={{ height: '320px', maxHeight: '320px' }}>
              {selectedCharacterStat ? (
                <div className="space-y-3">
                  {/* Category Badge */}
                  <div className="flex justify-center">
                    <span className={`px-4 py-2 text-sm rounded-full font-medium ${
                      selectedCharacterStat.category === 'intellect' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' :
                      selectedCharacterStat.category === 'psyche' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' :
                      selectedCharacterStat.category === 'physique' ? 'bg-red-600/20 text-red-300 border border-red-500/30' :
                      'bg-green-600/20 text-green-300 border border-green-500/30'
                    }`}>
                      {selectedCharacterStat.categoryName || 'Характеристика'}
                    </span>
                  </div>

                  {/* Tab Content */}
                  <div className="bg-gray-700 rounded-lg p-3 max-w-full overflow-hidden">
                    {activeTab === 'description' && (
                      <div className="w-full overflow-hidden">
                        <p className="text-gray-100 text-sm context-panel-text max-w-full">
                          {selectedCharacterStat.description}
                        </p>
                    </div>
                    )}
                  
                    {activeTab === 'history' && (
                      <div className="w-full overflow-hidden">
                        <p className="text-gray-100 text-sm italic context-panel-text max-w-full">
                          {selectedCharacterStat.history}
                        </p>
                    </div>
                    )}
                  
                    {activeTab === 'skills' && (
                      <div className="w-full overflow-hidden">
                        <div className="space-y-3">
                          <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                            <span className="text-yellow-400">⚡</span>
                            Навыки и способности
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {selectedCharacterStat.skills.map((skill, index) => (
                              <div 
                                key={index}
                                className="skill-card group relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-3 hover:from-blue-600/30 hover:to-purple-600/30 hover:border-blue-400/50 cursor-pointer"
                                title={`Нажмите для подробностей о навыке "${skill}"`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="skill-number w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {index + 1}
                                  </div>
                                  <span className="text-white text-sm font-medium group-hover:text-blue-200 transition-colors">
                                    {skill}
                                  </span>
                                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs text-blue-300">ℹ️</span>
                                  </div>
                                </div>
                                
                                {/* Hover tooltip */}
                                <div className="skill-tooltip absolute bottom-full left-0 mb-2 w-64 bg-gray-900/95 border border-gray-600 rounded-lg p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                  <div className="text-xs text-gray-300">
                                    <div className="font-semibold text-white mb-1">{skill}</div>
                                    <div className="text-gray-400">
                                      {/* Логика */}
                                      {selectedCharacterStat.stat === 'Логика' && skill === 'дедукция' && 'Позволяет делать логические выводы из имеющихся фактов и улик. Помогает связать разрозненные детали в единую картину.'}
                                      {selectedCharacterStat.stat === 'Логика' && skill === 'логический анализ' && 'Систематический анализ информации для выявления закономерностей и скрытых связей.'}
                                      {selectedCharacterStat.stat === 'Логика' && skill === 'разоблачение лжи' && 'Выявление несоответствий в рассказах и высказываниях собеседников.'}
                                      {selectedCharacterStat.stat === 'Логика' && skill === 'опровержение аргументов' && 'Построение контраргументов и выявление слабых мест в логике оппонента.'}
                                      
                                      {/* Риторика */}
                                      {selectedCharacterStat.stat === 'Риторика' && skill === 'ораторство' && 'Убедительная речь перед аудиторией и публичные выступления. Влияние на массы через красноречие.'}
                                      {selectedCharacterStat.stat === 'Риторика' && skill === 'манипуляция' && 'Влияние на эмоции и решения других людей через слова и интонации.'}
                                      {selectedCharacterStat.stat === 'Риторика' && skill === 'убеждение' && 'Способность изменять мнения и заставлять соглашаться с вашей точкой зрения.'}
                                      {selectedCharacterStat.stat === 'Риторика' && skill === 'ведение переговоров' && 'Достижение компромиссов и выгодных соглашений в сложных ситуациях.'}
                                      
                                      {/* Анализ */}
                                      {selectedCharacterStat.stat === 'Анализ' && skill === 'стратегическое мышление' && 'Планирование долгосрочных действий и предвидение последствий решений.'}
                                      {selectedCharacterStat.stat === 'Анализ' && skill === 'анализ ситуации' && 'Быстрая оценка обстановки и выявление ключевых факторов влияния.'}
                                      {selectedCharacterStat.stat === 'Анализ' && skill === 'планирование' && 'Разработка пошаговых планов достижения целей с учётом рисков.'}
                                      
                                      {/* Эмпатия */}
                                      {selectedCharacterStat.stat === 'Эмпатия' && skill === 'чтение эмоций' && 'Понимание истинных чувств собеседника по мимике, жестам и голосу.'}
                                      {selectedCharacterStat.stat === 'Эмпатия' && skill === 'настройка на собеседника' && 'Адаптация своего поведения под эмоциональное состояние других.'}
                                      {selectedCharacterStat.stat === 'Эмпатия' && skill === 'поддержка' && 'Оказание эмоциональной поддержки и создание доверительной атмосферы.'}
                                      {selectedCharacterStat.stat === 'Эмпатия' && skill === 'искренность' && 'Способность быть искренним и вызывать искренность у других.'}
                                      
                                      {/* Воля */}
                                      {selectedCharacterStat.stat === 'Воля' && skill === 'сопротивление стрессу' && 'Сохранение ясности мышления в критических и стрессовых ситуациях.'}
                                      {selectedCharacterStat.stat === 'Воля' && skill === 'моральная стойкость' && 'Умение придерживаться своих принципов под давлением обстоятельств.'}
                                      {selectedCharacterStat.stat === 'Воля' && skill === 'контроль себя в критике' && 'Способность не поддаваться на провокации и сохранять самообладание.'}
                                      
                                      {/* Интуиция */}
                                      {selectedCharacterStat.stat === 'Интуиция' && skill === 'предчувствие' && 'Внутреннее чувство, предупреждающее об опасности или важных событиях.'}
                                      {selectedCharacterStat.stat === 'Интуиция' && skill === 'шестое чувство' && 'Способность улавливать скрытые связи и подтексты ситуации.'}
                                      {selectedCharacterStat.stat === 'Интуиция' && skill === 'принятие решений без фактов' && 'Выбор правильного пути, основываясь на внутреннем чутье.'}
                                      
                                      {/* Выносливость */}
                                      {selectedCharacterStat.stat === 'Выносливость' && skill === 'физическая живучесть' && 'Способность переносить физические нагрузки и повреждения.'}
                                      {selectedCharacterStat.stat === 'Выносливость' && skill === 'сопротивление урону' && 'Уменьшение получаемого физического и психического ущерба.'}
                                      {selectedCharacterStat.stat === 'Выносливость' && skill === 'длительное напряжение' && 'Работа в условиях постоянного стресса без потери эффективности.'}
                                      
                                      {/* Мурашки */}
                                      {selectedCharacterStat.stat === 'Мурашки' && skill === 'ощущение надвигающейся опасности' && 'Физическое предчувствие угрозы через изменения в окружающей среде.'}
                                      {selectedCharacterStat.stat === 'Мурашки' && skill === 'восприятие атмосферы' && 'Чувствительность к настроению и энергетике места.'}
                                      {selectedCharacterStat.stat === 'Мурашки' && skill === 'страх' && 'Усиленное восприятие страха как защитный механизм.'}
                                      
                                      {/* Импульс */}
                                      {selectedCharacterStat.stat === 'Импульс' && skill === 'агрессия' && 'Способность к быстрым агрессивным действиям в конфликтных ситуациях.'}
                                      {selectedCharacterStat.stat === 'Импульс' && skill === 'спонтанные решения' && 'Принятие эффективных решений в условиях нехватки времени.'}
                                      {selectedCharacterStat.stat === 'Импульс' && skill === 'атака первым' && 'Инициативность в конфликтах и способность действовать первым.'}
                                      
                                      {/* Восприятие */}
                                      {selectedCharacterStat.stat === 'Восприятие' && skill === 'внимательность' && 'Способность замечать мелкие детали и изменения в окружении.'}
                                      {selectedCharacterStat.stat === 'Восприятие' && skill === 'острота чувств' && 'Усиленное зрение, слух и обоняние для получения информации.'}
                                      {selectedCharacterStat.stat === 'Восприятие' && skill === 'детализация' && 'Способность анализировать мелкие детали для получения важной информации.'}
                                      
                                      {/* Ловкость */}
                                      {selectedCharacterStat.stat === 'Ловкость' && skill === 'акробатика' && 'Способность к сложным физическим движениям и манёврам.'}
                                      {selectedCharacterStat.stat === 'Ловкость' && skill === 'уход от атак' && 'Уклонение от физических атак и опасных ситуаций.'}
                                      {selectedCharacterStat.stat === 'Ловкость' && skill === 'ловля предметов' && 'Точная координация движений для манипуляций с объектами.'}
                                      {selectedCharacterStat.stat === 'Ловкость' && skill === 'кража' && 'Скрытые манёвры и действия без обнаружения.'}
                                      
                                      {/* Самообладание */}
                                      {selectedCharacterStat.stat === 'Самообладание' && skill === 'эмоциональная маска' && 'Контроль внешнего выражения эмоций независимо от внутреннего состояния.'}
                                      {selectedCharacterStat.stat === 'Самообладание' && skill === 'подавление реакции' && 'Способность не показывать реакцию на провокации и неожиданности.'}
                                      {selectedCharacterStat.stat === 'Самообладание' && skill === 'внешняя стойкость' && 'Сохранение спокойного и уверенного внешнего вида в любых ситуациях.'}
                                      
                                      {/* Fallback для неизвестных навыков */}
                                      {!['Логика', 'Риторика', 'Анализ', 'Эмпатия', 'Воля', 'Интуиция', 'Выносливость', 'Мурашки', 'Импульс', 'Восприятие', 'Ловкость', 'Самообладание'].includes(selectedCharacterStat.stat) && 'Навык, развиваемый через данную характеристику.'}
                                    </div>
                                  </div>
                                  {/* Arrow */}
                                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Character stat bonus info */}
                          <div className="mt-4 pt-3 border-t border-gray-600">
                            <div className="text-xs text-gray-400">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-yellow-400">💡</span>
                                <span className="font-medium">Бонус характеристики:</span>
                              </div>
                              <div className="text-gray-300">
                                Высокий уровень <span className="text-blue-300 font-medium">{selectedCharacterStat.stat}</span> улучшает эффективность всех связанных навыков и открывает новые возможности в диалогах и ситуациях.
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🎯</div>
                  <h4 className="text-white font-semibold mb-2">Добро пожаловать!</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Выберите характеристику в создании персонажа, чтобы узнать подробную информацию о ней.
                  </p>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Demo Quest */}
        {showDemoQuest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <DemoQuest
              character={characters[0] || {
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
              }}
              onClose={() => setShowDemoQuest(false)}
            />
          </div>
        )}
        
        {/* Toast Container */}
        <ToastContainer />
    </div>
  );
}