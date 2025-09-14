import React, { useEffect, useState } from 'react';
import { useAdventureStore, useCurrentProject, useCharacters, useEvents, useQuests } from '../../stores/adventureStore';
import EventEditorPanel from '../editor/EventEditorPanel';
import QuestEditorPanel from '../editor/QuestEditorPanel';

interface AdventureLayoutRefactoredProps {
  children?: React.ReactNode;
  onNavigateToLanding?: () => void;
}

type EditorMode = 'overview' | 'characters' | 'events' | 'quests';

const AdventureLayoutRefactored: React.FC<AdventureLayoutRefactoredProps> = ({ 
  children, 
  onNavigateToLanding 
}) => {
  const currentProject = useCurrentProject();
  const characters = useCharacters();
  const events = useEvents();
  const quests = useQuests();
  const { setCurrentProject } = useAdventureStore();
  
  const [editorMode, setEditorMode] = useState<EditorMode>('overview');
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>();
  const [selectedQuestId, setSelectedQuestId] = useState<string | undefined>();

  // Load initial data
  useEffect(() => {
    // TODO: Load project and characters from API
    // For now, set some mock data
    if (!currentProject) {
      setCurrentProject({
        id: '1',
        name: 'Demo Project',
        description: 'A demo project for testing',
        gameTone: {
          mood: 'dark',
          descriptionStyle: 'detailed'
        }
      });
    }
  }, [currentProject, setCurrentProject]);

  const renderEditor = () => {
    switch (editorMode) {
      case 'events':
        return (
          <EventEditorPanel
            selectedEventId={selectedEventId}
            onEventSelect={setSelectedEventId}
            onClose={() => setEditorMode('overview')}
          />
        );
      case 'quests':
        return (
          <QuestEditorPanel
            selectedQuestId={selectedQuestId}
            onQuestSelect={setSelectedQuestId}
            onClose={() => setEditorMode('overview')}
          />
        );
      case 'characters':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Редактор персонажей</h3>
              <p className="text-gray-500 mb-4">Здесь будет редактор персонажей</p>
              <button
                onClick={() => setEditorMode('overview')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                Назад к обзору
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Редактор Nexus</h1>
            <p className="text-gray-300 mb-6">
              Добро пожаловать в редактор Nexus! Здесь вы можете создавать интерактивные истории и диалоги.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => setEditorMode('characters')}
              >
                <h3 className="text-lg font-semibold mb-2 text-blue-400">Персонажи</h3>
                <p className="text-gray-300 text-sm mb-3">Создавайте и настраивайте персонажей с уникальными характеристиками</p>
                <div className="text-xs text-gray-400">
                  Всего персонажей: {characters.length}
                </div>
              </div>
              
              <div 
                className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => setEditorMode('events')}
              >
                <h3 className="text-lg font-semibold mb-2 text-purple-400">События</h3>
                <p className="text-gray-300 text-sm mb-3">Создавайте события: диалоги, проверки навыков, бои</p>
                <div className="text-xs text-gray-400">
                  Всего событий: {events.length}
                </div>
              </div>
              
              <div 
                className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => setEditorMode('quests')}
              >
                <h3 className="text-lg font-semibold mb-2 text-cyan-400">Квесты</h3>
                <p className="text-gray-300 text-sm mb-3">Создавайте увлекательные квесты и задания</p>
                <div className="text-xs text-gray-400">
                  Всего квестов: {quests.length}
                </div>
              </div>
            </div>
            
            {children}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
          <span className="text-white font-medium">Nexus Editor</span>
          {currentProject && (
            <div className="flex items-center gap-2 ml-4">
              <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">📁</span>
              </div>
              <span className="text-gray-300 text-sm">{currentProject.name}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {editorMode !== 'overview' && (
            <button
              onClick={() => setEditorMode('overview')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🏠</span>
              </div>
              <span className="text-white font-medium">Обзор</span>
            </button>
          )}

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

      <div className="flex-1">
        {renderEditor()}
        </div>
    </div>
  );
};

export default AdventureLayoutRefactored;