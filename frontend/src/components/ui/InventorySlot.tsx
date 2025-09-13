import { useState } from 'react';

interface InventorySlotProps {
  item?: {
    id: string;
    name: string;
    icon: string;
    rarity?: 'common' | 'rare' | 'epic' | 'legendary';
    description?: string;
    count?: number;
  };
  empty?: boolean;
  onClick?: () => void;
  onDrop?: (item: any) => void;
  className?: string;
}

const rarityColors = {
  common: 'border-gray-400',
  rare: 'border-blue-400',
  epic: 'border-purple-400',
  legendary: 'border-yellow-400'
};

const rarityGlow = {
  common: 'shadow-gray-500/20',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/40',
  legendary: 'shadow-yellow-500/50'
};

export default function InventorySlot({ 
  item, 
  empty = false, 
  onClick, 
  onDrop,
  className = ""
}: InventorySlotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggedOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggedOver(false);
    
    try {
      const droppedItem = JSON.parse(e.dataTransfer.getData('application/json'));
      onDrop?.(droppedItem);
    } catch (error) {
      console.error('Failed to parse dropped item:', error);
    }
  };

  return (
    <div 
      className={`
        relative w-16 h-16 rounded-lg border-2 border-dashed
        transition-all duration-200 cursor-pointer
        ${empty || !item ? 'border-gray-600 hover:border-gray-500' : ''}
        ${item ? `border-solid ${rarityColors[item.rarity || 'common']} ${rarityGlow[item.rarity || 'common']}` : ''}
        ${isHovered ? 'scale-105' : 'scale-100'}
        ${isDraggedOver ? 'border-yellow-400 bg-yellow-400/10' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {item ? (
        <>
          {/* Item Icon */}
          <div className="w-full h-full flex items-center justify-center text-2xl">
            {item.icon}
          </div>

          {/* Count Badge */}
          {item.count && item.count > 1 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {item.count}
            </div>
          )}

          {/* Rarity Glow */}
          <div className={`
            absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            ${rarityGlow[item.rarity || 'common']}
          `} />

          {/* Tooltip */}
          <div className={`
            absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
            bg-gray-800 text-white text-xs rounded-lg px-3 py-2
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            pointer-events-none z-50
            shadow-xl border border-white/10
            whitespace-nowrap
          `}>
            <div className="font-semibold">{item.name}</div>
            {item.description && (
              <div className="text-gray-300">{item.description}</div>
            )}
            
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
          </div>
        </>
      ) : (
        /* Empty Slot */
        <div className="w-full h-full flex items-center justify-center text-gray-600">
          <span className="text-2xl opacity-50">+</span>
        </div>
      )}
    </div>
  );
}
