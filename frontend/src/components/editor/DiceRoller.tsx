import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import Button from "../notus/Button";
import { Select } from "../notus/Form";
import { 
  listSkillChecks,
  rollSkillCheck,
  getCharacterSkills,
  SKILL_CHOICES
} from "../../api/skillCheck";
import { listCharacters } from "../../api/character";
import { generateDialogueResult, generatePlayerResponses, logDialogueEvent } from "../../api/quest";
import type { Character } from "../../api/character";
import type { SkillCheck, RollResponse } from "../../api/skillCheck";
import type { DialogueResult, PlayerResponses } from "../../api/quest";

interface DiceRollerProps {
  dialogueId?: string;
}

export default function DiceRoller({ dialogueId }: DiceRollerProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [skillChecks, setSkillChecks] = useState<SkillCheck[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedSkillCheck, setSelectedSkillCheck] = useState<SkillCheck | null>(null);
  const [characterSkills, setCharacterSkills] = useState<Record<string, number>>({});
  const [rollResult, setRollResult] = useState<RollResponse | null>(null);
  const [dialogueResult, setDialogueResult] = useState<DialogueResult | null>(null);
  const [playerResponses, setPlayerResponses] = useState<PlayerResponses | null>(null);
  const [selectedTrait, setSelectedTrait] = useState<string>("neutral");
  const [questContext, setQuestContext] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCharacters();
    loadSkillChecks();
  }, []);

  useEffect(() => {
    if (selectedCharacter?.id) {
      loadCharacterSkills(selectedCharacter.id);
    }
  }, [selectedCharacter]);

  const loadCharacters = async () => {
    try {
      const response = await listCharacters();
      setCharacters(response.data);
    } catch (e: any) {
      setError(e?.message || "Failed to load characters");
    }
  };

  const loadSkillChecks = async () => {
    try {
      const response = await listSkillChecks();
      const filtered = dialogueId 
        ? response.data.filter(sc => sc.dialogue === dialogueId)
        : response.data;
      setSkillChecks(filtered);
    } catch (e: any) {
      setError(e?.message || "Failed to load skill checks");
    }
  };

  const loadCharacterSkills = async (characterId: string) => {
    try {
      const response = await getCharacterSkills(characterId);
      setCharacterSkills(response.data.skills);
    } catch (e: any) {
      setError(e?.message || "Failed to load character skills");
    }
  };

  const handleRoll = async () => {
    if (!selectedCharacter?.id || !selectedSkillCheck?.id) {
      setError("Please select both character and skill check");
      return;
    }

    setLoading(true);
    setError(null);
    setRollResult(null);
    setDialogueResult(null);
    setPlayerResponses(null);

    try {
      // Roll the skill check
      const rollResponse = await rollSkillCheck({
        character_id: selectedCharacter.id,
        skill_check_id: selectedSkillCheck.id
      });
      setRollResult(rollResponse.data);

      // Generate dialogue result based on roll
      const dialogueResponse = await generateDialogueResult({
        dice_result: rollResponse.data.dice_roll,
        character_trait: selectedTrait,
        quest_context: questContext,
        character_id: selectedCharacter.id
      });
      setDialogueResult(dialogueResponse.data);

      // Log the event
      await logDialogueEvent({
        character_id: selectedCharacter.id,
        log_type: "dice_roll",
        author: selectedCharacter.name,
        content: `Rolled ${rollResponse.data.dice_roll} + ${rollResponse.data.skill_value} = ${rollResponse.data.total} (DC ${rollResponse.data.dc_value})`,
        result: rollResponse.data.is_success ? "success" : "failure",
        metadata: {
          skill: rollResponse.data.skill,
          dice_roll: rollResponse.data.dice_roll,
          skill_value: rollResponse.data.skill_value,
          total: rollResponse.data.total,
          dc_value: rollResponse.data.dc_value,
          is_critical_success: rollResponse.data.is_critical_success,
          is_critical_failure: rollResponse.data.is_critical_failure
        }
      });

    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to roll dice");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlayerResponses = async () => {
    if (!dialogueResult || !selectedCharacter?.id) return;

    try {
      const response = await generatePlayerResponses({
        character_id: selectedCharacter.id,
        npc_response: dialogueResult.npc_response,
        character_traits: [selectedTrait]
      });
      setPlayerResponses(response.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to generate player responses");
    }
  };

  const getSkillValue = (skill: string) => {
    return characterSkills[skill] || 0;
  };

  const getResultColor = (result: RollResponse) => {
    if (result.is_critical_success) return "text-green-400";
    if (result.is_critical_failure) return "text-red-400";
    if (result.is_success) return "text-green-300";
    return "text-red-300";
  };

  const getResultIcon = (result: RollResponse) => {
    if (result.is_critical_success) return "🎉";
    if (result.is_critical_failure) return "💥";
    if (result.is_success) return "✅";
    return "❌";
  };

  return (
    <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-lg">🎲</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Dice Roller</h2>
            <p className="text-xs text-gray-400">Roll skill checks for characters</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-auto">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Character Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">Select Character</label>
          <Select 
            value={selectedCharacter?.id || ""} 
            onChange={(e) => {
              const character = characters.find(c => c.id === e.target.value);
              setSelectedCharacter(character || null);
            }}
            className="w-full bg-white/5 border-white/10 text-white focus:border-yellow-500 focus:ring-yellow-500/20"
          >
            <option value="">Choose a character...</option>
            {characters.map(character => (
              <option key={character.id} value={character.id}>{character.name}</option>
            ))}
          </Select>
        </div>

        {/* Skill Check Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">Select Skill Check</label>
          <Select 
            value={selectedSkillCheck?.id || ""} 
            onChange={(e) => {
              const skillCheck = skillChecks.find(sc => sc.id === e.target.value);
              setSelectedSkillCheck(skillCheck || null);
            }}
            className="w-full bg-white/5 border-white/10 text-white focus:border-yellow-500 focus:ring-yellow-500/20"
          >
            <option value="">Choose a skill check...</option>
            {skillChecks.map(skillCheck => (
              <option key={skillCheck.id} value={skillCheck.id}>
                {SKILL_CHOICES.find(s => s.value === skillCheck.skill)?.label || skillCheck.skill} (DC {skillCheck.dc_value})
              </option>
            ))}
          </Select>
        </div>

        {/* Character Trait Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">Character Trait</label>
          <Select 
            value={selectedTrait} 
            onChange={(e) => setSelectedTrait(e.target.value)}
            className="w-full bg-white/5 border-white/10 text-white focus:border-yellow-500 focus:ring-yellow-500/20"
          >
            <option value="neutral">Neutral</option>
            <option value="манипулятивный">Манипулятивный</option>
            <option value="наивный">Наивный</option>
            <option value="агрессивный">Агрессивный</option>
            <option value="миролюбивый">Миролюбивый</option>
            <option value="циничный">Циничный</option>
            <option value="оптимистичный">Оптимистичный</option>
          </Select>
        </div>

        {/* Quest Context */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">Quest Context</label>
          <input
            type="text"
            value={questContext}
            onChange={(e) => setQuestContext(e.target.value)}
            placeholder="Enter quest context or situation..."
            className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-lg"
          />
        </div>

        {/* Character Skills Display */}
        {selectedCharacter && selectedSkillCheck && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Character Stats</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Character:</span>
                <span className="text-white font-medium">{selectedCharacter.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Skill:</span>
                <span className="text-white font-medium">
                  {SKILL_CHOICES.find(s => s.value === selectedSkillCheck.skill)?.label || selectedSkillCheck.skill}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Skill Value:</span>
                <span className="text-white font-medium">{getSkillValue(selectedSkillCheck.skill)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">DC:</span>
                <span className="text-white font-medium">{selectedSkillCheck.dc_value}</span>
              </div>
            </div>
          </div>
        )}

        {/* Roll Button */}
        <Button 
          onClick={handleRoll}
          disabled={!selectedCharacter || !selectedSkillCheck || loading}
          className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              Rolling...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Roll d20
            </>
          )}
        </Button>

        {/* Roll Result */}
        {rollResult && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{getResultIcon(rollResult)}</span>
              <div>
                <h3 className={`text-lg font-semibold ${getResultColor(rollResult)}`}>
                  {rollResult.is_critical_success ? "Critical Success!" :
                   rollResult.is_critical_failure ? "Critical Failure!" :
                   rollResult.is_success ? "Success!" : "Failure!"}
                </h3>
                <p className="text-xs text-gray-400">{rollResult.character_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-white">{rollResult.dice_roll}</div>
                <div className="text-xs text-gray-400">d20 Roll</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-white">{rollResult.total}</div>
                <div className="text-xs text-gray-400">Total (d20 + {rollResult.skill_value})</div>
              </div>
            </div>

            <div className="text-center p-3 bg-white/5 rounded-lg mb-4">
              <div className="text-lg font-semibold text-white">DC {rollResult.dc_value}</div>
              <div className="text-xs text-gray-400">Difficulty Class</div>
            </div>

            {rollResult.result_text && (
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-sm text-gray-300 leading-relaxed">
                  {rollResult.result_text}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dialogue Result */}
        {dialogueResult && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💬</span>
              <div>
                <h3 className="text-lg font-semibold text-white">NPC Response</h3>
                <p className="text-xs text-gray-400">Based on {dialogueResult.character_trait} trait</p>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-lg mb-4">
              <div className="text-sm text-gray-300 leading-relaxed">
                {dialogueResult.npc_response}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded-full ${
                dialogueResult.success ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}>
                {dialogueResult.success ? "Success" : "Failure"}
              </span>
              <span className="text-xs text-gray-400">
                Roll: {dialogueResult.dice_result}
              </span>
            </div>

            <Button 
              onClick={handleGeneratePlayerResponses}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
            >
              Generate Player Responses
            </Button>
          </div>
        )}

        {/* Player Responses */}
        {playerResponses && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎭</span>
              <div>
                <h3 className="text-lg font-semibold text-white">Player Response Options</h3>
                <p className="text-xs text-gray-400">Choose your response as {playerResponses.character_name}</p>
              </div>
            </div>

            <div className="space-y-3">
              {playerResponses.responses.map((response, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-sm text-gray-300 leading-relaxed mb-2">
                        {response.text}
                      </div>
                      {response.requires_roll && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                            Requires {response.skill_type} check
                          </span>
                        </div>
                      )}
                    </div>
                    <Button 
                      className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs rounded-lg transition-all duration-200"
                      onClick={() => {
                        // Log player response
                        logDialogueEvent({
                          character_id: selectedCharacter?.id,
                          log_type: "dialogue",
                          author: "Player",
                          content: response.text,
                          result: response.requires_roll ? "pending_roll" : "neutral",
                          metadata: {
                            response_index: index,
                            requires_roll: response.requires_roll,
                            skill_type: response.skill_type
                          }
                        });
                      }}
                    >
                      Choose
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Skill Checks Message */}
        {skillChecks.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-700/50 rounded-lg flex items-center justify-center">
              <span className="text-lg">🎲</span>
            </div>
            <p>No skill checks available</p>
            <p className="text-xs mt-1">Create skill checks in the Skill Check Editor</p>
          </div>
        )}
      </div>
    </div>
  );
}
