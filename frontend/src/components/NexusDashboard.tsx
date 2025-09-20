import React, { useState } from 'react';
import type { ProjectSettings } from '../types/project';

interface NexusDashboardProps {
  onNavigateToEditor?: () => void;
  currentProject?: ProjectSettings | null;
}

// Отдельный компонент для карточек функций
interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
}

function FeatureCard({ title, description, icon, color, onClick }: FeatureCardProps) {
  return (
    <div 
      onClick={onClick} 
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
    >
      <div className={`w-full h-40 bg-gradient-to-br ${color} rounded-2xl flex flex-col items-center justify-center text-white shadow-2xl group-hover:shadow-3xl transition-all duration-300 border border-white/10 backdrop-blur-sm`}>
        <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="font-bold text-xl mb-2 group-hover:text-yellow-200 transition-colors duration-300">{title}</h3>
        <p className="text-sm opacity-90 text-center leading-relaxed px-4 group-hover:opacity-100 transition-opacity duration-300">{description}</p>
      </div>
    </div>
  );
}

// Компонент для кнопок навигации
interface NavButtonProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 ${
        isActive 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25' 
          : 'bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-gray-600/30'
      }`}
      title={label}
    >
      <span className="text-xl">{icon}</span>
    </button>
  );
}

export default function NexusDashboard({ onNavigateToEditor, currentProject }: NexusDashboardProps) {
  const [activeNavItem, setActiveNavItem] = useState<'dashboard' | 'projects' | 'chat' | 'play'>('dashboard');
  const [chatMessage, setChatMessage] = useState('');
  const [aiResponse, setAiResponse] = useState(
    'Приветствую, создатель. Готов помочь воплотить твою вселенную в жизнь. С чего начнем?'  
  );

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    setAiResponse(`"${chatMessage}"... любопытно. Давай подумаем, как это встроить в повествование.`);
    setChatMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const featureCards = [
    {
      id: 'character', 
      title: 'Герой', 
      description: 'Определи его сущность и слабости', 
      icon: '🎭', 
      color: 'from-purple-500 via-purple-600 to-indigo-600',
      onClick: () => onNavigateToEditor?.()
    },
    {
      id: 'event', 
      title: 'Событие', 
      description: 'Ключевой поворот в истории', 
      icon: '📖', 
      color: 'from-red-500 via-red-600 to-pink-600',
      onClick: () => onNavigateToEditor?.()
    },
    {
      id: 'quest', 
      title: 'Квест', 
      description: 'Нить, за которую будет тянуть игрок', 
      icon: '🧩', 
      color: 'from-orange-500 via-orange-600 to-yellow-600',
      onClick: () => onNavigateToEditor?.()
    },
    {
      id: 'style', 
      title: 'Атмосфера', 
      description: 'Настрой, стиль и философия игры', 
      icon: '🌌', 
      color: 'from-pink-500 via-purple-500 to-indigo-600',
      onClick: () => onNavigateToEditor?.()
    }
  ];

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Главная' },
    { id: 'chat', icon: '💬', label: 'Диалог' },
    { id: 'play', icon: '▶️', label: 'Тест' }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex flex-col overflow-hidden">
      {/* Top Bar - Enhanced */}
      <div className="h-16 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 flex items-center justify-between px-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="text-white text-lg font-semibold tracking-wide">Nexus Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 bg-gray-700/80 hover:bg-gray-600/80 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105">
            <span className="text-gray-300 text-sm">↗</span>
          </button>
          <button className="w-8 h-8 bg-gray-700/80 hover:bg-gray-600/80 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105">
            <span className="text-gray-300 text-sm">↻</span>
          </button>
          <button className="w-8 h-8 bg-gray-700/80 hover:bg-gray-600/80 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105">
            <span className="text-gray-300 text-sm">⋯</span>
          </button>
          <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 shadow-lg">
            Остановить
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Navigation - Enhanced */}
        <div className="w-20 bg-gray-900/60 backdrop-blur-xl flex flex-col items-center py-8 space-y-6 border-r border-gray-700/30">
          {navItems.map((item) => (
            <NavButton
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeNavItem === item.id}
              onClick={() => setActiveNavItem(item.id as any)}
            />
          ))}
        </div>

        <div className="flex-1 flex">
          {/* Main Content - Enhanced */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {/* Hero Title */}
              <div className="text-center mb-12">
                <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 tracking-tight">
                  Nexus
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
              </div>

              {/* Feature Cards Grid - Enhanced */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {featureCards.map((card) => (
                  <FeatureCard
                    key={card.id}
                    title={card.title}
                    description={card.description}
                    icon={card.icon}
                    color={card.color}
                    onClick={card.onClick}
                  />
                ))}
              </div>

              {/* Call to Action Section - Enhanced */}
              <div className="text-center space-y-6 mb-12">
                <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                  {currentProject ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                      Проект: {currentProject.name}
                    </span>
                  ) : (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                      Создай свою первую вселенную
                    </span>
                  )}
                </h2>
                
                <div className="space-y-4 text-white/90 text-xl leading-relaxed max-w-4xl mx-auto">
                  {currentProject ? (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-2xl mb-2">🎮</div>
                          <p className="font-semibold text-blue-300">Жанр</p>
                          <p className="text-lg">{currentProject.gameSetting.genre}</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-2">🎭</div>
                          <p className="font-semibold text-purple-300">Тональность</p>
                          <p className="text-lg">{currentProject.gameSetting.emotionalTone}</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-2">🌌</div>
                          <p className="font-semibold text-pink-300">Стиль</p>
                          <p className="text-lg">{currentProject.gameTone.mood}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-2xl">Погрузись в редактор, где идеи обретают форму</p>
                      <p className="text-xl text-gray-300">Создай персонажей, ветвящиеся диалоги и моральные выборы</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons - Enhanced */}
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button
                  onClick={onNavigateToEditor}
                  className="group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 border border-white/20"
                >
                  <span className="text-2xl group-hover:animate-bounce">🚀</span>
                  <span>Создать сцену</span>
                </button>
                <button className="group bg-gray-800/80 hover:bg-gray-700/80 text-white px-10 py-5 text-xl font-semibold rounded-2xl border border-gray-600/50 flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                  <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">📚</span>
                  <span>Примеры проектов</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Chat Sidebar - Discord/Notion Style */}
          <div className="w-80 bg-gradient-to-b from-gray-900/90 via-blue-900/80 to-purple-900/90 backdrop-blur-xl p-6 flex flex-col border-l border-gray-700/30">
            {/* AI Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">ИИ-сценарист</h3>
                <p className="text-gray-400 text-sm">Всегда готов помочь</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 flex flex-col justify-center mb-8">
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">AI</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm leading-relaxed">{aiResponse}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input - Discord Style */}
            <div className="relative">
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-600/50 focus-within:border-purple-500/50 transition-all duration-300">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Задать вопрос..."
                  className="w-full bg-transparent px-4 py-4 text-white placeholder-gray-400 focus:outline-none rounded-2xl text-sm"
                />
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <span className="text-white text-sm">▶</span>
                </button>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-6 flex items-center gap-3 text-gray-400 text-sm">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span>Связь с ИИ установлена</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}