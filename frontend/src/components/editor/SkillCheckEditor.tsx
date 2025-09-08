import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import Button from "../notus/Button";
import { Input, Textarea, Select } from "../notus/Form";
import { 
  SKILL_CHOICES, 
  DIFFICULTY_CHOICES,
  listSkillChecks,
  createSkillCheck,
  updateSkillCheck,
  deleteSkillCheck
} from "../../api/skillCheck";
import type { SkillCheck } from "../../api/skillCheck";

interface SkillCheckEditorProps {
  dialogueId?: string;
  onSkillCheckSelect?: (skillCheck: SkillCheck) => void;
}

export default function SkillCheckEditor({ dialogueId, onSkillCheckSelect }: SkillCheckEditorProps) {
  const [skillChecks, setSkillChecks] = useState<SkillCheck[]>([]);
  const [selectedSkillCheck, setSelectedSkillCheck] = useState<SkillCheck | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<SkillCheck>>({
    dialogue: dialogueId || "",
    skill: "logic",
    difficulty: "medium",
    dc_value: 15,
    description: "",
    success_text: "",
    failure_text: "",
    critical_success_text: "",
    critical_failure_text: "",
  });

  useEffect(() => {
    loadSkillChecks();
  }, [dialogueId]);

  const loadSkillChecks = async () => {
    try {
      const response = await listSkillChecks();
      setSkillChecks(response.data);
    } catch (e: any) {
      setError(e?.message || "Failed to load skill checks");
    }
  };


  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedSkillCheck(null);
    setFormData({
      dialogue: dialogueId || "",
      skill: "logic",
      difficulty: "medium",
      dc_value: 15,
      description: "",
      success_text: "",
      failure_text: "",
      critical_success_text: "",
      critical_failure_text: "",
    });
  };

  const handleEdit = (skillCheck: SkillCheck) => {
    setSelectedSkillCheck(skillCheck);
    setIsEditing(true);
    setIsCreating(false);
    setFormData(skillCheck);
  };

  const handleSave = async () => {
    if (!formData.dialogue) {
      setError("Dialogue is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isCreating) {
        const response = await createSkillCheck(formData);
        setSkillChecks(prev => [...prev, response.data]);
        setSelectedSkillCheck(response.data);
        onSkillCheckSelect?.(response.data);
      } else if (selectedSkillCheck?.id) {
        const response = await updateSkillCheck(selectedSkillCheck.id, formData);
        setSkillChecks(prev => prev.map(sc => sc.id === response.data.id ? response.data : sc));
        setSelectedSkillCheck(response.data);
      }
      
      setIsCreating(false);
      setIsEditing(false);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to save skill check");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (skillCheck: SkillCheck) => {
    if (!skillCheck.id) return;
    
    if (!confirm(`Delete skill check "${skillCheck.skill}"?`)) return;

    try {
      await deleteSkillCheck(skillCheck.id);
      setSkillChecks(prev => prev.filter(sc => sc.id !== skillCheck.id));
      if (selectedSkillCheck?.id === skillCheck.id) {
        setSelectedSkillCheck(null);
        setIsEditing(false);
      }
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to delete skill check");
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedSkillCheck(null);
    setFormData({
      dialogue: dialogueId || "",
      skill: "logic",
      difficulty: "medium",
      dc_value: 15,
      description: "",
      success_text: "",
      failure_text: "",
      critical_success_text: "",
      critical_failure_text: "",
    });
  };

  const filteredSkillChecks = dialogueId 
    ? skillChecks.filter(sc => sc.dialogue === dialogueId)
    : skillChecks;

  return (
    <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">🎲</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Skill Checks</h2>
              <p className="text-xs text-gray-400">Configure dialogue skill checks</p>
            </div>
          </div>
          <Button 
            onClick={handleCreate}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Check
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

        {/* Skill Checks List */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">Existing Skill Checks</h3>
          {filteredSkillChecks.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎲</span>
              </div>
              <p className="mb-3">No skill checks yet</p>
              <Button 
                onClick={handleCreate}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
              >
                + Add Skill Check
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSkillChecks.map(skillCheck => (
                <div 
                  key={skillCheck.id} 
                  className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    selectedSkillCheck?.id === skillCheck.id 
                      ? "bg-purple-500/20 border-purple-500/50" 
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                  onClick={() => {
                    setSelectedSkillCheck(skillCheck);
                    setIsEditing(false);
                    setIsCreating(false);
                    onSkillCheckSelect?.(skillCheck);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {SKILL_CHOICES.find(s => s.value === skillCheck.skill)?.label || skillCheck.skill}
                      </div>
                      <div className="text-xs text-gray-400">
                        DC {skillCheck.dc_value} • {DIFFICULTY_CHOICES.find(d => d.value === skillCheck.difficulty)?.label || skillCheck.difficulty}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(skillCheck);
                        }}
                        className="text-xs px-2 py-1"
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(skillCheck);
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
          <div className="space-y-4 p-4 bg-white/5 border border-white/10 rounded-lg">
            <h3 className="text-sm font-medium text-gray-300">
              {isCreating ? "Create New Skill Check" : "Edit Skill Check"}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skill</label>
                <Select 
                  value={formData.skill || ""} 
                  onChange={(e) => setFormData(prev => ({ ...prev, skill: e.target.value }))}
                  className="w-full bg-white/5 border-white/10 text-white focus:border-purple-500 focus:ring-purple-500/20"
                >
                  {SKILL_CHOICES.map(skill => (
                    <option key={skill.value} value={skill.value}>{skill.label}</option>
                  ))}
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                <Select 
                  value={formData.difficulty || ""} 
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full bg-white/5 border-white/10 text-white focus:border-purple-500 focus:ring-purple-500/20"
                >
                  {DIFFICULTY_CHOICES.map(diff => (
                    <option key={diff.value} value={diff.value}>{diff.label}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <Textarea 
                value={formData.description || ""} 
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this skill check is for..."
                className="w-full bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Success Text</label>
              <Textarea 
                value={formData.success_text || ""} 
                onChange={(e) => setFormData(prev => ({ ...prev, success_text: e.target.value }))}
                placeholder="Text shown on successful roll..."
                className="w-full bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Failure Text</label>
              <Textarea 
                value={formData.failure_text || ""} 
                onChange={(e) => setFormData(prev => ({ ...prev, failure_text: e.target.value }))}
                placeholder="Text shown on failed roll..."
                className="w-full bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
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
