import { useState } from 'react';

interface ServerIconProps {
  icon: string;
  name: string;
  isActive?: boolean;
  onClick?: () => void;
  hasNotification?: boolean;
  tooltip?: string;
  size?: 'normal' | 'large';
}

export default function ServerIcon({ 
  icon, 
  name, 
  isActive = false,
  onClick,
  hasNotification = false,
  tooltip,
  size = 'normal'
}: ServerIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const sizeClasses = size === 'large' 
    ? 'w-16 h-16 text-2xl' 
    : 'w-12 h-12 text-lg';

  return (
    <div className="relative group">
      {/* Server Icon */}
      <button
        className={`
          relative ${sizeClasses} rounded-2xl transition-all duration-200
          flex items-center justify-center text-white
          ${isActive 
            ? 'rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg' 
            : 'bg-gray-600 hover:rounded-2xl hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600'
          }
          ${isHovered ? 'scale-110' : 'scale-100'}
          ${hasNotification ? 'ring-2 ring-red-500 ring-opacity-50' : ''}
        `}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Icon */}
        <span className="relative z-10 drop-shadow-sm">
          {icon}
        </span>

        {/* Active Indicator */}
        {isActive && (
          <div className={`absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 ${size === 'large' ? 'h-10' : 'h-8'} bg-white rounded-r-full`} />
        )}

        {/* Notification Badge */}
        {hasNotification && (
          <div className={`absolute -top-1 -right-1 ${size === 'large' ? 'w-6 h-6' : 'w-5 h-5'} bg-red-500 rounded-full flex items-center justify-center`}>
            <span className={`text-white ${size === 'large' ? 'text-sm' : 'text-xs'} font-bold`}>!</span>
          </div>
        )}

        {/* Hover Glow */}
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          ${isActive ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20' : ''}
        `} />
      </button>

      {/* Tooltip */}
      {tooltip && (
        <div className={`
          absolute left-full ml-2 top-1/2 transform -translate-y-1/2
          bg-gray-900 text-white text-sm px-3 py-2 rounded-lg
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          pointer-events-none z-50
          shadow-xl border border-white/10
          whitespace-nowrap
        `}>
          {tooltip}
          
          {/* Tooltip Arrow */}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
        </div>
      )}
    </div>
  );
}
