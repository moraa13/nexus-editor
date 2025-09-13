import { useState, useEffect } from 'react';

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  showLevelUp?: boolean;
  onLevelUp?: () => void;
  className?: string;
}

export default function XPBar({ 
  currentXP, 
  maxXP, 
  level, 
  showLevelUp = false,
  onLevelUp,
  className = ""
}: XPBarProps) {
  const [displayXP, setDisplayXP] = useState(0);
  const [isLevelingUp, setIsLevelingUp] = useState(false);

  const progress = (displayXP / maxXP) * 100;

  useEffect(() => {
    // Animate XP bar filling
    const timer = setTimeout(() => {
      setDisplayXP(currentXP);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentXP]);

  useEffect(() => {
    if (showLevelUp) {
      setIsLevelingUp(true);
      onLevelUp?.();
      
      // Reset level up animation after delay
      const timer = setTimeout(() => {
        setIsLevelingUp(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showLevelUp, onLevelUp]);

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 ${className}`}>
      {/* Level Display */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`
            w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500
            flex items-center justify-center text-white font-bold text-lg
            shadow-lg
            ${isLevelingUp ? 'animate-bounce' : ''}
          `}>
            {level}
          </div>
          <div>
            <div className="text-white font-semibold">Level {level}</div>
            <div className="text-gray-400 text-sm">Story Creator</div>
          </div>
        </div>

        {/* XP Numbers */}
        <div className="text-right">
          <div className="text-white font-semibold">
            {displayXP.toLocaleString()} / {maxXP.toLocaleString()} XP
          </div>
          <div className="text-gray-400 text-sm">
            {(maxXP - displayXP).toLocaleString()} to next level
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="relative">
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`
              h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
              transition-all duration-1000 ease-out
              relative
            `}
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Level Up Indicator */}
        {progress >= 100 && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
              LEVEL UP! 🎉
            </div>
          </div>
        )}
      </div>

      {/* XP Sources */}
      <div className="mt-3 text-xs text-gray-400">
        💬 Dialogue: +10 XP • 🎯 Quest: +50 XP • 🎲 Skill Check: +25 XP
      </div>
    </div>
  );
}
