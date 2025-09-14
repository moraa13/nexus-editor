import React from 'react';
import { cn } from '../../lib/utils';
import { STAT_CATEGORIES } from '../../types/discoElysium';
import type { DiscoElysiumCharacter, DiscoElysiumStat } from '../../types/discoElysium';
import { getStatModifierText } from '../../utils/diceSystem';
import { 
  Brain, 
  Heart, 
  Zap, 
  Target, 
  Lock, 
  Unlock,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface CharacterStatsProps {
  character: DiscoElysiumCharacter;
  onStatChange?: (statId: keyof DiscoElysiumCharacter['stats'], newValue: number) => void;
  showModifiers?: boolean;
  className?: string;
}

export default function CharacterStats({
  character,
  onStatChange,
  showModifiers = true,
  className
}: CharacterStatsProps) {
  const statCategories = Object.entries(STAT_CATEGORIES);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Intellect': return <Brain className="w-5 h-5" />;
      case 'Psyche': return <Heart className="w-5 h-5" />;
      case 'Physique': return <Zap className="w-5 h-5" />;
      case 'Motorics': return <Target className="w-5 h-5" />;
      default: return <Minus className="w-5 h-5" />;
    }
  };

  const getStatStatusIcon = (stat: DiscoElysiumStat) => {
    if (stat.isLocked) return <Lock className="w-4 h-4 text-red-400" />;
    if (stat.isActive) return <Unlock className="w-4 h-4 text-green-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getModifierIcon = (modifier: number) => {
    if (modifier > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (modifier < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getStatValueColor = (value: number) => {
    if (value >= 18) return 'text-purple-400';
    if (value >= 15) return 'text-blue-400';
    if (value >= 12) return 'text-green-400';
    if (value >= 8) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatBackgroundColor = (value: number) => {
    if (value >= 18) return 'bg-purple-900/20 border-purple-400/30';
    if (value >= 15) return 'bg-blue-900/20 border-blue-400/30';
    if (value >= 12) return 'bg-green-900/20 border-green-400/30';
    if (value >= 8) return 'bg-yellow-900/20 border-yellow-400/30';
    return 'bg-red-900/20 border-red-400/30';
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Character Info */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center gap-4">
          {character.portrait && (
            <img
              src={character.portrait}
              alt={character.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
            />
          )}
          <div>
            <h3 className="text-xl font-bold text-white">{character.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Level {character.level}</span>
              <span>XP: {character.experience}/{character.experienceToNext}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
              <span>Health: {character.health}/{character.maxHealth}</span>
              <span>Morale: {character.morale}/{character.maxMorale}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats by Category */}
      {statCategories.map(([categoryName, categoryInfo]) => {
        const categoryStats = categoryInfo.stats.map(statId => ({
          id: statId,
          stat: character.stats[statId as keyof DiscoElysiumCharacter['stats']]
        }));

        return (
          <div key={categoryName} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${categoryInfo.color}20` }}
              >
                {getCategoryIcon(categoryName)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{categoryName}</h4>
                <p className="text-sm text-gray-400">{categoryInfo.description}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {categoryStats.map(({ id, stat }) => (
                <StatCard
                  key={id}
                  stat={stat}
                  categoryColor={categoryInfo.color}
                  onValueChange={onStatChange ? (newValue) => onStatChange(id as keyof DiscoElysiumCharacter['stats'], newValue) : undefined}
                  showModifiers={showModifiers}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface StatCardProps {
  stat: DiscoElysiumStat;
  categoryColor: string;
  onValueChange?: (newValue: number) => void;
  showModifiers?: boolean;
}

function StatCard({ stat, categoryColor, onValueChange, showModifiers }: StatCardProps) {
  const getStatValueColor = (value: number) => {
    if (value >= 18) return 'text-purple-400';
    if (value >= 15) return 'text-blue-400';
    if (value >= 12) return 'text-green-400';
    if (value >= 8) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatBackgroundColor = (value: number) => {
    if (value >= 18) return 'bg-purple-900/20 border-purple-400/30';
    if (value >= 15) return 'bg-blue-900/20 border-blue-400/30';
    if (value >= 12) return 'bg-green-900/20 border-green-400/30';
    if (value >= 8) return 'bg-yellow-900/20 border-yellow-400/30';
    return 'bg-red-900/20 border-red-400/30';
  };

  const getModifierIcon = (modifier: number) => {
    if (modifier > 0) return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (modifier < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  return (
    <div 
      className={cn(
        "p-3 rounded-lg border transition-all duration-200 hover:scale-105",
        getStatBackgroundColor(stat.value)
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{stat.icon}</span>
          <span className="text-sm font-medium text-white">{stat.shortName}</span>
          {stat.isLocked && <Lock className="w-3 h-3 text-red-400" />}
          {stat.isActive && !stat.isLocked && <Unlock className="w-3 h-3 text-green-400" />}
        </div>
        
        {showModifiers && (
          <div className="flex items-center gap-1">
            {getModifierIcon(stat.modifier)}
            <span className={cn(
              "text-xs font-mono",
              stat.modifier > 0 ? "text-green-400" : stat.modifier < 0 ? "text-red-400" : "text-gray-400"
            )}>
              {getStatModifierText(stat.modifier)}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className={cn(
          "text-2xl font-bold font-mono",
          getStatValueColor(stat.value)
        )}>
          {stat.value}
        </div>
        
        {onValueChange && (
          <div className="flex gap-1">
            <button
              onClick={() => onValueChange(Math.max(1, stat.value - 1))}
              className="w-6 h-6 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs flex items-center justify-center transition-colors"
            >
              -
            </button>
            <button
              onClick={() => onValueChange(Math.min(20, stat.value + 1))}
              className="w-6 h-6 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs flex items-center justify-center transition-colors"
            >
              +
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-400 line-clamp-2">
        {stat.description}
      </div>
    </div>
  );
}

// Compact stats view for smaller spaces
export function CompactCharacterStats({
  character,
  className
}: {
  character: DiscoElysiumCharacter;
  className?: string;
}) {
  const totalStats = Object.values(character.stats).reduce((sum, stat) => sum + stat.value, 0);
  const averageStat = Math.round(totalStats / 12);

  return (
    <div className={cn("bg-gray-800 rounded-lg p-3 border border-gray-700", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">👤</span>
          <span className="text-sm font-medium text-white">{character.name}</span>
        </div>
        <div className="text-xs text-gray-400">
          Avg: {averageStat}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mt-2">
        {Object.entries(STAT_CATEGORIES).map(([category, info]) => {
          const categoryStats = info.stats.map(statId => 
            character.stats[statId as keyof DiscoElysiumCharacter['stats']]
          );
          const categoryTotal = categoryStats.reduce((sum, stat) => sum + stat.value, 0);
          const categoryAvg = Math.round(categoryTotal / categoryStats.length);
          
          return (
            <div key={category} className="text-center">
              <div 
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: `${info.color}20`, color: info.color }}
              >
                {category.slice(0, 3)}
              </div>
              <div className="text-xs text-gray-400 mt-1">{categoryAvg}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


