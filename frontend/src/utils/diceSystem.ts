import { DiceRoll, RollResult, DIFFICULTY_DC_VALUES, ROLL_RESULT_TYPES } from '../types/discoElysium';
import type { DiscoElysiumCharacter, DiscoElysiumStat } from '../types/discoElysium';

// Dice roll utilities
export function rollDice(diceType: 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100'): DiceRoll {
  const maxValue = parseInt(diceType.substring(1));
  const result = Math.floor(Math.random() * maxValue) + 1;
  const isCritical = diceType === 'd20' && (result === 1 || result === 20);
  
  return {
    id: `roll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    diceType,
    result,
    maxValue,
    isCritical,
    timestamp: new Date().toISOString()
  };
}

// Roll d20 for skill checks
export function rollD20(): DiceRoll {
  return rollDice('d20');
}

// Calculate roll result based on stat and difficulty
export function calculateRollResult(
  character: DiscoElysiumCharacter,
  stat: keyof DiscoElysiumCharacter['stats'],
  difficulty: keyof typeof DIFFICULTY_DC_VALUES,
  customDC?: number
): RollResult {
  const diceRoll = rollD20();
  const statValue = character.stats[stat].value;
  const statModifier = character.stats[stat].modifier;
  const dcValue = customDC || DIFFICULTY_DC_VALUES[difficulty];
  
  const total = diceRoll.result + statModifier;
  
  // Determine success/failure
  const isCriticalSuccess = diceRoll.result === 20;
  const isCriticalFailure = diceRoll.result === 1;
  const isSuccess = total >= dcValue;
  
  // Generate result text
  let resultText = '';
  if (isCriticalSuccess) {
    resultText = 'Critical Success!';
  } else if (isCriticalFailure) {
    resultText = 'Critical Failure!';
  } else if (isSuccess) {
    resultText = 'Success!';
  } else {
    resultText = 'Failure!';
  }
  
  return {
    id: `roll-result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    skillCheckId: '',
    characterId: character.id,
    diceRoll: diceRoll.result,
    statValue,
    statModifier,
    total,
    dcValue,
    isSuccess: isSuccess || isCriticalSuccess,
    isCriticalSuccess,
    isCriticalFailure,
    resultText,
    timestamp: new Date().toISOString()
  };
}

// Determine which dialogue option to show based on roll result
export function getDialogueOptionType(rollResult: RollResult): keyof typeof ROLL_RESULT_TYPES {
  if (rollResult.isCriticalSuccess) {
    return 'CRITICAL_SUCCESS';
  } else if (rollResult.isSuccess) {
    return 'SUCCESS';
  } else if (rollResult.isCriticalFailure) {
    return 'FAILURE';
  } else {
    // For regular failures, sometimes show alternative options
    return Math.random() > 0.5 ? 'ALTERNATIVE' : 'FAILURE';
  }
}

// Generate cached dialogue options for a scene
export interface CachedDialogueOptions {
  dialogueId: string;
  characterId: string;
  stat: keyof DiscoElysiumCharacter['stats'];
  options: {
    criticalSuccess: string;
    success: string;
    failure: string;
    alternative: string;
  };
  generatedAt: string;
  expiresAt: string;
}

export function generateCachedOptions(
  dialogueId: string,
  characterId: string,
  stat: keyof DiscoElysiumCharacter['stats'],
  context: {
    character: string;
    situation: string;
    previousDialogue: string[];
    characterPersonality: string;
    mood: string;
  }
): CachedDialogueOptions {
  // This would typically call an AI service
  // For now, we'll generate placeholder options
  const options = {
    criticalSuccess: generateDialogueOption('critical_success', context, stat),
    success: generateDialogueOption('success', context, stat),
    failure: generateDialogueOption('failure', context, stat),
    alternative: generateDialogueOption('alternative', context, stat)
  };
  
  return {
    dialogueId,
    characterId,
    stat,
    options,
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  };
}

// Placeholder function for AI dialogue generation
function generateDialogueOption(
  type: 'critical_success' | 'success' | 'failure' | 'alternative',
  context: any,
  stat: string
): string {
  const templates = {
    critical_success: [
      `[${stat.toUpperCase()}] Brilliant! You understand exactly what's happening.`,
      `[${stat.toUpperCase()}] Your insight cuts through the confusion like a knife.`,
      `[${stat.toUpperCase()}] You see connections others miss completely.`,
      `[${stat.toUpperCase()}] Your intuition guides you to the perfect response.`
    ],
    success: [
      `[${stat.toUpperCase()}] You have a good understanding of the situation.`,
      `[${stat.toUpperCase()}] Your knowledge serves you well here.`,
      `[${stat.toUpperCase()}] You make a solid observation.`,
      `[${stat.toUpperCase()}] Your experience helps you here.`
    ],
    failure: [
      `[${stat.toUpperCase()}] You're not quite sure about this...`,
      `[${stat.toUpperCase()}] Something doesn't add up in your mind.`,
      `[${stat.toUpperCase()}] You feel uncertain about this approach.`,
      `[${stat.toUpperCase()}] This is outside your comfort zone.`
    ],
    alternative: [
      `[${stat.toUpperCase()}] Maybe there's another way to think about this.`,
      `[${stat.toUpperCase()}] You consider a different perspective.`,
      `[${stat.toUpperCase()}] Perhaps you should try a different approach.`,
      `[${stat.toUpperCase()}] There might be another angle to this.`
    ]
  };
  
  const typeTemplates = templates[type];
  return typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
}

// Roll and get dialogue option
export function rollAndGetDialogueOption(
  character: DiscoElysiumCharacter,
  stat: keyof DiscoElysiumCharacter['stats'],
  difficulty: keyof typeof DIFFICULTY_DC_VALUES,
  cachedOptions: CachedDialogueOptions
): {
  rollResult: RollResult;
  optionType: keyof typeof ROLL_RESULT_TYPES;
  selectedOption: string;
  statInfo: DiscoElysiumStat;
} {
  const rollResult = calculateRollResult(character, stat, difficulty);
  const optionType = getDialogueOptionType(rollResult);
  const statInfo = character.stats[stat];
  
  let selectedOption = '';
  switch (optionType) {
    case 'CRITICAL_SUCCESS':
      selectedOption = cachedOptions.options.criticalSuccess;
      break;
    case 'SUCCESS':
      selectedOption = cachedOptions.options.success;
      break;
    case 'FAILURE':
      selectedOption = cachedOptions.options.failure;
      break;
    case 'ALTERNATIVE':
      selectedOption = cachedOptions.options.alternative;
      break;
  }
  
  return {
    rollResult,
    optionType,
    selectedOption,
    statInfo
  };
}

// Validate cached options
export function validateCachedOptions(cachedOptions: CachedDialogueOptions): boolean {
  const now = new Date();
  const expiresAt = new Date(cachedOptions.expiresAt);
  return now < expiresAt;
}

// Get stat modifier text
export function getStatModifierText(modifier: number): string {
  if (modifier > 0) {
    return `+${modifier}`;
  } else if (modifier < 0) {
    return `${modifier}`;
  } else {
    return '+0';
  }
}

// Get difficulty color
export function getDifficultyColor(difficulty: keyof typeof DIFFICULTY_DC_VALUES): string {
  const colors = {
    Trivial: '#10B981',
    Easy: '#3B82F6',
    Medium: '#F59E0B',
    Hard: '#EF4444',
    Extreme: '#DC2626',
    Impossible: '#7C2D12'
  };
  return colors[difficulty];
}
