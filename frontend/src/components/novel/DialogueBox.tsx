import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import type { GameTheme } from '../../types/theme';

interface DialogueBoxProps {
  theme: GameTheme;
  currentScene?: any;
  onSceneChange?: (sceneId: string) => void;
}

interface DialogueOption {
  id: string;
  text: string;
  consequence?: string;
  nextSceneId?: string;
}

export default function DialogueBox({ theme, currentScene, onSceneChange }: DialogueBoxProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [dialogueHistory, setDialogueHistory] = useState<string[]>([]);

  // Моковые данные для демонстрации
  const mockDialogue = {
    text: "Вы стоите в темном переулке. Впереди виднеется тусклый свет неоновой вывески. Что вы делаете?",
    options: [
      {
        id: '1',
        text: 'Подойти к вывеске',
        consequence: 'Вы приближаетесь к источнику света...',
        nextSceneId: 'scene2'
      },
      {
        id: '2',
        text: 'Остаться в тени',
        consequence: 'Вы решаете остаться незамеченным...',
        nextSceneId: 'scene3'
      },
      {
        id: '3',
        text: 'Проверить окружение',
        consequence: 'Вы внимательно осматриваетесь...',
        nextSceneId: 'scene4'
      }
    ]
  };

  const handleOptionSelect = (option: DialogueOption) => {
    setSelectedOption(option.id);
    
    // Добавляем выбор в историю
    setDialogueHistory(prev => [...prev, option.text]);
    
    // Показываем последствие
    setTimeout(() => {
      if (option.consequence) {
        setDialogueHistory(prev => [...prev, option.consequence!]);
      }
      
      // Переходим к следующей сцене
      if (option.nextSceneId && onSceneChange) {
        setTimeout(() => {
          onSceneChange(option.nextSceneId!);
          setSelectedOption(null);
        }, 2000);
      }
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Dialogue History */}
      <div 
        className="flex-1 overflow-y-auto p-4 mb-4 rounded-lg"
        style={{ 
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <div className="space-y-3">
          {/* Main dialogue text */}
          <div 
            className="p-4 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.background,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <p 
              className="text-lg leading-relaxed"
              style={{ 
                color: theme.colors.text,
                fontFamily: theme.fonts.primary 
              }}
            >
              {mockDialogue.text}
            </p>
          </div>

          {/* Dialogue history */}
          {dialogueHistory.map((text, index) => (
            <div 
              key={index}
              className="p-3 rounded-lg"
              style={{ 
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                opacity: 0.7
              }}
            >
              <p 
                className="text-sm"
                style={{ 
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fonts.secondary 
                }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dialogue Options */}
      <div className="space-y-2">
        {mockDialogue.options.map((option) => (
          <Button
            key={option.id}
            variant={selectedOption === option.id ? 'primary' : 'secondary'}
            onClick={() => handleOptionSelect(option)}
            disabled={selectedOption !== null}
            className="w-full text-left justify-start p-4 h-auto"
            style={{
              backgroundColor: selectedOption === option.id 
                ? theme.colors.accent 
                : theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border,
              fontFamily: theme.fonts.primary,
              opacity: selectedOption !== null && selectedOption !== option.id ? 0.5 : 1
            }}
          >
            <div>
              <p className="font-medium">{option.text}</p>
              {option.consequence && (
                <p 
                  className="text-sm mt-1"
                  style={{ 
                    color: theme.colors.textSecondary,
                    fontFamily: theme.fonts.secondary 
                  }}
                >
                  {option.consequence}
                </p>
              )}
            </div>
          </Button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          variant="ghost"
          size="sm"
          style={{ 
            color: theme.colors.textSecondary,
            borderColor: theme.colors.border
          }}
        >
          ⏭️ Пропустить
        </Button>
        <Button
          variant="ghost"
          size="sm"
          style={{ 
            color: theme.colors.textSecondary,
            borderColor: theme.colors.border
          }}
        >
          📖 История
        </Button>
        <Button
          variant="ghost"
          size="sm"
          style={{ 
            color: theme.colors.textSecondary,
            borderColor: theme.colors.border
          }}
        >
          ⚙️ Настройки
        </Button>
      </div>
    </div>
  );
}
