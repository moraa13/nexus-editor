import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import type { GameTheme } from '../../types/theme';
import type { Character } from '../../types/project';

interface CharacterPanelProps {
  theme: GameTheme;
  character?: Character | null;
}

interface Stat {
  name: string;
  value: number;
  max: number;
  description: string;
}

interface Skill {
  name: string;
  level: number;
  description: string;
  category: 'physical' | 'mental' | 'social' | 'special';
}

export default function CharacterPanel({ theme, character }: CharacterPanelProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'skills' | 'inventory' | 'relationships'>('stats');

  // Моковые данные для демонстрации
  const mockStats: Stat[] = [
    { name: 'Здоровье', value: 85, max: 100, description: 'Физическое состояние персонажа' },
    { name: 'Энергия', value: 60, max: 100, description: 'Усталость и выносливость' },
    { name: 'Мораль', value: 45, max: 100, description: 'Психическое состояние' },
    { name: 'Репутация', value: 30, max: 100, description: 'Как вас воспринимают другие' }
  ];

  const mockSkills: Skill[] = [
    { name: 'Сила', level: 7, description: 'Физическая мощь', category: 'physical' },
    { name: 'Ловкость', level: 5, description: 'Скорость и точность', category: 'physical' },
    { name: 'Интеллект', level: 8, description: 'Умственные способности', category: 'mental' },
    { name: 'Харизма', level: 4, description: 'Умение убеждать', category: 'social' },
    { name: 'Восприятие', level: 6, description: 'Внимательность к деталям', category: 'mental' },
    { name: 'Выживание', level: 3, description: 'Умение выживать в экстремальных условиях', category: 'special' }
  ];

  const getStatColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 70) return theme.colors.success;
    if (percentage >= 40) return theme.colors.warning;
    return theme.colors.error;
  };

  const getSkillCategoryColor = (category: string) => {
    const colors = {
      physical: theme.colors.error,
      mental: theme.colors.primary,
      social: theme.colors.accent,
      special: theme.colors.warning
    };
    return colors[category as keyof typeof colors] || theme.colors.textSecondary;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Character Header */}
      <div 
        className="p-4 border-b"
        style={{ 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border 
        }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ 
              backgroundColor: theme.colors.accent,
              color: theme.colors.background
            }}
          >
            {character?.name?.[0] || '👤'}
          </div>
          <div>
            <h2 
              className="text-xl font-bold"
              style={{ 
                color: theme.colors.text,
                fontFamily: theme.fonts.primary 
              }}
            >
              {character?.name || 'Главный герой'}
            </h2>
            <p 
              className="text-sm"
              style={{ 
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.secondary 
              }}
            >
              {character?.description || 'Описание персонажа'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div 
        className="flex border-b"
        style={{ borderColor: theme.colors.border }}
      >
        {[
          { id: 'stats', name: 'Характеристики', icon: '📊' },
          { id: 'skills', name: 'Навыки', icon: '🎯' },
          { id: 'inventory', name: 'Инвентарь', icon: '🎒' },
          { id: 'relationships', name: 'Отношения', icon: '👥' }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'primary' : 'ghost'}
            onClick={() => setActiveTab(tab.id as any)}
            className="flex-1 rounded-none"
            style={{
              backgroundColor: activeTab === tab.id 
                ? theme.colors.primary 
                : 'transparent',
              color: theme.colors.text,
              borderColor: theme.colors.border,
              fontFamily: theme.fonts.primary
            }}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h3 
              className="text-lg font-semibold"
              style={{ 
                color: theme.colors.text,
                fontFamily: theme.fonts.primary 
              }}
            >
              Характеристики
            </h3>
            {mockStats.map((stat) => (
              <Card
                key={stat.name}
                variant="elevated"
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border
                }}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 
                      className="font-medium"
                      style={{ 
                        color: theme.colors.text,
                        fontFamily: theme.fonts.primary 
                      }}
                    >
                      {stat.name}
                    </h4>
                    <span 
                      className="text-sm"
                      style={{ 
                        color: theme.colors.textSecondary,
                        fontFamily: theme.fonts.secondary 
                      }}
                    >
                      {stat.value}/{stat.max}
                    </span>
                  </div>
                  <div 
                    className="w-full h-2 rounded-full"
                    style={{ backgroundColor: theme.colors.background }}
                  >
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(stat.value / stat.max) * 100}%`,
                        backgroundColor: getStatColor(stat.value, stat.max)
                      }}
                    />
                  </div>
                  <p 
                    className="text-xs"
                    style={{ 
                      color: theme.colors.textSecondary,
                      fontFamily: theme.fonts.secondary 
                    }}
                  >
                    {stat.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-4">
            <h3 
              className="text-lg font-semibold"
              style={{ 
                color: theme.colors.text,
                fontFamily: theme.fonts.primary 
              }}
            >
              Навыки
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockSkills.map((skill) => (
                <Card
                  key={skill.name}
                  variant="elevated"
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 
                        className="font-medium"
                        style={{ 
                          color: theme.colors.text,
                          fontFamily: theme.fonts.primary 
                        }}
                      >
                        {skill.name}
                      </h4>
                      <div 
                        className="text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: getSkillCategoryColor(skill.category),
                          color: theme.colors.background,
                          fontFamily: theme.fonts.secondary 
                        }}
                      >
                        {skill.category}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="flex-1 h-2 rounded-full"
                        style={{ backgroundColor: theme.colors.background }}
                      >
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(skill.level / 10) * 100}%`,
                            backgroundColor: theme.colors.primary
                          }}
                        />
                      </div>
                      <span 
                        className="text-sm font-medium"
                        style={{ 
                          color: theme.colors.text,
                          fontFamily: theme.fonts.primary 
                        }}
                      >
                        {skill.level}/10
                      </span>
                    </div>
                    <p 
                      className="text-xs"
                      style={{ 
                        color: theme.colors.textSecondary,
                        fontFamily: theme.fonts.secondary 
                      }}
                    >
                      {skill.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="text-center py-8">
            <div 
              className="text-4xl mb-4"
              style={{ color: theme.colors.textSecondary }}
            >
              🎒
            </div>
            <p 
              style={{ 
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.secondary 
              }}
            >
              Инвентарь доступен в отдельной панели
            </p>
          </div>
        )}

        {activeTab === 'relationships' && (
          <div className="text-center py-8">
            <div 
              className="text-4xl mb-4"
              style={{ color: theme.colors.textSecondary }}
            >
              👥
            </div>
            <p 
              style={{ 
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.secondary 
              }}
            >
              Система отношений в разработке
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
