import { useState, useMemo } from 'react';
import XPBar from '../ui/XPBar';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'story' | 'character' | 'dialogue' | 'system';
  xpReward: number;
}

interface AchievementsPanelProps {
  projectId?: string;
}

export default function AchievementsPanel({ projectId }: AchievementsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'story' | 'character' | 'dialogue' | 'system'>('all');
  const [userXP, setUserXP] = useState({
    current: 1250,
    max: 1500,
    level: 5
  });

  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Первые шаги',
      description: 'Создайте своего первого персонажа',
      icon: '👤',
      unlocked: true,
      unlockedAt: '2024-01-15',
      category: 'character',
      xpReward: 100
    },
    {
      id: '2',
      title: 'Мастер диалогов',
      description: 'Создайте 10 диалогов',
      icon: '💬',
      unlocked: true,
      unlockedAt: '2024-01-20',
      category: 'dialogue',
      xpReward: 200
    },
    {
      id: '3',
      title: 'Сказочник',
      description: 'Создайте ветку событий с 5+ узлами',
      icon: '🌳',
      unlocked: false,
      category: 'story',
      xpReward: 300
    },
    {
      id: '4',
      title: 'Событийный мастер',
      description: 'Создайте 5 различных событий',
      icon: '🎭',
      unlocked: false,
      category: 'story',
      xpReward: 250
    },
    {
      id: '5',
      title: 'Художник персонажей',
      description: 'Создайте 3 уникальных персонажа',
      icon: '🎨',
      unlocked: true,
      unlockedAt: '2024-01-25',
      category: 'character',
      xpReward: 150
    },
    {
      id: '6',
      title: 'Исследователь',
      description: 'Изучите все функции редактора',
      icon: '🔍',
      unlocked: false,
      category: 'system',
      xpReward: 500
    },
    {
      id: '7',
      title: 'Социальный бабочка',
      description: 'Создайте диалог с 10+ репликами',
      icon: '🦋',
      unlocked: false,
      category: 'dialogue',
      xpReward: 400
    },
    {
      id: '8',
      title: 'Архитектор историй',
      description: 'Создайте сложную ветку с разветвлениями',
      icon: '🏗️',
      unlocked: false,
      category: 'story',
      xpReward: 600
    }
  ];

  const filteredAchievements = useMemo(() => {
    if (activeCategory === 'all') return achievements;
    return achievements.filter(achievement => achievement.category === activeCategory);
  }, [activeCategory]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);

  const handleLevelUp = () => {
    setUserXP(prev => ({
      current: 0,
      max: prev.max + 200,
      level: prev.level + 1
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'story': return '📚';
      case 'character': return '👥';
      case 'dialogue': return '💬';
      case 'system': return '⚙️';
      default: return '🏆';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'story': return 'Истории';
      case 'character': return 'Персонажи';
      case 'dialogue': return 'Диалоги';
      case 'system': return 'Система';
      default: return 'Все';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
            🏆
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Достижения</h2>
            <p className="text-gray-400 text-sm">Ваш прогресс в создании историй</p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-4">
          <XPBar
            currentXP={userXP.current}
            maxXP={userXP.max}
            level={userXP.level}
            onLevelUp={handleLevelUp}
          />
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{unlockedCount}</div>
            <div className="text-xs text-gray-400">Достижений</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">{totalXP}</div>
            <div className="text-xs text-gray-400">Опыт</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{userXP.level}</div>
            <div className="text-xs text-gray-400">Уровень</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex border-b border-gray-700">
        {[
          { key: 'all', name: 'Все', icon: '🏆' },
          { key: 'story', name: 'Истории', icon: '📚' },
          { key: 'character', name: 'Персонажи', icon: '👥' },
          { key: 'dialogue', name: 'Диалоги', icon: '💬' },
          { key: 'system', name: 'Система', icon: '⚙️' }
        ].map(({ key, name, icon }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key as any)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
              activeCategory === key
                ? 'text-white border-b-2 border-blue-500 bg-blue-500/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="mr-2">{icon}</span>
            {name}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-2 gap-4">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative p-4 rounded-xl border transition-all duration-200 ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30'
                  : 'bg-white/5 border-gray-700 hover:border-gray-600'
              }`}
            >
              {/* Achievement Icon */}
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl mb-3 mx-auto ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                  : 'bg-gray-700'
              }`}>
                {achievement.unlocked ? achievement.icon : '🔒'}
              </div>

              {/* Achievement Info */}
              <div className="text-center">
                <h3 className={`font-semibold mb-1 ${
                  achievement.unlocked ? 'text-white' : 'text-gray-400'
                }`}>
                  {achievement.title}
                </h3>
                <p className={`text-xs mb-2 ${
                  achievement.unlocked ? 'text-green-100' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>
                
                {/* XP Reward */}
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  achievement.unlocked 
                    ? 'bg-yellow-500/20 text-yellow-300' 
                    : 'bg-gray-700 text-gray-500'
                }`}>
                  <span>⭐</span>
                  <span>{achievement.xpReward} XP</span>
                </div>

                {/* Unlocked Date */}
                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="text-xs text-green-300 mt-2">
                    Получено: {new Date(achievement.unlockedAt).toLocaleDateString('ru-RU')}
                  </div>
                )}
              </div>

              {/* Category Badge */}
              <div className="absolute top-2 right-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  achievement.unlocked ? 'bg-blue-500/30' : 'bg-gray-700'
                }`}>
                  {getCategoryIcon(achievement.category)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
