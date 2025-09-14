import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { 
  MessageCircle, 
  Dice1, 
  BookOpen, 
  Wand2, 
  Save, 
  Upload, 
  Download,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface DialogueToolbarProps {
  onNodeTypeSelect: (type: 'dialogue' | 'skill_check' | 'narrative') => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onAIGenerate: () => void;
  onPlay: () => void;
  onReset: () => void;
  className?: string;
}

export default function DialogueToolbar({
  onNodeTypeSelect,
  onSave,
  onLoad,
  onExport,
  onAIGenerate,
  onPlay,
  onReset,
  className
}: DialogueToolbarProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    onPlay();
  };

  const nodeTypes = [
    {
      type: 'dialogue' as const,
      label: 'Dialogue',
      icon: MessageCircle,
      description: 'Character dialogue with choices',
      color: 'text-blue-400',
      bgColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      type: 'skill_check' as const,
      label: 'Skill Check',
      icon: Dice1,
      description: 'Disco Elysium style skill check',
      color: 'text-red-400',
      bgColor: 'bg-red-600 hover:bg-red-700'
    },
    {
      type: 'narrative' as const,
      label: 'Narrative',
      icon: BookOpen,
      description: 'Descriptive text or scene',
      color: 'text-gray-400',
      bgColor: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  return (
    <div className={cn(
      "bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4",
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Node Types */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white mr-4">Add Node:</span>
          {nodeTypes.map((nodeType) => (
            <button
              key={nodeType.type}
              onClick={() => onNodeTypeSelect(nodeType.type)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:scale-105",
                nodeType.bgColor
              )}
              title={nodeType.description}
            >
              <nodeType.icon className="w-4 h-4" />
              {nodeType.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* AI Generation */}
          <button
            onClick={onAIGenerate}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
            title="Generate content with AI"
          >
            <Wand2 className="w-4 h-4" />
            AI Generate
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlay}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105",
              isPlaying 
                ? "bg-yellow-600 hover:bg-yellow-700" 
                : "bg-green-600 hover:bg-green-700"
            )}
            title={isPlaying ? "Pause dialogue" : "Play dialogue"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Play
              </>
            )}
          </button>

          {/* Save */}
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
            title="Save dialogue tree"
          >
            <Save className="w-4 h-4" />
            Save
          </button>

          {/* Load */}
          <button
            onClick={onLoad}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
            title="Load dialogue tree"
          >
            <Upload className="w-4 h-4" />
            Load
          </button>

          {/* Export */}
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
            title="Export dialogue tree"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
            title="Reset dialogue tree"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          {/* Settings */}
          <button
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
            title="Dialogue settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          💡 <strong>Tip:</strong> Drag nodes from the toolbar above to the canvas to create dialogue elements. 
          Connect nodes by dragging from one node to another.
        </div>
      </div>
    </div>
  );
}


