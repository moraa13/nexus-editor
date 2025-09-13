import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { DialogueNode, SkillCheck, SKILL_CATEGORIES } from '../../types/discoElysium';
import { cn, getDifficultyColor } from '../../lib/utils';
import { Edit, Trash2, Dice1, Zap } from 'lucide-react';

interface SkillCheckNodeData extends DialogueNode {
  onUpdate: (node: DialogueNode) => void;
  onDelete: (nodeId: string) => void;
}

export default function SkillCheckNodeComponent({ data, selected }: NodeProps<SkillCheckNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [skillCheck, setSkillCheck] = useState<SkillCheck>(data.skillCheck || {
    id: `skillcheck-${Date.now()}`,
    skill: 'logic',
    difficulty: 'Medium',
    dcValue: 15,
    description: 'Skill check description...',
    successText: 'Success!',
    failureText: 'Failure.',
    isPassive: false,
    isRed: false,
    isWhite: true,
  });

  const handleSave = () => {
    data.onUpdate({
      ...data,
      skillCheck,
      text: skillCheck.description,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSkillCheck(data.skillCheck || skillCheck);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this skill check node?')) {
      data.onDelete(data.id);
    }
  };

  const getSkillInfo = (skillName: string) => {
    for (const [category, info] of Object.entries(SKILL_CATEGORIES)) {
      if (info.skills.includes(skillName)) {
        return { category, color: info.color };
      }
    }
    return { category: 'Unknown', color: '#6B7280' };
  };

  const skillInfo = getSkillInfo(skillCheck.skill);

  return (
    <div className={cn(
      "min-w-[250px] max-w-[350px] bg-gray-800 border-2 rounded-xl shadow-lg transition-all duration-200",
      selected ? "border-red-400 shadow-red-400/20" : "border-gray-600 hover:border-gray-500",
      skillCheck.isRed && "border-red-500",
      skillCheck.isWhite && "border-gray-400"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          {skillCheck.isRed ? (
            <Zap className="w-4 h-4 text-red-400" />
          ) : (
            <Dice1 className="w-4 h-4 text-yellow-400" />
          )}
          <span className="text-sm font-semibold text-white">
            {skillCheck.isPassive ? 'Passive Check' : 'Active Check'}
          </span>
          {skillCheck.isRed && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
              RED
            </span>
          )}
          {skillCheck.isWhite && (
            <span className="px-2 py-1 bg-gray-400 text-white text-xs rounded-full">
              WHITE
            </span>
          )}
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
              <label className="block text-xs text-gray-400 mb-1">Skill</label>
              <select
                value={skillCheck.skill}
                onChange={(e) => setSkillCheck({ ...skillCheck, skill: e.target.value as any })}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-400"
              >
                {Object.entries(SKILL_CATEGORIES).map(([category, info]) => (
                  <optgroup key={category} label={category}>
                    {info.skills.map(skill => (
                      <option key={skill} value={skill}>
                        {skill.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Difficulty</label>
              <select
                value={skillCheck.difficulty}
                onChange={(e) => setSkillCheck({ 
                  ...skillCheck, 
                  difficulty: e.target.value as any,
                  dcValue: e.target.value === 'Trivial' ? 5 :
                           e.target.value === 'Easy' ? 10 :
                           e.target.value === 'Medium' ? 15 :
                           e.target.value === 'Hard' ? 20 :
                           e.target.value === 'Extreme' ? 25 : 30
                })}
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-400"
              >
                <option value="Trivial">Trivial (5)</option>
                <option value="Easy">Easy (10)</option>
                <option value="Medium">Medium (15)</option>
                <option value="Hard">Hard (20)</option>
                <option value="Extreme">Extreme (25)</option>
                <option value="Impossible">Impossible (30)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea
                value={skillCheck.description}
                onChange={(e) => setSkillCheck({ ...skillCheck, description: e.target.value })}
                placeholder="What is the character trying to do?"
                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-400 resize-none"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Success Text</label>
                <textarea
                  value={skillCheck.successText}
                  onChange={(e) => setSkillCheck({ ...skillCheck, successText: e.target.value })}
                  placeholder="Success result..."
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none focus:border-green-400 resize-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Failure Text</label>
                <textarea
                  value={skillCheck.failureText}
                  onChange={(e) => setSkillCheck({ ...skillCheck, failureText: e.target.value })}
                  placeholder="Failure result..."
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none focus:border-red-400 resize-none"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={skillCheck.isPassive}
                  onChange={(e) => setSkillCheck({ ...skillCheck, isPassive: e.target.checked })}
                  className="rounded"
                />
                Passive Check
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={skillCheck.isRed}
                  onChange={(e) => setSkillCheck({ ...skillCheck, isRed: e.target.checked })}
                  className="rounded"
                />
                Red Check
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={skillCheck.isWhite}
                  onChange={(e) => setSkillCheck({ ...skillCheck, isWhite: e.target.checked })}
                  className="rounded"
                />
                White Check
              </label>
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
          <div className="space-y-3">
            {/* Skill Info */}
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: skillInfo.color }}
              />
              <span className="text-sm font-semibold text-white">
                {skillCheck.skill.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
              <span 
                className="px-2 py-1 text-xs rounded-full text-white"
                style={{ backgroundColor: getDifficultyColor(skillCheck.difficulty) }}
              >
                {skillCheck.difficulty} (DC {skillCheck.dcValue})
              </span>
            </div>

            {/* Description */}
            <div className="text-sm text-gray-300">
              {skillCheck.description}
            </div>

            {/* Check Type */}
            <div className="flex gap-2 text-xs">
              {skillCheck.isPassive && (
                <span className="px-2 py-1 bg-blue-500 text-white rounded">Passive</span>
              )}
              {skillCheck.isRed && (
                <span className="px-2 py-1 bg-red-500 text-white rounded">Red</span>
              )}
              {skillCheck.isWhite && (
                <span className="px-2 py-1 bg-gray-500 text-white rounded">White</span>
              )}
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-green-500/20 border border-green-500/30 rounded">
                <div className="text-green-400 font-semibold mb-1">Success:</div>
                <div className="text-gray-300">{skillCheck.successText}</div>
              </div>
              <div className="p-2 bg-red-500/20 border border-red-500/30 rounded">
                <div className="text-red-400 font-semibold mb-1">Failure:</div>
                <div className="text-gray-300">{skillCheck.failureText}</div>
              </div>
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
        className="w-3 h-3 bg-red-400 border-2 border-gray-800"
      />
    </div>
  );
}
