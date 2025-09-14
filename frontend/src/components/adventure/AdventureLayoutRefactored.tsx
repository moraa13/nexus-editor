import React, { useEffect } from 'react';
import { useAdventureStore, useCurrentProject, useCharacters } from '../../stores/adventureStore';

interface AdventureLayoutRefactoredProps {
  children?: React.ReactNode;
  onNavigateToLanding?: () => void;
}

const AdventureLayoutRefactored: React.FC<AdventureLayoutRefactoredProps> = ({ 
  children, 
  onNavigateToLanding 
}) => {
  const currentProject = useCurrentProject();
  const characters = useCharacters();
  const { setCurrentProject } = useAdventureStore();

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
  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
        
        {onNavigateToLanding && (
          <button
            onClick={onNavigateToLanding}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">←</span>
            </div>
            <span className="text-white font-medium">Назад к лендингу</span>
          </button>
        )}
      </div>
      
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Редактор Nexus</h1>
        <p className="text-gray-300 mb-6">
          Добро пожаловать в редактор Nexus! Здесь вы можете создавать интерактивные истории и диалоги.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">Персонажи</h3>
            <p className="text-gray-300 text-sm mb-3">Создавайте и настраивайте персонажей с уникальными характеристиками</p>
            <div className="text-xs text-gray-400">
              Всего персонажей: {characters.length}
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-purple-400">Диалоги</h3>
            <p className="text-gray-300 text-sm mb-3">Строите ветвящиеся диалоги с ИИ-генерацией</p>
            <div className="text-xs text-gray-400">
              Активных диалогов: 0
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-cyan-400">Квесты</h3>
            <p className="text-gray-300 text-sm mb-3">Создавайте увлекательные квесты и задания</p>
            <div className="text-xs text-gray-400">
              Активных квестов: 0
            </div>
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default AdventureLayoutRefactored;
