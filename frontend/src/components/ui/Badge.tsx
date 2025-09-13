import { useState } from 'react';

interface BadgeProps {
  icon: string;
  title: string;
  description: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked?: boolean;
  progress?: number;
  onClick?: () => void;
}

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500'
};

const rarityGlow = {
  common: 'shadow-gray-500/20',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/40',
  legendary: 'shadow-yellow-500/50'
};

export default function Badge({ 
  icon, 
  title, 
  description, 
  rarity = 'common',
  unlocked = false,
  progress = 0,
  onClick 
}: BadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`
        relative group cursor-pointer transition-all duration-300
        ${unlocked ? 'opacity-100' : 'opacity-60'}
        ${isHovered ? 'scale-105' : 'scale-100'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Badge Container */}
      <div className={`
        w-20 h-20 rounded-xl bg-gradient-to-br ${rarityColors[rarity]}
        flex items-center justify-center text-2xl
        shadow-lg ${rarityGlow[rarity]}
        ${isHovered ? 'shadow-xl' : ''}
        border-2 border-white/20
        relative overflow-hidden
      `}>
        {/* Shine Effect */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
          ${isHovered ? 'animate-shine' : ''}
        `} />
        
        {/* Icon */}
        <span className="relative z-10 drop-shadow-sm">
          {icon}
        </span>

        {/* Unlocked Indicator */}
        {unlocked && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}

        {/* Progress Ring */}
        {!unlocked && progress > 0 && (
          <div className="absolute inset-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#FEE75C"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-500"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Tooltip */}
      <div className={`
        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
        bg-gray-800 text-white text-xs rounded-lg px-3 py-2
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        pointer-events-none z-50
        shadow-xl border border-white/10
        whitespace-nowrap
      `}>
        <div className="font-semibold">{title}</div>
        <div className="text-gray-300">{description}</div>
        {!unlocked && progress > 0 && (
          <div className="text-yellow-400 mt-1">
            Progress: {Math.round(progress)}%
          </div>
        )}
        
        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
      </div>
    </div>
  );
}
