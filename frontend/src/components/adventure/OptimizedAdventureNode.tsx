import { useState, memo, useCallback } from 'react';

interface NodeData {
  id: string;
  type: 'dialogue' | 'quest' | 'skill_check' | 'location';
  title: string;
  description?: string;
  icon: string;
  x: number;
  y: number;
  isCompleted?: boolean;
  isLocked?: boolean;
}

interface OptimizedAdventureNodeProps extends NodeData {
  isActive?: boolean;
  onClick?: () => void;
  onDrag?: (x: number, y: number) => void;
}

const nodeTypes = {
  dialogue: {
    bg: 'from-blue-500 to-purple-600',
    border: 'border-blue-400',
    glow: 'shadow-blue-500/30',
    size: 'w-20 h-20'
  },
  quest: {
    bg: 'from-yellow-500 to-orange-600',
    border: 'border-yellow-400', 
    glow: 'shadow-yellow-500/30',
    size: 'w-16 h-16'
  },
  skill_check: {
    bg: 'from-green-500 to-teal-600',
    border: 'border-green-400',
    glow: 'shadow-green-500/30',
    size: 'w-14 h-14'
  },
  location: {
    bg: 'from-purple-500 to-pink-600',
    border: 'border-purple-400',
    glow: 'shadow-purple-500/30',
    size: 'w-24 h-24'
  }
};

// Memoized component to prevent unnecessary re-renders
const OptimizedAdventureNode = memo<OptimizedAdventureNodeProps>(({
  id,
  type,
  title,
  description,
  icon,
  x,
  y,
  isCompleted = false,
  isLocked = false,
  isActive = false,
  onClick,
  onDrag
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const nodeStyle = nodeTypes[type];

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isLocked) return;
    
    setIsDragging(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, [isLocked]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    onDrag?.(newX, newY);
  }, [isDragging, dragOffset, onDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!isDragging) {
      onClick?.();
    }
  }, [isDragging, onClick]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className={`
        absolute cursor-pointer transition-all duration-200 gpu-accelerated
        ${isDragging ? 'z-50' : 'z-10'}
        ${isLocked ? 'cursor-not-allowed opacity-50' : ''}
      `}
      style={{
        left: x,
        top: y,
        transform: isHovered ? 'translate3d(0, 0, 0) scale(1.1)' : 'translate3d(0, 0, 0) scale(1)',
        filter: isDragging ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' : 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Node Container */}
      <div className={`
        ${nodeStyle.size} rounded-2xl bg-gradient-to-br ${nodeStyle.bg}
        border-2 ${nodeStyle.border} shadow-lg ${nodeStyle.glow}
        flex items-center justify-center text-white text-2xl
        relative overflow-hidden
        ${isActive ? 'ring-4 ring-white/50' : ''}
        ${isCompleted ? 'ring-2 ring-green-400' : ''}
        ${isHovered ? 'shadow-xl' : ''}
        gpu-accelerated
      `}>
        {/* Optimized shimmer effect - only when hovered */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
        )}

        {/* Icon */}
        <span className="relative z-10 drop-shadow-sm">
          {icon}
        </span>

        {/* Completion Check */}
        {isCompleted && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
        )}

        {/* Lock Icon */}
        {isLocked && (
          <div className="absolute inset-0 bg-gray-800/50 rounded-2xl flex items-center justify-center">
            <span className="text-white text-lg">🔒</span>
          </div>
        )}
      </div>

      {/* Tooltip - only render when hovered for performance */}
      {isHovered && (
        <div className={`
          absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
          bg-gray-800 text-white text-sm rounded-lg px-4 py-2
          opacity-0 animate-fade-in-up
          pointer-events-none z-50
          shadow-xl border border-white/10
          whitespace-nowrap
          max-w-xs
        `}>
          <div className="font-semibold">{title}</div>
          {description && (
            <div className="text-gray-300 text-xs mt-1">{description}</div>
          )}
          <div className="text-gray-400 text-xs mt-1 capitalize">
            {type.replace('_', ' ')}
          </div>
          
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
});

OptimizedAdventureNode.displayName = 'OptimizedAdventureNode';

export default OptimizedAdventureNode;
