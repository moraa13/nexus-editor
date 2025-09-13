import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  ReactFlowInstance,
  BackgroundVariant,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { DialogueNode, DialogueTree, DialogueEditorState } from '../../types/discoElysium';
import DialogueNodeComponent from './DialogueNodeComponent';
import SkillCheckNodeComponent from './SkillCheckNodeComponent';
import NarrativeNodeComponent from './NarrativeNodeComponent';
import { cn } from '../../lib/utils';

interface DialogueCanvasProps {
  dialogueTree: DialogueTree;
  onTreeUpdate: (tree: DialogueTree) => void;
  selectedCharacterId?: string;
  className?: string;
}

const nodeTypes: NodeTypes = {
  dialogue: DialogueNodeComponent,
  skill_check: SkillCheckNodeComponent,
  narrative: NarrativeNodeComponent,
};

const edgeTypes: EdgeTypes = {};

export default function DialogueCanvas({
  dialogueTree,
  onTreeUpdate,
  selectedCharacterId,
  className
}: DialogueCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  // Convert dialogue nodes to React Flow nodes
  const initialNodes: Node[] = useMemo(() => 
    dialogueTree.nodes.map(node => ({
      id: node.id,
      type: node.type === 'skill_check' ? 'skill_check' : 
            node.type === 'narrative' ? 'narrative' : 'dialogue',
      position: node.position,
      data: {
        ...node,
        onUpdate: (updatedNode: DialogueNode) => {
          const updatedNodes = dialogueTree.nodes.map(n => 
            n.id === updatedNode.id ? updatedNode : n
          );
          onTreeUpdate({
            ...dialogueTree,
            nodes: updatedNodes
          });
        },
        onDelete: (nodeId: string) => {
          const updatedNodes = dialogueTree.nodes.filter(n => n.id !== nodeId);
          onTreeUpdate({
            ...dialogueTree,
            nodes: updatedNodes
          });
        }
      },
      draggable: true,
    })), [dialogueTree, onTreeUpdate]
  );

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    
    // Create edges based on node connections
    dialogueTree.nodes.forEach(node => {
      if (node.choices) {
        node.choices.forEach(choice => {
          if (choice.nextNodeId) {
            edges.push({
              id: `${node.id}-${choice.id}`,
              source: node.id,
              target: choice.nextNodeId,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#8B5CF6', strokeWidth: 2 },
              label: choice.text.length > 20 ? `${choice.text.substring(0, 20)}...` : choice.text,
              labelStyle: { fontSize: 12, fill: '#8B5CF6' },
              labelBgStyle: { fill: '#1F2937', fillOpacity: 0.8 },
            });
          }
        });
      }
    });
    
    return edges;
  }, [dialogueTree.nodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when dialogueTree changes
  useEffect(() => {
    const updatedNodes: Node[] = dialogueTree.nodes.map(node => ({
      id: node.id,
      type: node.type === 'skill_check' ? 'skill_check' : 
            node.type === 'narrative' ? 'narrative' : 'dialogue',
      position: node.position,
      data: {
        ...node,
        onUpdate: (updatedNode: DialogueNode) => {
          const updatedNodes = dialogueTree.nodes.map(n => 
            n.id === updatedNode.id ? updatedNode : n
          );
          onTreeUpdate({
            ...dialogueTree,
            nodes: updatedNodes
          });
        },
        onDelete: (nodeId: string) => {
          const updatedNodes = dialogueTree.nodes.filter(n => n.id !== nodeId);
          onTreeUpdate({
            ...dialogueTree,
            nodes: updatedNodes
          });
        }
      },
      draggable: true,
    }));
    setNodes(updatedNodes);
  }, [dialogueTree.nodes, onTreeUpdate, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: DialogueNode = {
        id: `node-${Date.now()}`,
        type: type as any,
        text: type === 'narrative' ? 'Narrative text...' : 'New dialogue...',
        position,
        speaker: type === 'narrative' ? undefined : 'Speaker',
        choices: type === 'dialogue' ? [] : undefined,
        color: type === 'skill_check' ? '#EF4444' : 
               type === 'narrative' ? '#6B7280' : '#3B82F6',
        icon: type === 'skill_check' ? '🎲' : 
              type === 'narrative' ? '📖' : '💬'
      };

      const updatedNodes = [...dialogueTree.nodes, newNode];
      onTreeUpdate({
        ...dialogueTree,
        nodes: updatedNodes
      });
    },
    [reactFlowInstance, dialogueTree, onTreeUpdate]
  );

  const onNodeDragStop = useCallback((_event: React.MouseEvent, node: Node) => {
    const updatedNode = dialogueTree.nodes.find(n => n.id === node.id);
    if (updatedNode) {
      const updatedNodes = dialogueTree.nodes.map(n =>
        n.id === node.id ? { ...n, position: node.position } : n
      );
      onTreeUpdate({
        ...dialogueTree,
        nodes: updatedNodes
      });
    }
  }, [dialogueTree, onTreeUpdate]);

  return (
    <div className={cn("w-full h-full", className)} ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          attributionPosition="bottom-left"
          className="bg-gray-900"
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            color="#374151"
          />
          <Controls 
            className="bg-gray-800 border-gray-700"
            showInteractive={false}
          />
          <MiniMap 
            className="bg-gray-800 border-gray-700"
            nodeColor={(node) => {
              switch (node.type) {
                case 'skill_check': return '#EF4444';
                case 'narrative': return '#6B7280';
                default: return '#3B82F6';
              }
            }}
            maskColor="rgba(0, 0, 0, 0.6)"
          />
          
          {/* Custom Panel for quick actions */}
          <Panel position="top-right" className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3">
            <div className="flex gap-2">
              <button
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                onClick={() => {
                  // Zoom to fit
                  reactFlowInstance?.fitView();
                }}
              >
                📐 Fit View
              </button>
              <button
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                onClick={() => {
                  // Save dialogue tree
                  console.log('Saving dialogue tree...', dialogueTree);
                }}
              >
                💾 Save
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
