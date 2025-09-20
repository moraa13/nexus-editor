import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import type { GameTheme } from '../../types/theme';

interface InventoryPanelProps {
  theme: GameTheme;
}

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  quantity: number;
  type: 'weapon' | 'armor' | 'consumable' | 'key' | 'misc';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export default function InventoryPanel({ theme }: InventoryPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Моковые данные инвентаря
  const mockItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Ржавый нож',
      description: 'Старый, но острый нож. Может пригодиться в драке.',
      icon: '🗡️',
      quantity: 1,
      type: 'weapon',
      rarity: 'common'
    },
    {
      id: '2',
      name: 'Ключ от квартиры',
      description: 'Ключ от вашей старой квартиры. Воспоминания...',
      icon: '🗝️',
      quantity: 1,
      type: 'key',
      rarity: 'common'
    },
    {
      id: '3',
      name: 'Аптечка',
      description: 'Медицинская аптечка. Восстанавливает здоровье.',
      icon: '🏥',
      quantity: 3,
      type: 'consumable',
      rarity: 'uncommon'
    },
    {
      id: '4',
      name: 'Кожаная куртка',
      description: 'Стильная кожаная куртка. Защищает от холода и ударов.',
      icon: '🧥',
      quantity: 1,
      type: 'armor',
      rarity: 'rare'
    },
    {
      id: '5',
      name: 'Загадочный артефакт',
      description: 'Странный предмет неизвестного происхождения. Светится в темноте.',
      icon: '💎',
      quantity: 1,
      type: 'misc',
      rarity: 'legendary'
    }
  ];

  const categories = [
    { id: 'all', name: 'Все', icon: '📦' },
    { id: 'weapon', name: 'Оружие', icon: '⚔️' },
    { id: 'armor', name: 'Броня', icon: '🛡️' },
    { id: 'consumable', name: 'Расходники', icon: '🧪' },
    { id: 'key', name: 'Ключи', icon: '🗝️' },
    { id: 'misc', name: 'Разное', icon: '📋' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? mockItems 
    : mockItems.filter(item => item.type === selectedCategory);

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: theme.colors.textSecondary,
      uncommon: theme.colors.success,
      rare: theme.colors.primary,
      epic: theme.colors.accent,
      legendary: theme.colors.warning
    };
    return colors[rarity as keyof typeof colors] || theme.colors.textSecondary;
  };

  return (
    <div className="h-full flex">
      {/* Categories Sidebar */}
      <div 
        className="w-48 p-4 border-r"
        style={{ 
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border 
        }}
      >
        <h3 
          className="text-lg font-semibold mb-4"
          style={{ 
            color: theme.colors.text,
            fontFamily: theme.fonts.primary 
          }}
        >
          Категории
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'ghost'}
              onClick={() => setSelectedCategory(category.id)}
              className="w-full justify-start"
              style={{
                backgroundColor: selectedCategory === category.id 
                  ? theme.colors.primary 
                  : 'transparent',
                color: theme.colors.text,
                borderColor: theme.colors.border,
                fontFamily: theme.fonts.primary
              }}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 
            className="text-lg font-semibold"
            style={{ 
              color: theme.colors.text,
              fontFamily: theme.fonts.primary 
            }}
          >
            Инвентарь ({filteredItems.length})
          </h3>
          <div 
            className="text-sm"
            style={{ 
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.secondary 
            }}
          >
            Вес: 15/50 кг
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              variant="elevated"
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelectedItem(item)}
              style={{
                backgroundColor: theme.colors.surface,
                borderWidth: '2px',
                borderColor: getRarityColor(item.rarity)
              }}
            >
              <div className="p-3 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 
                  className="font-medium text-sm mb-1"
                  style={{ 
                    color: theme.colors.text,
                    fontFamily: theme.fonts.primary 
                  }}
                >
                  {item.name}
                </h4>
                {item.quantity > 1 && (
                  <div 
                    className="text-xs"
                    style={{ 
                      color: theme.colors.textSecondary,
                      fontFamily: theme.fonts.secondary 
                    }}
                  >
                    x{item.quantity}
                  </div>
                )}
                <div 
                  className="text-xs mt-1 px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: getRarityColor(item.rarity),
                    color: theme.colors.background,
                    fontFamily: theme.fonts.secondary 
                  }}
                >
                  {item.rarity}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div 
            className="text-center py-8"
            style={{ color: theme.colors.textSecondary }}
          >
            <div className="text-4xl mb-2">📦</div>
            <p>В этой категории нет предметов</p>
          </div>
        )}
      </div>

      {/* Item Details Panel */}
      {selectedItem && (
        <div 
          className="w-80 p-4 border-l"
          style={{ 
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border 
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 
              className="text-lg font-semibold"
              style={{ 
                color: theme.colors.text,
                fontFamily: theme.fonts.primary 
              }}
            >
              {selectedItem.name}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedItem(null)}
              style={{ color: theme.colors.textSecondary }}
            >
              ✕
            </Button>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <div 
                className="text-4xl mb-2"
                style={{ 
                  border: `2px solid ${getRarityColor(selectedItem.rarity)}`,
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'inline-block'
                }}
              >
                {selectedItem.icon}
              </div>
              <div 
                className="text-sm px-2 py-1 rounded inline-block"
                style={{ 
                  backgroundColor: getRarityColor(selectedItem.rarity),
                  color: theme.colors.background,
                  fontFamily: theme.fonts.secondary 
                }}
              >
                {selectedItem.rarity}
              </div>
            </div>

            <div>
              <p 
                className="text-sm"
                style={{ 
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fonts.secondary 
                }}
              >
                {selectedItem.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span 
                  className="text-sm"
                  style={{ 
                    color: theme.colors.textSecondary,
                    fontFamily: theme.fonts.secondary 
                  }}
                >
                  Тип:
                </span>
                <span 
                  className="text-sm"
                  style={{ 
                    color: theme.colors.text,
                    fontFamily: theme.fonts.primary 
                  }}
                >
                  {selectedItem.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span 
                  className="text-sm"
                  style={{ 
                    color: theme.colors.textSecondary,
                    fontFamily: theme.fonts.secondary 
                  }}
                >
                  Количество:
                </span>
                <span 
                  className="text-sm"
                  style={{ 
                    color: theme.colors.text,
                    fontFamily: theme.fonts.primary 
                  }}
                >
                  {selectedItem.quantity}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                className="flex-1"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background,
                  fontFamily: theme.fonts.primary
                }}
              >
                Использовать
              </Button>
              <Button
                variant="secondary"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  fontFamily: theme.fonts.primary
                }}
              >
                Выбросить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
