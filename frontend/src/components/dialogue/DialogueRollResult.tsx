import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { ROLL_RESULT_TYPES } from '../../types/discoElysium';
import type { RollResult, DiscoElysiumStat } from '../../types/discoElysium';
import { getStatModifierText } from '../../utils/diceSystem';
import { Dice1, Zap, Sparkles, AlertCircle } from 'lucide-react';

interface DialogueRollResultProps {
  rollResult: RollResult;
  statInfo: DiscoElysiumStat;
  selectedOption: string;
  optionType: keyof typeof ROLL_RESULT_TYPES;
  onOptionSelect: (option: string) => void;
  className?: string;
}

export default function DialogueRollResult({
  rollResult,
  statInfo,
  selectedOption,
  optionType,
  onOptionSelect,
  className
}: DialogueRollResultProps) {
  const [showRoll, setShowRoll] = useState(false);
  const [showOption, setShowOption] = useState(false);

  const resultType = ROLL_RESULT_TYPES[optionType];

  useEffect(() => {
    // Animate roll first
    setShowRoll(true);
    
    // Then show option after a delay
    setTimeout(() => {
      setShowOption(true);
    }, 800);
  }, []);

  const getRollIcon = () => {
    if (rollResult.isCriticalSuccess) return <Sparkles className="w-6 h-6" />;
    if (rollResult.isCriticalFailure) return <AlertCircle className="w-6 h-6" />;
    if (rollResult.isSuccess) return <Zap className="w-6 h-6" />;
    return <Dice1 className="w-6 h-6" />;
  };

  const getRollAnimation = () => {
    if (rollResult.isCriticalSuccess) return 'animate-pulse-glow';
    if (rollResult.isCriticalFailure) return 'animate-bounce-in';
    if (rollResult.isSuccess) return 'animate-fade-in-up';
    return 'animate-slide-in-left';
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Roll Result Display */}
      {showRoll && (
        <div className={cn(
          "bg-gray-800 border-2 rounded-xl p-4 transition-all duration-500",
          getRollAnimation(),
          rollResult.isCriticalSuccess && "border-green-400 shadow-green-400/20",
          rollResult.isSuccess && !rollResult.isCriticalSuccess && "border-blue-400 shadow-blue-400/20",
          rollResult.isCriticalFailure && "border-red-400 shadow-red-400/20",
          !rollResult.isSuccess && !rollResult.isCriticalFailure && "border-gray-400"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-full",
              rollResult.isCriticalSuccess && "bg-green-600",
              rollResult.isSuccess && !rollResult.isCriticalSuccess && "bg-blue-600",
              rollResult.isCriticalFailure && "bg-red-600",
              !rollResult.isSuccess && !rollResult.isCriticalFailure && "bg-gray-600"
            )}>
              {getRollIcon()}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white">
                  {statInfo.name} Check
                </h3>
                <span className="text-sm text-gray-400">
                  ({statInfo.value} {getStatModifierText(statInfo.modifier)})
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Dice1 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    d20: <span className="font-mono font-bold">{rollResult.diceRoll}</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">+</span>
                  <span className="text-gray-300">
                    {statInfo.name}: <span className="font-mono font-bold">{rollResult.statModifier}</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">=</span>
                  <span className={cn(
                    "font-mono font-bold text-lg",
                    rollResult.isSuccess ? "text-green-400" : "text-red-400"
                  )}>
                    {rollResult.total}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">vs</span>
                  <span className="text-gray-300">
                    DC: <span className="font-mono font-bold">{rollResult.dcValue}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialogue Option */}
      {showOption && (
        <div className={cn(
          "transition-all duration-500 animate-fade-in-up"
        )}>
          <div className={cn(
            "border-2 rounded-xl p-4 cursor-pointer hover:scale-105 transition-all duration-200",
            "bg-gray-800 border-gray-600 hover:border-gray-500"
          )}
          style={{
            borderColor: resultType.color,
            boxShadow: `0 0 20px ${resultType.color}20`
          }}
          onClick={() => onOptionSelect(selectedOption)}
          >
            <div className="flex items-start gap-4">
              <div 
                className="p-3 rounded-full text-2xl"
                style={{ backgroundColor: `${resultType.color}20` }}
              >
                {resultType.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-bold text-white">
                    {resultType.name}
                  </h4>
                  <span 
                    className="text-xs px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: resultType.color }}
                  >
                    {statInfo.name}
                  </span>
                </div>
                
                <p className="text-gray-300 leading-relaxed">
                  {selectedOption}
                </p>
                
                <div className="mt-3 text-xs text-gray-400">
                  {resultType.description}
                </div>
              </div>
              
              <div className="text-gray-400 text-sm">
                Click to select
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roll Details (Collapsible) */}
      <details className="bg-gray-900 rounded-lg p-3">
        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
          Show roll details
        </summary>
        <div className="mt-2 text-xs text-gray-500 space-y-1">
          <div>Roll ID: {rollResult.id}</div>
          <div>Timestamp: {new Date(rollResult.timestamp).toLocaleString()}</div>
          <div>Stat: {statInfo.name} ({statInfo.value})</div>
          <div>Modifier: {getStatModifierText(statInfo.modifier)}</div>
          <div>Total: {rollResult.total}</div>
          <div>DC: {rollResult.dcValue}</div>
          <div>Result: {rollResult.resultText}</div>
        </div>
      </details>
    </div>
  );
}

// Component for showing multiple roll options (for testing)
interface MultipleRollOptionsProps {
  character: any;
  stat: string;
  difficulty: string;
  onOptionSelect: (option: string, type: string) => void;
  className?: string;
}

export function MultipleRollOptions({
  character,
  stat,
  difficulty,
  onOptionSelect,
  className
}: MultipleRollOptionsProps) {
  const [options, setOptions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateOptions = async () => {
    setIsGenerating(true);
    
    // Simulate generating options for different roll results
    const mockOptions = [
      {
        type: 'CRITICAL_SUCCESS',
        text: `[${stat.toUpperCase()}] Brilliant! You see the solution immediately.`,
        color: ROLL_RESULT_TYPES.CRITICAL_SUCCESS.color,
        icon: ROLL_RESULT_TYPES.CRITICAL_SUCCESS.icon
      },
      {
        type: 'SUCCESS',
        text: `[${stat.toUpperCase()}] You have a good understanding of this situation.`,
        color: ROLL_RESULT_TYPES.SUCCESS.color,
        icon: ROLL_RESULT_TYPES.SUCCESS.icon
      },
      {
        type: 'FAILURE',
        text: `[${stat.toUpperCase()}] You're not quite sure about this approach...`,
        color: ROLL_RESULT_TYPES.FAILURE.color,
        icon: ROLL_RESULT_TYPES.FAILURE.icon
      },
      {
        type: 'ALTERNATIVE',
        text: `[${stat.toUpperCase()}] Maybe there's another way to think about this.`,
        color: ROLL_RESULT_TYPES.ALTERNATIVE.color,
        icon: ROLL_RESULT_TYPES.ALTERNATIVE.icon
      }
    ];
    
    setTimeout(() => {
      setOptions(mockOptions);
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <button
        onClick={generateOptions}
        disabled={isGenerating}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
      >
        {isGenerating ? 'Generating Options...' : 'Generate All Options'}
      </button>
      
      {options.map((option, index) => (
        <div
          key={index}
          className={cn(
            "border-2 rounded-lg p-3 cursor-pointer hover:scale-105 transition-all duration-200 animate-fade-in-up"
          )}
          style={{
            borderColor: option.color,
            boxShadow: `0 0 10px ${option.color}20`,
            animationDelay: `${index * 100}ms`
          }}
          onClick={() => onOptionSelect(option.text, option.type)}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{option.icon}</span>
            <span className="text-gray-300">{option.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
}


