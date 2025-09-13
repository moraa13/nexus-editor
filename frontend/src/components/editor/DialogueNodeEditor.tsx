import { useState, useEffect } from "react";
import { 
  Dialogue, 
  Post, 
  DialogueOption, 
  Character,
  DialogueTreeResponse 
} from "../../types";
import { 
  getDialogueTree, 
  createDialogueOption, 
  createDialogueBranch,
  updateDialogueOption,
  deleteDialogueOption,
  updatePost
} from "../../api/dialogue";
import { listCharacters } from "../../api/character";
import Button from "../notus/Button";
import Card from "../notus/Card";
import Form from "../notus/Form";

interface DialogueNodeEditorProps {
  dialogueId?: string;
  onDialogueUpdate?: (dialogue: Dialogue) => void;
}

export default function DialogueNodeEditor({ 
  dialogueId, 
  onDialogueUpdate 
}: DialogueNodeEditorProps) {
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [dialogueTree, setDialogueTree] = useState<DialogueTreeResponse | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [showAddOption, setShowAddOption] = useState(false);
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingOption, setEditingOption] = useState<DialogueOption | null>(null);
  
  // Form data
  const [optionForm, setOptionForm] = useState({
    text: "",
    option_type: "response" as const,
    color: "#3B82F6",
    icon: "💬",
    required_skill: "",
    required_skill_value: 0,
  });
  
  const [branchForm, setBranchForm] = useState({
    title: "",
    option_id: "",
  });

  useEffect(() => {
    if (dialogueId) {
      loadDialogueTree();
    }
    loadCharacters();
  }, [dialogueId, selectedCharacter]);

  const loadDialogueTree = async () => {
    if (!dialogueId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDialogueTree(dialogueId, selectedCharacter || undefined);
      setDialogueTree(response.data);
      setDialogue(response.data.dialogue);
      onDialogueUpdate?.(response.data.dialogue);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to load dialogue tree");
    } finally {
      setLoading(false);
    }
  };

  const loadCharacters = async () => {
    try {
      const response = await listCharacters();
      setCharacters(response.data);
    } catch (e: any) {
      console.error("Failed to load characters:", e);
    }
  };

  const handleAddOption = async () => {
    if (!dialogueId || !selectedPost || !optionForm.text.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await createDialogueOption({
        dialogue_id: dialogueId,
        text: optionForm.text,
        option_type: optionForm.option_type,
        post_id: selectedPost.id,
        color: optionForm.color,
        icon: optionForm.icon,
      });
      
      // Update the post to mark it as having options
      await updatePost(selectedPost.id, {
        has_options: true,
        is_branching_point: true,
      });
      
      setShowAddOption(false);
      setOptionForm({
        text: "",
        option_type: "response",
        color: "#3B82F6",
        icon: "💬",
        required_skill: "",
        required_skill_value: 0,
      });
      setSelectedPost(null);
      
      // Reload the dialogue tree
      await loadDialogueTree();
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to create option");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async () => {
    if (!dialogueId || !branchForm.title.trim() || !branchForm.option_id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await createDialogueBranch({
        parent_dialogue_id: dialogueId,
        option_id: branchForm.option_id,
        title: branchForm.title,
      });
      
      setShowAddBranch(false);
      setBranchForm({ title: "", option_id: "" });
      
      // Reload the dialogue tree
      await loadDialogueTree();
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to create branch");
    } finally {
      setLoading(false);
    }
  };

  const handleEditOption = (option: DialogueOption) => {
    setEditingOption(option);
    setOptionForm({
      text: option.text,
      option_type: option.option_type,
      color: option.color,
      icon: option.icon,
      required_skill: option.required_skill || "",
      required_skill_value: option.required_skill_value || 0,
    });
    setShowAddOption(true);
  };

  const handleUpdateOption = async () => {
    if (!editingOption) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await updateDialogueOption(editingOption.id, optionForm);
      
      setShowAddOption(false);
      setEditingOption(null);
      setOptionForm({
        text: "",
        option_type: "response",
        color: "#3B82F6",
        icon: "💬",
        required_skill: "",
        required_skill_value: 0,
      });
      
      await loadDialogueTree();
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to update option");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    if (!confirm("Delete this option?")) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await deleteDialogueOption(optionId);
      await loadDialogueTree();
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to delete option");
    } finally {
      setLoading(false);
    }
  };

  const getOptionTypeIcon = (type: string) => {
    switch (type) {
      case "response": return "💬";
      case "choice": return "🎯";
      case "skill_check": return "🎲";
      case "condition": return "🔗";
      default: return "💬";
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "statement": return "💬";
      case "question": return "❓";
      case "action": return "⚡";
      case "narration": return "📖";
      default: return "💬";
    }
  };

  if (loading && !dialogueTree) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!dialogueTree) {
    return (
      <div className="text-center text-gray-400 py-8">
        Select a dialogue to edit its branching structure
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{dialogueTree.dialogue.title}</h2>
          <p className="text-gray-400">
            {dialogueTree.dialogue.posts_count} posts • {dialogueTree.dialogue.options_count} options • {dialogueTree.dialogue.branching_points_count} branches
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedCharacter}
            onChange={(e) => setSelectedCharacter(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="">All Characters</option>
            {characters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name}
              </option>
            ))}
          </select>
          
          <Button
            onClick={() => setShowAddBranch(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            🌿 Add Branch
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Dialogue Tree */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {dialogueTree.dialogue.posts?.map((post) => (
          <Card key={post.id} className="p-6">
            <div className="flex items-start space-x-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: post.color + "20", color: post.color }}
              >
                {getPostTypeIcon(post.post_type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-white">{post.speaker || "Narrator"}</span>
                  <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300">
                    {post.post_type}
                  </span>
                  {post.is_branching_point && (
                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                      Branch Point
                    </span>
                  )}
                </div>
                
                <p className="text-gray-300 mb-4">{post.text}</p>
                
                {/* Options */}
                {post.available_options && post.available_options.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-400">Options:</h4>
                    {post.available_options.map((option) => (
                      <div
                        key={option.id}
                        className={`p-3 rounded-lg border ${
                          option.is_accessible 
                            ? "bg-white/5 border-white/20" 
                            : "bg-red-500/10 border-red-500/30 opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{getOptionTypeIcon(option.option_type)}</span>
                            <span 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: option.color }}
                            ></span>
                            <span className="text-white">{option.text}</span>
                            <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300">
                              {option.option_type}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {option.next_dialogue && (
                              <span className="text-xs text-green-400">→ Branch</span>
                            )}
                            <button
                              onClick={() => handleEditOption(option)}
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteOption(option.id)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add Option Button */}
                <button
                  onClick={() => {
                    setSelectedPost(post);
                    setShowAddOption(true);
                    setEditingOption(null);
                    setOptionForm({
                      text: "",
                      option_type: "response",
                      color: "#3B82F6",
                      icon: "💬",
                      required_skill: "",
                      required_skill_value: 0,
                    });
                  }}
                  className="mt-3 text-sm text-indigo-400 hover:text-indigo-300"
                >
                  + Add Option
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Option Modal */}
      {showAddOption && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingOption ? "Edit Option" : "Add Option"}
            </h3>
            
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Option Text
                </label>
                <textarea
                  value={optionForm.text}
                  onChange={(e) => setOptionForm({ ...optionForm, text: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  rows={3}
                  placeholder="Enter option text..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={optionForm.option_type}
                    onChange={(e) => setOptionForm({ ...optionForm, option_type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="response">Response</option>
                    <option value="choice">Choice</option>
                    <option value="skill_check">Skill Check</option>
                    <option value="condition">Condition</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={optionForm.color}
                    onChange={(e) => setOptionForm({ ...optionForm, color: e.target.value })}
                    className="w-full h-10 bg-white/10 border border-white/20 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setShowAddOption(false)}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingOption ? handleUpdateOption : handleAddOption}
                  disabled={loading || !optionForm.text.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {editingOption ? "Update" : "Add"} Option
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      )}

      {/* Add Branch Modal */}
      {showAddBranch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Create Branch</h3>
            
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Branch Title
                </label>
                <input
                  type="text"
                  value={branchForm.title}
                  onChange={(e) => setBranchForm({ ...branchForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="Enter branch title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  From Option
                </label>
                <select
                  value={branchForm.option_id}
                  onChange={(e) => setBranchForm({ ...branchForm, option_id: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="">Select an option...</option>
                  {dialogueTree.dialogue.options?.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setShowAddBranch(false)}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateBranch}
                  disabled={loading || !branchForm.title.trim() || !branchForm.option_id}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Create Branch
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      )}
    </div>
  );
}
