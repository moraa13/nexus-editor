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
import type { Character } from "../../api/character";
import type { SkillCheck, RollResponse } from "../../api/skillCheck";

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

    try {
      const response = await rollSkillCheck({
        character_id: selectedCharacter.id,
        skill_check_id: selectedSkillCheck.id
      });
      setRollResult(response.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to roll dice");
    } finally {
      setLoading(false);
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
