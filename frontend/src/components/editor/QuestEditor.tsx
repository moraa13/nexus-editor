import { useState, useEffect } from "react";
import { Quest, QuestObjective, Character, Dialogue, NPC } from "../../types";
import { 
  listQuests, 
  createQuest, 
  updateQuest, 
  deleteQuest,
  startQuest,
  completeQuest,
  failQuest,
  updateQuestProgress,
  getQuestStatusColor,
  getQuestTypeIcon,
  getObjectiveTypeIcon,
  getPriorityColor
} from "../../api/quest";
import { listCharacters } from "../../api/character";
import { listDialogues } from "../../api/dialogue";
import { listNPCs } from "../../api/npc";
import Button from "../notus/Button";
import Card from "../notus/Card";
import Form from "../notus/Form";

interface QuestEditorProps {
  projectId?: string;
  onQuestUpdate?: (quest: Quest) => void;
}

export default function QuestEditor({ projectId, onQuestUpdate }: QuestEditorProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [npcs, setNPCs] = useState<NPC[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [showObjectiveForm, setShowObjectiveForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [editingObjective, setEditingObjective] = useState<QuestObjective | null>(null);
  
  // Form data
  const [questForm, setQuestForm] = useState({
    title: "",
    description: "",
    quest_type: "dialogue" as Quest['quest_type'],
    priority: "normal" as Quest['priority'],
    difficulty_level: 1,
    status: "available" as Quest['status'],
    progress: 0,
    max_progress: 100,
    assigned_character: "",
    quest_giver: "",
    start_dialogue: "",
    completion_dialogue: "",
    failure_dialogue: "",
    experience_reward: 0,
    color: "#10B981",
    icon: "📋",
    tags: [] as string[],
  });
  
  const [objectiveForm, setObjectiveForm] = useState({
    title: "",
    description: "",
    objective_type: "dialogue" as QuestObjective['objective_type'],
    is_optional: false,
    order: 0,
    required_count: 1,
    current_count: 0,
  });

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [questsResponse, charactersResponse, dialoguesResponse, npcsResponse] = await Promise.all([
        listQuests(),
        listCharacters(),
        listDialogues(),
        listNPCs(),
      ]);
      
      setQuests(questsResponse.data);
      setCharacters(charactersResponse.data);
      setDialogues(dialoguesResponse.data);
      setNPCs(npcsResponse.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuest = async () => {
    if (!questForm.title.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await createQuest({
        ...questForm,
        project: projectId,
        assigned_character: questForm.assigned_character || undefined,
        quest_giver: questForm.quest_giver || undefined,
        start_dialogue: questForm.start_dialogue || undefined,
        completion_dialogue: questForm.completion_dialogue || undefined,
        failure_dialogue: questForm.failure_dialogue || undefined,
      });
      
      setQuests([response.data, ...quests]);
      setShowQuestForm(false);
      resetQuestForm();
      onQuestUpdate?.(response.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to create quest");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuest = async () => {
    if (!editingQuest || !questForm.title.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateQuest(editingQuest.id, {
        ...questForm,
        assigned_character: questForm.assigned_character || undefined,
        quest_giver: questForm.quest_giver || undefined,
        start_dialogue: questForm.start_dialogue || undefined,
        completion_dialogue: questForm.completion_dialogue || undefined,
        failure_dialogue: questForm.failure_dialogue || undefined,
      });
      
      setQuests(quests.map(q => q.id === editingQuest.id ? response.data : q));
      setSelectedQuest(response.data);
      setShowQuestForm(false);
      setEditingQuest(null);
      resetQuestForm();
      onQuestUpdate?.(response.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to update quest");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuest = async (questId: string) => {
    if (!confirm("Delete this quest?")) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await deleteQuest(questId);
      setQuests(quests.filter(q => q.id !== questId));
      if (selectedQuest?.id === questId) {
        setSelectedQuest(null);
      }
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to delete quest");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestAction = async (action: 'start' | 'complete' | 'fail', questId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      switch (action) {
        case 'start':
          response = await startQuest(questId, questForm.assigned_character);
          break;
        case 'complete':
          response = await completeQuest(questId);
          break;
        case 'fail':
          response = await failQuest(questId);
          break;
      }
      
      setQuests(quests.map(q => q.id === questId ? response.data.quest : q));
      if (selectedQuest?.id === questId) {
        setSelectedQuest(response.data.quest);
      }
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || `Failed to ${action} quest`);
    } finally {
      setLoading(false);
    }
  };

  const resetQuestForm = () => {
    setQuestForm({
      title: "",
      description: "",
      quest_type: "dialogue",
      priority: "normal",
      difficulty_level: 1,
      status: "available",
      progress: 0,
      max_progress: 100,
      assigned_character: "",
      quest_giver: "",
      start_dialogue: "",
      completion_dialogue: "",
      failure_dialogue: "",
      experience_reward: 0,
      color: "#10B981",
      icon: "📋",
      tags: [],
    });
  };

  const openQuestForm = (quest?: Quest) => {
    if (quest) {
      setEditingQuest(quest);
      setQuestForm({
        title: quest.title,
        description: quest.description || "",
        quest_type: quest.quest_type,
        priority: quest.priority,
        difficulty_level: quest.difficulty_level,
        status: quest.status,
        progress: quest.progress,
        max_progress: quest.max_progress,
        assigned_character: quest.assigned_character || "",
        quest_giver: quest.quest_giver || "",
        start_dialogue: quest.start_dialogue || "",
        completion_dialogue: quest.completion_dialogue || "",
        failure_dialogue: quest.failure_dialogue || "",
        experience_reward: quest.experience_reward,
        color: quest.color,
        icon: quest.icon,
        tags: quest.tags || [],
      });
    } else {
      setEditingQuest(null);
      resetQuestForm();
    }
    setShowQuestForm(true);
  };

  if (loading && quests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Quest Editor</h2>
          <p className="text-gray-400">
            {quests.length} quests • {quests.filter(q => q.status === 'active').length} active
          </p>
        </div>
        
        <Button
          onClick={() => openQuestForm()}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          + New Quest
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quest List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Quests</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {quests.map((quest) => (
              <Card
                key={quest.id}
                className={`p-4 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-indigo-500/50 ${
                  selectedQuest?.id === quest.id ? 'ring-2 ring-indigo-500/50' : ''
                }`}
                onClick={() => setSelectedQuest(quest)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: quest.color + "20", color: quest.color }}
                    >
                      {quest.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-white">{quest.title}</h4>
                        <span 
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: getQuestStatusColor(quest.status) + "20",
                            color: getQuestStatusColor(quest.status)
                          }}
                        >
                          {quest.status_display}
                        </span>
                        <span 
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: getPriorityColor(quest.priority) + "20",
                            color: getPriorityColor(quest.priority)
                          }}
                        >
                          {quest.priority_display}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-2">{quest.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{getQuestTypeIcon(quest.quest_type)} {quest.quest_type_display}</span>
                        <span>Level {quest.difficulty_level}</span>
                        <span>{quest.progress_percentage}% complete</span>
                        {quest.objectives_count && (
                          <span>{quest.completed_objectives_count}/{quest.objectives_count} objectives</span>
                        )}
                      </div>
                      
                      {quest.progress_percentage && quest.progress_percentage > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${quest.progress_percentage}%`,
                                backgroundColor: quest.color
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openQuestForm(quest);
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuest(quest.id);
                      }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quest Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Quest Details</h3>
          
          {selectedQuest ? (
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: selectedQuest.color + "20", color: selectedQuest.color }}
                  >
                    {selectedQuest.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{selectedQuest.title}</h4>
                    <p className="text-sm text-gray-400">{selectedQuest.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white ml-2">{selectedQuest.quest_type_display}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Priority:</span>
                    <span className="text-white ml-2">{selectedQuest.priority_display}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Difficulty:</span>
                    <span className="text-white ml-2">Level {selectedQuest.difficulty_level}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white ml-2">{selectedQuest.status_display}</span>
                  </div>
                </div>
                
                {selectedQuest.progress_percentage && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{selectedQuest.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${selectedQuest.progress_percentage}%`,
                          backgroundColor: selectedQuest.color
                        }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* Objectives */}
                {selectedQuest.objectives && selectedQuest.objectives.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-white mb-2">Objectives</h5>
                    <div className="space-y-2">
                      {selectedQuest.objectives.map((objective) => (
                        <div
                          key={objective.id}
                          className={`p-3 rounded-lg border ${
                            objective.is_completed 
                              ? "bg-green-500/10 border-green-500/30" 
                              : "bg-white/5 border-white/20"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getObjectiveTypeIcon(objective.objective_type)}</span>
                            <span className="text-white">{objective.title}</span>
                            {objective.is_completed && <span className="text-green-400">✓</span>}
                          </div>
                          {objective.description && (
                            <p className="text-sm text-gray-400 mt-1">{objective.description}</p>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {objective.current_count}/{objective.required_count} {objective.objective_type_display}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex space-x-2">
                  {selectedQuest.status === 'available' && (
                    <Button
                      onClick={() => handleQuestAction('start', selectedQuest.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Start Quest
                    </Button>
                  )}
                  {selectedQuest.status === 'active' && (
                    <>
                      <Button
                        onClick={() => handleQuestAction('complete', selectedQuest.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Complete
                      </Button>
                      <Button
                        onClick={() => handleQuestAction('fail', selectedQuest.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Fail
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <p>Select a quest to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Quest Form Modal */}
      {showQuestForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingQuest ? "Edit Quest" : "Create Quest"}
            </h3>
            
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={questForm.title}
                    onChange={(e) => setQuestForm({ ...questForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Quest title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={questForm.quest_type}
                    onChange={(e) => setQuestForm({ ...questForm, quest_type: e.target.value as Quest['quest_type'] })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="dialogue">Dialogue</option>
                    <option value="combat">Combat</option>
                    <option value="skill_check">Skill Check</option>
                    <option value="exploration">Exploration</option>
                    <option value="puzzle">Puzzle</option>
                    <option value="social">Social</option>
                    <option value="fetch">Fetch</option>
                    <option value="elimination">Elimination</option>
                    <option value="escort">Escort</option>
                    <option value="investigation">Investigation</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={questForm.description}
                  onChange={(e) => setQuestForm({ ...questForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  rows={3}
                  placeholder="Quest description..."
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={questForm.priority}
                    onChange={(e) => setQuestForm({ ...questForm, priority: e.target.value as Quest['priority'] })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={questForm.difficulty_level}
                    onChange={(e) => setQuestForm({ ...questForm, difficulty_level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={questForm.status}
                    onChange={(e) => setQuestForm({ ...questForm, status: e.target.value as Quest['status'] })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="available">Available</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="locked">Locked</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Assigned Character
                  </label>
                  <select
                    value={questForm.assigned_character}
                    onChange={(e) => setQuestForm({ ...questForm, assigned_character: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="">No character assigned</option>
                    {characters.map((char) => (
                      <option key={char.id} value={char.id}>
                        {char.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quest Giver
                  </label>
                  <select
                    value={questForm.quest_giver}
                    onChange={(e) => setQuestForm({ ...questForm, quest_giver: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="">No quest giver</option>
                    {npcs.map((npc) => (
                      <option key={npc.id} value={npc.id}>
                        {npc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={questForm.color}
                    onChange={(e) => setQuestForm({ ...questForm, color: e.target.value })}
                    className="w-full h-10 bg-white/10 border border-white/20 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={questForm.icon}
                    onChange={(e) => setQuestForm({ ...questForm, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="📋"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setShowQuestForm(false)}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingQuest ? handleUpdateQuest : handleCreateQuest}
                  disabled={loading || !questForm.title.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {editingQuest ? "Update" : "Create"} Quest
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      )}
    </div>
  );
}