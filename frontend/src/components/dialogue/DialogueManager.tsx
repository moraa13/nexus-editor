import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { toast } from '../ui/SimpleToast';
import DialogueRollResult from './DialogueRollResult';
import CharacterStats, { CompactCharacterStats } from '../ui/CharacterStats';
import { 
  generateCachedOptions, 
  rollAndGetDialogueOption, 
  validateCachedOptions,
  type CachedDialogueOptions 
} from '../../utils/diceSystem';
import type { 
  DiscoElysiumCharacter, 
  DialogueNode, 
  RollResult 
} from '../../types/discoElysium';
import { 
  Dice1, 
  RefreshCw, 
  Settings, 
  Eye, 
  EyeOff,
  Zap,
  Target,
  Brain,
  Heart
} from 'lucide-react';

interface DialogueManagerProps {
  character: DiscoElysiumCharacter;
  dialogueNode: DialogueNode;
  onDialogueComplete: (selectedOption: string, rollResult: RollResult) => void;
  className?: string;
}

export default function DialogueManager({
  character,
  dialogueNode,
  onDialogueComplete,
  className
}: DialogueManagerProps) {
  const [cachedOptions, setCachedOptions] = useState<CachedDialogueOptions | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRollDetails, setShowRollDetails] = useState(false);
  const [selectedStat, setSelectedStat] = useState<keyof DiscoElysiumCharacter['stats']>('logic');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Trivial' | 'Easy' | 'Medium' | 'Hard' | 'Extreme' | 'Impossible'>('Medium');
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);

  // Generate cached options when dialogue node changes
  useEffect(() => {
    if (dialogueNode && dialogueNode.skillCheck) {
      generateOptions();
    }
  }, [dialogueNode]);

  const generateOptions = useCallback(async () => {
    if (!dialogueNode.skillCheck) return;

    setIsGenerating(true);
    
    try {
      const options = generateCachedOptions(
        dialogueNode.id,
        character.id,
        dialogueNode.skillCheck.stat,
        {
          character: character.name,
          situation: dialogueNode.text,
          previousDialogue: [], // Would be populated from dialogue history
          characterPersonality: 'Curious and analytical',
          mood: 'Neutral'
        }
      );
      
      setCachedOptions(options);
      toast.success('Dialogue options generated!');
    } catch (error) {
      toast.error('Failed to generate dialogue options');
      console.error('Error generating options:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [dialogueNode, character]);

  const performRoll = useCallback(() => {
    if (!cachedOptions || !dialogueNode.skillCheck) return;

    const { rollResult, optionType, selectedOption, statInfo } = rollAndGetDialogueOption(
      character,
      selectedStat,
      selectedDifficulty,
      cachedOptions
    );

    setRollHistory(prev => [rollResult, ...prev.slice(0, 9)]); // Keep last 10 rolls

    // Auto-complete dialogue after a short delay
    setTimeout(() => {
      onDialogueComplete(selectedOption, rollResult);
    }, 3000);
  }, [cachedOptions, character, selectedStat, selectedDifficulty, dialogueNode, onDialogueComplete]);

  const getStatIcon = (statId: string) => {
    switch (statId) {
      case 'logic':
      case 'rhetoric':
      case 'visual':
        return <Brain className="w-4 h-4" />;
      case 'volition':
      case 'empathy':
      case 'inland':
        return <Heart className="w-4 h-4" />;
      case 'perception':
      case 'reaction':
      case 'composure':
        return <Target className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  if (!dialogueNode.skillCheck) {
    return (
      <div className={cn("bg-gray-800 rounded-xl p-6 border border-gray-700", className)}>
        <div className="text-center text-gray-400">
          <Dice1 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>This dialogue doesn't require a skill check.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Character Info */}
      <CompactCharacterStats character={character} />

      {/* Dialogue Context */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">Dialogue Context</h3>
            <p className="text-gray-300 leading-relaxed">{dialogueNode.text}</p>
            {dialogueNode.speaker && (
              <p className="text-sm text-blue-400 mt-2">— {dialogueNode.speaker}</p>
            )}
          </div>
        </div>
      </div>

      {/* Skill Check Configuration */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-white">Skill Check Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stat Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stat to Test
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(character.stats).map(([statId, stat]) => (
                <button
                  key={statId}
                  onClick={() => setSelectedStat(statId as keyof DiscoElysiumCharacter['stats'])}
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-200 text-left",
                    selectedStat === statId
                      ? "border-blue-400 bg-blue-900/20"
                      : "border-gray-600 bg-gray-700 hover:border-gray-500"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getStatIcon(statId)}
                    <span className="text-sm font-medium text-white">{stat.shortName}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {stat.value} ({stat.modifier > 0 ? '+' : ''}{stat.modifier})
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option value="Trivial">Trivial (DC 5)</option>
              <option value="Easy">Easy (DC 10)</option>
              <option value="Medium">Medium (DC 15)</option>
              <option value="Hard">Hard (DC 20)</option>
              <option value="Extreme">Extreme (DC 25)</option>
              <option value="Impossible">Impossible (DC 30)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Options Generation */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Dialogue Options</h3>
          <button
            onClick={generateOptions}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
            {isGenerating ? 'Generating...' : 'Generate Options'}
          </button>
        </div>

        {cachedOptions ? (
          <div className="text-sm text-green-400 flex items-center gap-2">
            <span>✅</span>
            Options cached and ready for roll
          </div>
        ) : (
          <div className="text-sm text-gray-400">
            Click "Generate Options" to create dialogue choices
          </div>
        )}
      </div>

      {/* Roll and Result */}
      {cachedOptions && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Roll for Dialogue</h3>
            <button
              onClick={() => setShowRollDetails(!showRollDetails)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {showRollDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={performRoll}
            className="w-full p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-3 text-lg font-bold"
          >
            <Dice1 className="w-6 h-6" />
            Roll d20 + {character.stats[selectedStat].shortName}
          </button>

          {showRollDetails && rollHistory.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Rolls</h4>
              <div className="space-y-2">
                {rollHistory.slice(0, 3).map((roll, index) => (
                  <div key={roll.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {character.stats[selectedStat].shortName}: d20({roll.diceRoll}) + {roll.statModifier} = {roll.total}
                    </span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs",
                      roll.isSuccess ? "bg-green-600 text-white" : "bg-red-600 text-white"
                    )}>
                      {roll.resultText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Component for testing multiple rolls
export function DialogueRollTester({
  character,
  className
}: {
  character: DiscoElysiumCharacter;
  className?: string;
}) {
  const [rollResults, setRollResults] = useState<any[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const performTestRolls = async () => {
    setIsRolling(true);
    const results = [];
    
    // Generate 10 test rolls
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for animation
      
      const { rollResult, optionType } = rollAndGetDialogueOption(
        character,
        'logic',
        'Medium',
        generateCachedOptions('test', character.id, 'logic', {
          character: character.name,
          situation: 'Test situation',
          previousDialogue: [],
          characterPersonality: 'Test',
          mood: 'Neutral'
        })
      );
      
      results.push({ rollResult, optionType, index: i });
    }
    
    setRollResults(results);
    setIsRolling(false);
  };

  return (
    <div className={cn("bg-gray-800 rounded-xl p-4 border border-gray-700", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Roll Tester</h3>
        <button
          onClick={performTestRolls}
          disabled={isRolling}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          {isRolling ? 'Rolling...' : 'Test 10 Rolls'}
        </button>
      </div>

      {rollResults.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {rollResults.map(({ rollResult, optionType, index }) => (
            <div
              key={index}
              className="p-2 rounded border text-xs"
              style={{
                borderColor: ROLL_RESULT_TYPES[optionType].color,
                backgroundColor: `${ROLL_RESULT_TYPES[optionType].color}10`
              }}
            >
              <div className="flex items-center justify-between">
                <span>d20({rollResult.diceRoll}) + {rollResult.statModifier} = {rollResult.total}</span>
                <span>{ROLL_RESULT_TYPES[optionType].icon}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


