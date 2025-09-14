import React from 'react';

interface AdventureLayoutRefactoredProps {
  children?: React.ReactNode;
  onNavigateToLanding?: () => void;
}

const AdventureLayoutRefactored: React.FC<AdventureLayoutRefactoredProps> = ({ 
  children, 
  onNavigateToLanding 
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span className="text-white font-medium">Nexus Editor</span>
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
            <p className="text-gray-300 text-sm">Создавайте и настраивайте персонажей с уникальными характеристиками</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-purple-400">Диалоги</h3>
            <p className="text-gray-300 text-sm">Строите ветвящиеся диалоги с ИИ-генерацией</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-cyan-400">Квесты</h3>
            <p className="text-gray-300 text-sm">Создавайте увлекательные квесты и задания</p>
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default AdventureLayoutRefactored;
