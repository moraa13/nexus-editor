import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import Button from "../notus/Button";
import { Input, Textarea, Select } from "../notus/Form";
import { listCharacters, createCharacter, updateCharacter, deleteCharacter } from "../../api/character";
import type { Character } from "../../api/character";

interface CharacterEditorProps {
  onCharacterSelect?: (character: Character) => void;
}

const PERSONALITY_TRAITS = [
  "манипулятивный", "наивный", "амбициозный", "усталый", "циничный", "оптимистичный",
  "агрессивный", "миролюбивый", "застенчивый", "общительный", "ленивый", "трудолюбивый",
  "честный", "лживый", "верный", "предательский", "храбрый", "трусливый"
];

const GENDER_OPTIONS = [
  { value: "male", label: "Мужской" },
  { value: "female", label: "Женский" },
  { value: "other", label: "Другой" },
  { value: "unknown", label: "Не указан" }
];

export default function CharacterEditor({ onCharacterSelect }: CharacterEditorProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Character>>({
    name: "",
    portrait: "",
    logic: 2,
    encyclopedia: 2,
    rhetoric: 2,
    drama: 2,
    conceptualization: 2,
    visual_calculus: 2,
    volition: 2,
    inland_empire: 2,
    empathy: 2,
    authority: 2,
    suggestion: 2,
    espirit_de_corps: 2,
    endurance: 2,
    pain_threshold: 2,
    physical_instrument: 2,
    electrochemistry: 2,
    shivers: 2,
    half_light: 2,
    hand_eye_coordination: 2,
    perception: 2,
    reaction_speed: 2,
    savoir_faire: 2,
    interfacing: 2,
    composure: 2,
  });

  const [personalityTraits, setPersonalityTraits] = useState<string[]>([]);
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<string>("unknown");

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const response = await listCharacters();
      setCharacters(response.data);
    } catch (e: any) {
      setError(e?.message || "Failed to load characters");
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedCharacter(null);
    setFormData({
      name: "",
      portrait: "",
      logic: 2,
      encyclopedia: 2,
      rhetoric: 2,
      drama: 2,
      conceptualization: 2,
      visual_calculus: 2,
      volition: 2,
      inland_empire: 2,
      empathy: 2,
      authority: 2,
      suggestion: 2,
      espirit_de_corps: 2,
      endurance: 2,
      pain_threshold: 2,
      physical_instrument: 2,
      electrochemistry: 2,
      shivers: 2,
      half_light: 2,
      hand_eye_coordination: 2,
      perception: 2,
      reaction_speed: 2,
      savoir_faire: 2,
      interfacing: 2,
      composure: 2,
    });
    setPersonalityTraits([]);
    setAge(25);
    setGender("unknown");
  };

  const handleEdit = (character: Character) => {
    setSelectedCharacter(character);
    setIsEditing(true);
    setIsCreating(false);
    setFormData(character);
    // В реальном приложении эти данные должны храниться в БД
    setPersonalityTraits([]);
    setAge(25);
    setGender("unknown");
  };

  const handleSave = async () => {
    if (!formData.name) {
      setError("Имя персонажа обязательно");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isCreating) {
        const response = await createCharacter(formData);
        setCharacters(prev => [...prev, response.data]);
        setSelectedCharacter(response.data);
        onCharacterSelect?.(response.data);
      } else if (selectedCharacter?.id) {
        const response = await updateCharacter(selectedCharacter.id, formData);
        setCharacters(prev => prev.map(c => c.id === response.data.id ? response.data : c));
        setSelectedCharacter(response.data);
      }
      
      setIsCreating(false);
      setIsEditing(false);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to save character");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (character: Character) => {
    if (!character.id) return;
    
    if (!confirm(`Удалить персонажа "${character.name}"?`)) return;

    try {
      await deleteCharacter(character.id);
      setCharacters(prev => prev.filter(c => c.id !== character.id));
      if (selectedCharacter?.id === character.id) {
        setSelectedCharacter(null);
        setIsEditing(false);
      }
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to delete character");
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedCharacter(null);
    setFormData({
      name: "",
      portrait: "",
      logic: 2,
      encyclopedia: 2,
      rhetoric: 2,
      drama: 2,
      conceptualization: 2,
      visual_calculus: 2,
      volition: 2,
      inland_empire: 2,
      empathy: 2,
      authority: 2,
      suggestion: 2,
      espirit_de_corps: 2,
      endurance: 2,
      pain_threshold: 2,
      physical_instrument: 2,
      electrochemistry: 2,
      shivers: 2,
      half_light: 2,
      hand_eye_coordination: 2,
      perception: 2,
      reaction_speed: 2,
      savoir_faire: 2,
      interfacing: 2,
      composure: 2,
    });
    setPersonalityTraits([]);
    setAge(25);
    setGender("unknown");
  };

  const toggleTrait = (trait: string) => {
    setPersonalityTraits(prev => 
      prev.includes(trait) 
        ? prev.filter(t => t !== trait)
        : [...prev, trait]
    );
  };

  const updateSkill = (skill: string, value: number) => {
    setFormData(prev => ({ ...prev, [skill]: value }));
  };

  return (
    <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">👥</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Character Editor</h2>
              <p className="text-xs text-gray-400">Create and edit characters</p>
            </div>
          </div>
          <Button 
            onClick={handleCreate}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Character
          </Button>
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

        {/* Characters List */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">Existing Characters</h3>
          {characters.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <span className="text-lg">👥</span>
              </div>
              <p className="mb-3">No characters yet</p>
              <Button 
                onClick={handleCreate}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg transition-colors"
              >
                + Add Character
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {characters.map(character => (
                <div 
                  key={character.id} 
                  className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    selectedCharacter?.id === character.id 
                      ? "bg-emerald-500/20 border-emerald-500/50" 
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                  onClick={() => {
                    setSelectedCharacter(character);
                    setIsEditing(false);
                    setIsCreating(false);
                    onCharacterSelect?.(character);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">{character.name}</div>
                      <div className="text-xs text-gray-400">
                        Logic: {character.logic} • Empathy: {character.empathy} • Authority: {character.authority}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(character);
                        }}
                        className="text-xs px-2 py-1"
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(character);
                        }}
                        className="text-xs px-2 py-1"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        {(isCreating || isEditing) && (
          <div className="space-y-6 p-4 bg-white/5 border border-white/10 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300">
              {isCreating ? "Create New Character" : "Edit Character"}
            </h3>
            
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Basic Information</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                  <Input 
                    value={formData.name || ""} 
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Character name"
                    className="w-full bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                  <Input 
                    type="number"
                    value={age} 
                    onChange={(e) => setAge(parseInt(e.target.value) || 25)}
                    placeholder="25"
                    className="w-full bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <Select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-white/5 border-white/10 text-white focus:border-emerald-500 focus:ring-emerald-500/20"
                  >
                    {GENDER_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Portrait URL</label>
                  <Input 
                    value={formData.portrait || ""} 
                    onChange={(e) => setFormData(prev => ({ ...prev, portrait: e.target.value }))}
                    placeholder="https://example.com/portrait.jpg"
                    className="w-full bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Personality Traits */}
            <div className="space-y-4">
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Personality Traits</h4>
              <div className="flex flex-wrap gap-2">
                {PERSONALITY_TRAITS.map(trait => (
                  <button
                    key={trait}
                    onClick={() => toggleTrait(trait)}
                    className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ${
                      personalityTraits.includes(trait)
                        ? "bg-emerald-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Skills (Disco Elysium Style)</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Logic</label>
                  <Input 
                    type="number"
                    min="1"
                    max="10"
                    value={formData.logic || 2} 
                    onChange={(e) => updateSkill("logic", parseInt(e.target.value) || 2)}
                    className="w-full bg-white/5 border-white/10 text-white focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Empathy</label>
                  <Input 
                    type="number"
                    min="1"
                    max="10"
                    value={formData.empathy || 2} 
                    onChange={(e) => updateSkill("empathy", parseInt(e.target.value) || 2)}
                    className="w-full bg-white/5 border-white/10 text-white focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Authority</label>
                  <Input 
                    type="number"
                    min="1"
                    max="10"
                    value={formData.authority || 2} 
                    onChange={(e) => updateSkill("authority", parseInt(e.target.value) || 2)}
                    className="w-full bg-white/5 border-white/10 text-white focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Endurance</label>
                  <Input 
                    type="number"
                    min="1"
                    max="10"
                    value={formData.endurance || 2} 
                    onChange={(e) => updateSkill("endurance", parseInt(e.target.value) || 2)}
                    className="w-full bg-white/5 border-white/10 text-white focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Character"}
              </Button>
              <Button 
                onClick={handleCancel}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-lg transition-all duration-200 border border-white/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
