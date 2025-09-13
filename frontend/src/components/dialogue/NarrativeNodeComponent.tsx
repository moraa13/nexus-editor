import React, { useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { DialogueNode } from '../../types/discoElysium';
import { cn } from '../../lib/utils';
import { Edit, Trash2, BookOpen } from 'lucide-react';

interface NarrativeNodeData extends DialogueNode {
  onUpdate: (node: DialogueNode) => void;
  onDelete: (nodeId: string) => void;
}

export default function NarrativeNodeComponent({ data, selected }: NodeProps<NarrativeNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    data.onUpdate({
      ...data,
      text,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(data.text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this narrative node?')) {
      data.onDelete(data.id);
    }
  };

  return (
    <div className={cn(
      "min-w-[200px] max-w-[300px] bg-gray-800 border-2 rounded-xl shadow-lg transition-all duration-200",
      selected ? "border-gray-400 shadow-gray-400/20" : "border-gray-600 hover:border-gray-500"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-white">Narrative</span>
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
              <label className="block text-xs text-gray-400 mb-1">Narrative Text</label>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe what happens..."
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-400 resize-none"
                rows={4}
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
            <div className="text-sm text-gray-300 leading-relaxed italic">
              {text}
            </div>
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-gray-800"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-gray-800"
      />
    </div>
  );
}
