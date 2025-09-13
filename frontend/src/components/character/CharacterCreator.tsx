import { useState, useMemo } from 'react';
import { 
  CHARACTER_STATS, 
  STAT_CATEGORIES, 
  CHARACTER_CREATION, 
  type DiscoElysiumCharacter,
  type DiscoElysiumStat,
  generateId 
} from '../../types/discoElysium';

interface CharacterCreatorProps {
  onSave?: (character: DiscoElysiumCharacter) => void;
  onCancel?: () => void;
  compact?: boolean;
  onStatSelect?: (stat: string, description: string, history: string, skills: string[]) => void;
}

export default function CharacterCreator({ onSave, onCancel, compact = false, onStatSelect }: CharacterCreatorProps) {
  const [characterName, setCharacterName] = useState('Герой');
  const [selectedStat, setSelectedStat] = useState<keyof typeof CHARACTER_STATS | null>(null);
  const [stats, setStats] = useState<Record<string, number>>(() => {
    const initialStats: Record<string, number> = {};
    // Initialize with specific values as shown in the mockup
    initialStats['logic'] = 4;
    initialStats['rhetoric'] = 2;
    initialStats['analysis'] = 3;
    initialStats['empathy'] = 5;
    initialStats['volition'] = 1;
    initialStats['intuition'] = 3;
    initialStats['endurance'] = 6;
    initialStats['dexterity'] = 2;
    initialStats['shivers'] = CHARACTER_CREATION.DEFAULT_STAT_VALUE;
    initialStats['impulse'] = CHARACTER_CREATION.DEFAULT_STAT_VALUE;
    initialStats['perception'] = CHARACTER_CREATION.DEFAULT_STAT_VALUE;
    initialStats['composure'] = CHARACTER_CREATION.DEFAULT_STAT_VALUE;
    return initialStats;
  });

  // Calculate total points used
  const totalPointsUsed = useMemo(() => {
    return Object.values(stats).reduce((sum, value) => sum + value, 0);
  }, [stats]);

  // Calculate remaining points
  const remainingPoints = CHARACTER_CREATION.TOTAL_POINTS - totalPointsUsed;

  // Update stat value
  const updateStat = (statKey: string, value: number) => {
    if (value < CHARACTER_CREATION.MIN_STAT_VALUE || value > CHARACTER_CREATION.MAX_STAT_VALUE) {
      return;
    }

    const newStats = { ...stats };
    newStats[statKey] = value;
    
    // Check if we have enough points
    const newTotal = Object.values(newStats).reduce((sum, val) => sum + val, 0);
    if (newTotal <= CHARACTER_CREATION.TOTAL_POINTS) {
      setStats(newStats);
    }
  };

  // Increment stat
  const incrementStat = (statKey: string) => {
    const currentValue = stats[statKey];
    if (currentValue < CHARACTER_CREATION.MAX_STAT_VALUE && remainingPoints > 0) {
      updateStat(statKey, currentValue + 1);
    }
  };

  // Decrement stat
  const decrementStat = (statKey: string) => {
    const currentValue = stats[statKey];
    if (currentValue > CHARACTER_CREATION.MIN_STAT_VALUE) {
      updateStat(statKey, currentValue - 1);
    }
  };

  // Create character object
  const createCharacter = (): DiscoElysiumCharacter => {
    const characterStats: DiscoElysiumCharacter['stats'] = {} as any;
    
    Object.entries(stats).forEach(([statKey, value]) => {
      const statDef = CHARACTER_STATS[statKey as keyof typeof CHARACTER_STATS];
      const category = STAT_CATEGORIES[statDef.category];
      
      characterStats[statKey as keyof DiscoElysiumCharacter['stats']] = {
        id: generateId('stat'),
        name: statDef.name,
        shortName: statDef.shortName,
        category: statDef.category,
        description: statDef.description,
        color: category.color,
        icon: statDef.icon,
        value: value,
        modifier: value - 5, // Modifier for 0-10 range
        isActive: true,
        isLocked: false
      };
    });

    return {
      id: generateId('character'),
      name: characterName || 'Безымянный персонаж',
      stats: characterStats,
      level: 1,
      experience: 0,
      experienceToNext: 100,
      health: 100,
      maxHealth: 100,
      morale: 100,
      maxMorale: 100
    };
  };

  // Handle save
  const handleSave = () => {
    if (characterName.trim()) {
      const character = createCharacter();
      onSave?.(character);
    }
  };

  // Render stat with slider
  const renderStat = (statKey: keyof typeof CHARACTER_STATS, color: string) => {
    const stat = CHARACTER_STATS[statKey];
    const currentValue = stats[statKey];
    
    return (
      <div key={statKey} className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-2xl">{stat.icon}</span>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-white mb-1">{stat.name}</h4>
            <p className="text-sm text-gray-300">{stat.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => decrementStat(statKey)}
            disabled={currentValue <= CHARACTER_CREATION.MIN_STAT_VALUE}
            className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 disabled:from-gray-800 disabled:to-gray-700 disabled:text-gray-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
          >
            −
          </button>
          
          <div className="flex-1 relative">
            <input
              type="range"
              min={CHARACTER_CREATION.MIN_STAT_VALUE}
              max={CHARACTER_CREATION.MAX_STAT_VALUE}
              value={currentValue}
              onChange={(e) => updateStat(statKey, parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer slider transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(to right, ${color} 0%, ${color} ${(currentValue / CHARACTER_CREATION.MAX_STAT_VALUE) * 100}%, #374151 ${(currentValue / CHARACTER_CREATION.MAX_STAT_VALUE) * 100}%, #374151 100%)`,
                boxShadow: `0 0 10px ${color}40, inset 0 2px 4px rgba(0,0,0,0.2)`
              }}
            />
          </div>
          
          <div className="w-8 text-center">
            <span className="text-lg font-bold text-white">{currentValue}</span>
            <div className="w-2 h-2 bg-gray-400 rounded-full mx-auto mt-1"></div>
          </div>
        </div>
      </div>
    );
  };

  // Render compact stat for mini windows
  const renderCompactStat = (statKey: keyof typeof CHARACTER_STATS, color: string) => {
    const stat = CHARACTER_STATS[statKey];
    const currentValue = stats[statKey];
    
    return (
      <div 
        key={statKey} 
        className={`mb-3 p-2 rounded cursor-pointer transition-all duration-200 ${
          selectedStat === statKey ? 'bg-gray-600 shadow-lg' : 'hover:bg-gray-700 hover:shadow-md'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedStat(statKey);
          onStatSelect?.(stat.name, stat.description, stat.history, stat.skills);
        }}
        title={`${stat.icon} ${stat.name} — ${stat.description}`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">{stat.icon}</span>
          <span className="text-xs font-medium text-white">{stat.name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              decrementStat(statKey);
            }}
            disabled={currentValue <= CHARACTER_CREATION.MIN_STAT_VALUE}
            className="w-5 h-5 bg-gradient-to-br from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 disabled:from-gray-700 disabled:to-gray-600 disabled:text-gray-500 text-white rounded-full flex items-center justify-center transition-all duration-200 text-xs hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
          >
            −
          </button>
          
          <div className="flex-1 relative">
            <input
              type="range"
              min={CHARACTER_CREATION.MIN_STAT_VALUE}
              max={CHARACTER_CREATION.MAX_STAT_VALUE}
              value={currentValue}
              onChange={(e) => updateStat(statKey, parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer slider transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(to right, ${color} 0%, ${color} ${(currentValue / CHARACTER_CREATION.MAX_STAT_VALUE) * 100}%, #4B5563 ${(currentValue / CHARACTER_CREATION.MAX_STAT_VALUE) * 100}%, #4B5563 100%)`,
                boxShadow: `0 0 8px ${color}30, inset 0 1px 2px rgba(0,0,0,0.2)`
              }}
            />
          </div>
          
          <span className="text-sm font-bold text-white w-4 text-center transition-all duration-200 hover:scale-110">{currentValue}</span>
        </div>
      </div>
    );
  };

  const containerClasses = compact 
    ? "p-6"
    : "min-h-screen bg-gray-900 text-white";
    
  const wrapperClasses = compact 
    ? ""
    : "max-w-4xl mx-auto p-6";

  return (
    <div className={containerClasses}>
      <div className={wrapperClasses}>
        {/* Header */}
        <div className={`flex items-center justify-between ${compact ? 'mb-4' : 'mb-8'}`}>
          <div className="flex items-center gap-3">
            {compact && (
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-white text-lg transition-colors"
              >
                ←
              </button>
            )}
            <h1 className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-white`}>Создать персонажа</h1>
          </div>
          {!compact && (
            <div className="text-lg font-semibold text-gray-300">NEXUS ADVENTURE</div>
          )}
        </div>
        
        {/* Character Name */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-white mb-3">
            Имя персонажа
          </label>
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Герой"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>

        {/* Stats Categories */}
        {compact ? (
          <div className="grid grid-cols-2 gap-4">
            {/* Intellect */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-300 mb-3">ИНТЕЛЛЕКТ</h3>
              {renderCompactStat('logic', '#3B82F6')}
              {renderCompactStat('rhetoric', '#3B82F6')}
              {renderCompactStat('analysis', '#3B82F6')}
            </div>
            
            {/* Psyche */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-300 mb-3">ПСИХИКА</h3>
              {renderCompactStat('empathy', '#8B5CF6')}
              {renderCompactStat('volition', '#8B5CF6')}
              {renderCompactStat('intuition', '#8B5CF6')}
            </div>
            
            {/* Physique */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-red-300 mb-3">ФИЗИКА</h3>
              {renderCompactStat('endurance', '#EF4444')}
              {renderCompactStat('shivers', '#EF4444')}
              {renderCompactStat('impulse', '#EF4444')}
            </div>
            
            {/* Motorics */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-300 mb-3">МОТОРИКА</h3>
              {renderCompactStat('perception', '#10B981')}
              {renderCompactStat('dexterity', '#10B981')}
              {renderCompactStat('composure', '#10B981')}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Intellect and Creativity */}
            <div>
              <h3 className="text-lg font-semibold text-blue-300 mb-6">ИНТЕЛЛЕКТ И ТВОРЧЕСТВО</h3>
              {renderStat('logic', '#3B82F6')}
              {renderStat('rhetoric', '#3B82F6')}
              {renderStat('analysis', '#3B82F6')}
            </div>
            
            {/* Psyche */}
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-6">ПСИХИКА</h3>
              {renderStat('empathy', '#8B5CF6')}
              {renderStat('volition', '#8B5CF6')}
              {renderStat('intuition', '#EF4444')}
              {renderStat('endurance', '#F97316')}
              {renderStat('dexterity', '#10B981')}
            </div>
          </div>
        )}

        {/* Footer */}
        {compact ? (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-white">
              Очков: <span className="font-bold">{remainingPoints}</span>
            </div>
            
            <button
              onClick={handleSave}
              disabled={!characterName.trim() || remainingPoints !== 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400 text-white rounded-lg transition-colors text-sm font-semibold"
            >
              Сохранить
            </button>
          </div>
        ) : (
          <div className="fixed bottom-6 left-6 right-6 flex items-center justify-between">
            <div className="text-lg text-white">
              Очков: <span className="font-bold">{remainingPoints}</span>
            </div>
            
            <button
              onClick={handleSave}
              disabled={!characterName.trim() || remainingPoints !== 0}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400 text-white rounded-lg transition-colors text-lg font-semibold"
            >
              Сохранить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
