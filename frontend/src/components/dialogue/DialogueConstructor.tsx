import React, { useState, useCallback } from 'react';
import { DialogueTree, DialogueNode, generateId } from '../../types/discoElysium';
import DialogueCanvas from './DialogueCanvas';
import DialogueToolbar from './DialogueToolbar';
import { cn } from '../../lib/utils';
import { toast } from '../ui/SimpleToast';

interface DialogueConstructorProps {
  initialTree?: DialogueTree;
  onTreeChange?: (tree: DialogueTree) => void;
  className?: string;
}

export default function DialogueConstructor({
  initialTree,
  onTreeChange,
  className
}: DialogueConstructorProps) {
  const [dialogueTree, setDialogueTree] = useState<DialogueTree>(
    initialTree || {
      id: generateId('tree'),
      title: 'New Dialogue Tree',
      description: 'A new dialogue tree',
      startNodeId: '',
      nodes: [],
      characters: [],
      tags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );

  const [selectedNodeType, setSelectedNodeType] = useState<'dialogue' | 'skill_check' | 'narrative'>('dialogue');

  const handleTreeUpdate = useCallback((updatedTree: DialogueTree) => {
    const treeWithTimestamp = {
      ...updatedTree,
      updated_at: new Date().toISOString(),
    };
    setDialogueTree(treeWithTimestamp);
    onTreeChange?.(treeWithTimestamp);
  }, [onTreeChange]);

  const handleNodeTypeSelect = useCallback((type: 'dialogue' | 'skill_check' | 'narrative') => {
    setSelectedNodeType(type);
    // Make the node type available for drag and drop
    // This would be handled by the drag and drop system
  }, []);

  const handleSave = useCallback(() => {
    // Save to localStorage or API
    localStorage.setItem(`dialogue-tree-${dialogueTree.id}`, JSON.stringify(dialogueTree));
    toast.success('Dialogue tree saved!');
  }, [dialogueTree]);

  const handleLoad = useCallback(() => {
    // Load from localStorage or API
    const saved = localStorage.getItem(`dialogue-tree-${dialogueTree.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDialogueTree(parsed);
        toast.success('Dialogue tree loaded!');
      } catch (error) {
        toast.error('Failed to load dialogue tree');
      }
    } else {
      toast.error('No saved dialogue tree found');
    }
  }, [dialogueTree.id]);

  const handleExport = useCallback(() => {
    // Export as JSON
    const dataStr = JSON.stringify(dialogueTree, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${dialogueTree.title.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Dialogue tree exported!');
  }, [dialogueTree]);

  const handleAIGenerate = useCallback(() => {
    // AI Generation placeholder
    toast.success('AI generation feature coming soon!');
  }, []);

  const handlePlay = useCallback(() => {
    // Play dialogue tree
    toast.success('Dialogue playback feature coming soon!');
  }, []);

  const handleReset = useCallback(() => {
    if (confirm('Are you sure you want to reset the dialogue tree? This will delete all nodes.')) {
      setDialogueTree(prev => ({
        ...prev,
        nodes: [],
        startNodeId: '',
        updated_at: new Date().toISOString(),
      }));
      toast.success('Dialogue tree reset!');
    }
  }, []);

  return (
    <div className={cn("w-full h-full flex flex-col bg-gray-900", className)}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{dialogueTree.title}</h2>
            <p className="text-sm text-gray-400">{dialogueTree.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              {dialogueTree.nodes.length} nodes
            </div>
            <div className="text-sm text-gray-400">
              Last updated: {new Date(dialogueTree.updated_at).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <DialogueToolbar
        onNodeTypeSelect={handleNodeTypeSelect}
        onSave={handleSave}
        onLoad={handleLoad}
        onExport={handleExport}
        onAIGenerate={handleAIGenerate}
        onPlay={handlePlay}
        onReset={handleReset}
        className="border-b border-gray-700"
      />

      {/* Canvas */}
      <div className="flex-1 relative">
        <DialogueCanvas
          dialogueTree={dialogueTree}
          onTreeUpdate={handleTreeUpdate}
          className="w-full h-full"
        />

        {/* Drag and Drop Instructions */}
        {dialogueTree.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-4xl mb-6 mx-auto">
                💬
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Start Building Your Dialogue</h3>
              <p className="text-gray-400 mb-6">
                Use the toolbar above to add dialogue nodes, skill checks, and narrative elements to create your interactive story.
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl mb-2 mx-auto">
                    💬
                  </div>
                  <div className="text-gray-300">Dialogue</div>
                  <div className="text-gray-500 text-xs">Character speech</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white text-xl mb-2 mx-auto">
                    🎲
                  </div>
                  <div className="text-gray-300">Skill Check</div>
                  <div className="text-gray-500 text-xs">Disco Elysium style</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center text-white text-xl mb-2 mx-auto">
                    📖
                  </div>
                  <div className="text-gray-300">Narrative</div>
                  <div className="text-gray-500 text-xs">Scene description</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
