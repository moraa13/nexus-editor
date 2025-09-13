import { useState, useEffect } from 'react';
import CharacterCard from './CharacterCard';
import InventorySlot from '../ui/InventorySlot';
import { api } from '../../lib/api';

interface Character {
  id: string;
  name: string;
  portrait?: string;
  stats: {
    logic: number;
    empathy: number;
    endurance: number;
    composure: number;
    [key: string]: number;
  };
  level: number;
  xp: number;
  maxXp: number;
}

interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description?: string;
  count?: number;
}

interface InventoryPanelProps {
  projectId?: string;
  selectedCharacterId?: string;
  onCharacterSelect?: (characterId: string) => void;
}

export default function InventoryPanel({ 
  projectId, 
  selectedCharacterId,
  onCharacterSelect 
}: InventoryPanelProps) {
  const [activeTab, setActiveTab] = useState<'characters' | 'skills' | 'items' | 'quests'>('characters');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    // Mock data for now - replace with actual API calls
    const mockCharacters: Character[] = [
      {
        id: '1',
        name: 'Alex the Brave',
        portrait: '🧙‍♂️',
        stats: {
          logic: 12,
          empathy: 15,
          endurance: 8,
          composure: 10,
          perception: 14,
          authority: 6,
          rhetoric: 11,
          drama: 9
        },
        level: 5,
        xp: 750,
        maxXp: 1000
      },
      {
        id: '2',
        name: 'Maya the Wise',
        portrait: '🧙‍♀️',
        stats: {
          logic: 16,
          empathy: 13,
          endurance: 7,
          composure: 14,
          perception: 12,
          authority: 11,
          rhetoric: 15,
          drama: 10
        },
        level: 7,
        xp: 1200,
        maxXp: 1500
      }
    ];

    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Logic Crystal',
        icon: '💎',
        rarity: 'rare',
        description: 'Boosts logical thinking',
        count: 3
      },
      {
        id: '2',
        name: 'Empathy Potion',
        icon: '🧪',
        rarity: 'common',
        description: 'Increases understanding',
        count: 1
      },
      {
        id: '3',
        name: 'Legendary Sword',
        icon: '⚔️',
        rarity: 'legendary',
        description: 'Ultimate weapon of truth',
        count: 1
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setCharacters(mockCharacters);
      setInventory(mockInventory);
      setIsLoading(false);
    }, 500);

    // TODO: Replace with actual API calls
    // api.get(`/projects/${projectId}/characters/`).then(response => {
    //   setCharacters(response.data);
    //   setIsLoading(false);
    // }).catch(() => {
    //   setIsLoading(false);
    // });
  }, [projectId]);

  const tabs = [
    { id: 'characters', label: 'Heroes', icon: '👥', count: characters.length },
    { id: 'skills', label: 'Skills', icon: '⭐', count: 24 },
    { id: 'items', label: 'Items', icon: '🎒', count: inventory.length },
    { id: 'quests', label: 'Quests', icon: '🎯', count: 0 }
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'characters':
        return (
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-xl" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded mb-2" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="h-8 bg-gray-700 rounded" />
                    ))}
                  </div>
                </div>
              ))
            ) : characters.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-700/50 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                  👥
                </div>
                <div className="text-white font-semibold mb-2">No Heroes Yet</div>
                <div className="text-gray-400 text-sm mb-4">Create your first character to start the adventure</div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Create Hero
                </button>
              </div>
            ) : (
              characters.map(character => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  isSelected={selectedCharacterId === character.id}
                  onClick={() => onCharacterSelect?.(character.id)}
                  onStatClick={(statName) => console.log('Stat clicked:', statName)}
                />
              ))
            )}
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-3">
            <div className="text-white font-semibold mb-4">Character Skills</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Logic', icon: '🧠', value: 12, color: 'text-blue-400' },
                { name: 'Empathy', icon: '❤️', value: 15, color: 'text-red-400' },
                { name: 'Endurance', icon: '💪', value: 8, color: 'text-green-400' },
                { name: 'Composure', icon: '😌', value: 10, color: 'text-purple-400' },
                { name: 'Perception', icon: '👁️', value: 14, color: 'text-yellow-400' },
                { name: 'Authority', icon: '👑', value: 6, color: 'text-orange-400' },
                { name: 'Rhetoric', icon: '💬', value: 11, color: 'text-cyan-400' },
                { name: 'Drama', icon: '🎭', value: 9, color: 'text-pink-400' }
              ].map((skill, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{skill.icon}</span>
                    <span className="text-white text-sm font-medium">{skill.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-bold ${skill.color}`}>{skill.value}</span>
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${(skill.value / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'items':
        return (
          <div className="space-y-4">
            <div className="text-white font-semibold mb-4">Inventory</div>
            <div className="grid grid-cols-4 gap-3">
              {inventory.map(item => (
                <InventorySlot
                  key={item.id}
                  item={item}
                  onClick={() => console.log('Item clicked:', item.name)}
                />
              ))}
              {/* Empty slots */}
              {Array.from({ length: 8 - inventory.length }).map((_, i) => (
                <InventorySlot key={`empty-${i}`} empty />
              ))}
            </div>
          </div>
        );

      case 'quests':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-700/50 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
              🎯
            </div>
            <div className="text-white font-semibold mb-2">No Active Quests</div>
            <div className="text-gray-400 text-sm mb-4">Complete dialogues to unlock quests</div>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              Create Quest
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="text-white font-bold text-lg mb-2">Hero's Inventory</div>
        <div className="text-gray-400 text-sm">Manage your characters and items</div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-4 py-3 text-sm font-medium transition-all duration-200
              ${activeTab === tab.id 
                ? 'text-white bg-white/10 border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-4">
        {renderTabContent()}
      </div>
    </div>
  );
}

