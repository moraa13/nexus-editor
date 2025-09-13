import { useState } from 'react';

interface CharacterStats {
  logic: number;
  empathy: number;
  endurance: number;
  composure: number;
  [key: string]: number;
}

interface Character {
  id: string;
  name: string;
  portrait?: string;
  stats: CharacterStats;
  level: number;
  xp: number;
  maxXp: number;
}

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onClick?: () => void;
  onStatClick?: (statName: string) => void;
}

export default function CharacterCard({ 
  character, 
  isSelected = false,
  onClick,
  onStatClick 
}: CharacterCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatColor = (value: number) => {
    if (value >= 15) return 'text-green-400';
    if (value >= 10) return 'text-yellow-400';
    if (value >= 5) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStatIcon = (statName: string) => {
    const icons: { [key: string]: string } = {
      logic: '🧠',
      empathy: '❤️',
      endurance: '💪',
      composure: '😌',
      perception: '👁️',
      authority: '👑',
      rhetoric: '💬',
      drama: '🎭'
    };
    return icons[statName] || '⭐';
  };

  return (
    <div 
      className={`
        bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4
        transition-all duration-200 cursor-pointer
        ${isSelected ? 'border-blue-400 bg-blue-500/10' : 'hover:border-white/20'}
        ${isHovered ? 'scale-105 shadow-lg' : 'scale-100'}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Character Header */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
          {character.portrait || '👤'}
        </div>
        
        <div className="flex-1">
          <div className="text-white font-semibold">{character.name}</div>
          <div className="text-gray-400 text-sm">Level {character.level}</div>
        </div>

        {/* Level Badge */}
        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {character.level}
        </div>
      </div>

      {/* XP Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Experience</span>
          <span>{character.xp}/{character.maxXp}</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(character.xp / character.maxXp) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(character.stats).slice(0, 8).map(([statName, value]) => (
          <button
            key={statName}
            className={`
              flex items-center gap-2 p-2 rounded-lg transition-all duration-200
              hover:bg-white/10 text-left
            `}
            onClick={(e) => {
              e.stopPropagation();
              onStatClick?.(statName);
            }}
          >
            <span className="text-lg">{getStatIcon(statName)}</span>
            <div className="flex-1">
              <div className="text-xs text-gray-400 capitalize">
                {statName.replace('_', ' ')}
              </div>
              <div className={`text-sm font-semibold ${getStatColor(value)}`}>
                {value}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
          Edit
        </button>
        <button className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors">
          Stats
        </button>
      </div>
    </div>
  );
}

