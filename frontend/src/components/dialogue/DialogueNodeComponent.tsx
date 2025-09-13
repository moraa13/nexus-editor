import React, { useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { DialogueNode } from '../../types/discoElysium';
import { cn } from '../../lib/utils';
import { Edit, Trash2, Plus, MessageCircle } from 'lucide-react';

interface DialogueNodeData extends DialogueNode {
  onUpdate: (node: DialogueNode) => void;
  onDelete: (nodeId: string) => void;
}

export default function DialogueNodeComponent({ data, selected }: NodeProps<DialogueNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.text);
  const [speaker, setSpeaker] = useState(data.speaker || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    data.onUpdate({
      ...data,
      text,
      speaker: speaker.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(data.text);
    setSpeaker(data.speaker || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this dialogue node?')) {
      data.onDelete(data.id);
    }
  };

  const addChoice = () => {
    const newChoices = [
      ...(data.choices || []),
      {
        id: `choice-${Date.now()}`,
        text: 'New choice...',
        nextNodeId: undefined,
      }
    ];
    data.onUpdate({
      ...data,
      choices: newChoices,
    });
  };

  const updateChoice = (choiceId: string, updates: Partial<{ text: string; nextNodeId?: string }>) => {
    const updatedChoices = data.choices?.map(choice =>
      choice.id === choiceId ? { ...choice, ...updates } : choice
    );
    data.onUpdate({
      ...data,
      choices: updatedChoices,
    });
  };

  const deleteChoice = (choiceId: string) => {
    const updatedChoices = data.choices?.filter(choice => choice.id !== choiceId);
    data.onUpdate({
      ...data,
      choices: updatedChoices,
    });
  };

  return (
    <div className={cn(
      "min-w-[200px] max-w-[300px] bg-gray-800 border-2 rounded-xl shadow-lg transition-all duration-200",
      selected ? "border-blue-400 shadow-blue-400/20" : "border-gray-600 hover:border-gray-500",
      data.color && `border-${data.color}-400`
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-white">Dialogue</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Speaker</label>
              <input
                type="text"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                placeholder="Character name..."
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Text</label>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Dialogue text..."
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-400 resize-none"
                rows={3}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {data.speaker && (
              <div className="text-sm font-semibold text-blue-400">{data.speaker}</div>
            )}
            <div className="text-sm text-gray-300 leading-relaxed">
              {text}
            </div>
          </div>
        )}

        {/* Choices */}
        {data.choices && data.choices.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-400 mb-2">Choices:</div>
            <div className="space-y-1">
              {data.choices.map((choice, index) => (
                <div key={choice.id} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{index + 1}.</span>
                  <input
                    type="text"
                    value={choice.text}
                    onChange={(e) => updateChoice(choice.id, { text: e.target.value })}
                    className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none focus:border-blue-400"
                    placeholder="Choice text..."
                  />
                  <button
                    onClick={() => deleteChoice(choice.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Choice Button */}
        <button
          onClick={addChoice}
          className="mt-2 w-full flex items-center justify-center gap-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded text-gray-300 text-xs transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add Choice
        </button>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-gray-800"
      />
      {data.choices && data.choices.length > 0 && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-blue-400 border-2 border-gray-800"
        />
      )}
    </div>
  );
}
