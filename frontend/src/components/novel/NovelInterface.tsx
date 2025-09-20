import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import InventoryPanel from './InventoryPanel';
import CharacterPanel from './CharacterPanel';
import DialogueBox from './DialogueBox';
import type { GameTheme } from '../../types/theme';
import type { ProjectSettings } from '../../types/project';

interface NovelInterfaceProps {
  project: ProjectSettings;
  theme: GameTheme;
  currentScene?: any;
  onSceneChange?: (sceneId: string) => void;
}

export default function NovelInterface({ 
  project, 
  theme, 
  currentScene,
  onSceneChange 
}: NovelInterfaceProps) {
  const [activePanel, setActivePanel] = useState<'dialogue' | 'inventory' | 'character'>('dialogue');
  const [showInventory, setShowInventory] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);

  const themeStyles = {
    '--theme-primary': theme.colors.primary,
    '--theme-secondary': theme.colors.secondary,
    '--theme-accent': theme.colors.accent,
    '--theme-background': theme.colors.background,
    '--theme-surface': theme.colors.surface,
    '--theme-text': theme.colors.text,
    '--theme-text-secondary': theme.colors.textSecondary,
    '--theme-border': theme.colors.border,
    '--theme-success': theme.colors.success,
    '--theme-warning': theme.colors.warning,
    '--theme-error': theme.colors.error,
  } as React.CSSProperties;

  return (
    <div 
      className="h-screen w-full overflow-hidden"
      style={themeStyles}
    >
      {/* Main Game Area */}
      <div className="h-full flex flex-col">
        {/* Top Bar */}
        <div 
          className="h-16 flex items-center justify-between px-4 border-b"
          style={{ 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border 
          }}
        >
          <div className="flex items-center gap-4">
            <h1 
              className="text-xl font-bold"
              style={{ 
                color: theme.colors.text,
                fontFamily: theme.fonts.primary 
              }}
            >
              {project.name}
            </h1>
            <div className="flex gap-2">
              <Button
                variant={activePanel === 'dialogue' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActivePanel('dialogue')}
                style={{ 
                  backgroundColor: activePanel === 'dialogue' ? theme.colors.primary : 'transparent',
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }}
              >
                Диалог
              </Button>
              <Button
                variant={activePanel === 'inventory' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActivePanel('inventory')}
                style={{ 
                  backgroundColor: activePanel === 'inventory' ? theme.colors.primary : 'transparent',
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }}
              >
                Инвентарь
              </Button>
              <Button
                variant={activePanel === 'character' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActivePanel('character')}
                style={{ 
                  backgroundColor: activePanel === 'character' ? theme.colors.primary : 'transparent',
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }}
              >
                Персонаж
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInventory(true)}
              style={{ 
                color: theme.colors.text,
                borderColor: theme.colors.border
              }}
            >
              📦 Инвентарь
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCharacter(true)}
              style={{ 
                color: theme.colors.text,
                borderColor: theme.colors.border
              }}
            >
              👤 Персонаж
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Left Panel - Character/Scene Image */}
          <div 
            className="w-1/3 p-4 border-r"
            style={{ 
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border 
            }}
          >
            <Card 
              variant="elevated"
              style={{ 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                height: '100%'
              }}
            >
              <div className="h-full flex flex-col items-center justify-center">
                <div 
                  className="w-32 h-32 rounded-full mb-4 flex items-center justify-center text-4xl"
                  style={{ 
                    backgroundColor: theme.colors.accent,
                    color: theme.colors.background
                  }}
                >
                  {project.character?.name?.[0] || '👤'}
                </div>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ 
                    color: theme.colors.text,
                    fontFamily: theme.fonts.primary 
                  }}
                >
                  {project.character?.name || 'Главный герой'}
                </h3>
                <p 
                  className="text-sm text-center"
                  style={{ 
                    color: theme.colors.textSecondary,
                    fontFamily: theme.fonts.secondary 
                  }}
                >
                  {currentScene?.location || 'Локация не указана'}
                </p>
              </div>
            </Card>
          </div>

          {/* Right Panel - Dialogue/Content */}
          <div 
            className="flex-1 p-4"
            style={{ backgroundColor: theme.colors.background }}
          >
            {activePanel === 'dialogue' && (
              <DialogueBox 
                theme={theme}
                currentScene={currentScene}
                onSceneChange={onSceneChange}
              />
            )}
            {activePanel === 'inventory' && (
              <InventoryPanel theme={theme} />
            )}
            {activePanel === 'character' && (
              <CharacterPanel 
                theme={theme}
                character={project.character}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showInventory && (
        <Modal
          isOpen={showInventory}
          onClose={() => setShowInventory(false)}
          title="Инвентарь"
          size="large"
        >
          <InventoryPanel theme={theme} />
        </Modal>
      )}

      {showCharacter && (
        <Modal
          isOpen={showCharacter}
          onClose={() => setShowCharacter(false)}
          title="Персонаж"
          size="large"
        >
          <CharacterPanel 
            theme={theme}
            character={project.character}
          />
        </Modal>
      )}
    </div>
  );
}
