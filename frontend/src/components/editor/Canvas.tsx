import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, addEdge, useEdgesState, useNodesState } from "reactflow";
import type { Connection, Edge, Node, NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import Button from "../notus/Button";
import { Dialogue, Post, DialogueOption, DialogueTreeResponse, Quest } from "../../types";
import { getDialogueTree } from "../../api/dialogue";
import { listQuests } from "../../api/quest";

type NodeData = {
  label: string;
  text?: string; // for posts
  type?: "post" | "character" | "option" | "branch" | "quest"; // character covers NPC too
  isNPC?: boolean; // only for character
  postType?: string;
  optionType?: string;
  questType?: string;
  questStatus?: string;
  color?: string;
  icon?: string;
  isBranchingPoint?: boolean;
  hasOptions?: boolean;
  postId?: string;
  optionId?: string;
  dialogueId?: string;
  questId?: string;
};

// Custom Node: PostNode
function PostNode({ data }: NodeProps<NodeData>) {
  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "statement": return "💬";
      case "question": return "❓";
      case "action": return "⚡";
      case "narration": return "📖";
      default: return "💬";
    }
  };

  return (
    <div 
      className="w-64 max-w-[20rem] rounded-lg bg-slate-800/90 ring-1 ring-slate-700 shadow transition-all duration-200 hover:ring-2 hover:ring-indigo-500/50"
      style={{ borderColor: data.color ? `${data.color}40` : undefined }}
    >
      <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getPostTypeIcon(data.postType || "statement")}</span>
          <div className="text-xs font-semibold text-slate-200 truncate">
            {data.postType || "Post"}
          </div>
          {data.isBranchingPoint && (
            <span className="text-xs px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
              Branch
            </span>
          )}
        </div>
        <Button className="px-2 py-1 text-xs" variant="ghost">Edit</Button>
      </div>
      <div className="p-3 text-slate-200">
        <div className="text-sm font-medium mb-1 truncate" title={data.label}>{data.label}</div>
        {data.text ? (
          <div className="text-xs text-slate-300/80 line-clamp-4 whitespace-pre-wrap">{data.text}</div>
        ) : null}
        {data.hasOptions && (
          <div className="mt-2 text-xs text-indigo-400">
            Has {data.hasOptions ? "options" : "no options"}
          </div>
        )}
      </div>
    </div>
  );
}

// Custom Node: CharacterNode (supports NPC via data.isNPC)
function CharacterNode({ data }: NodeProps<NodeData>) {
  return (
    <div className="w-48 rounded-lg bg-slate-800/90 ring-1 ring-slate-700 shadow px-3 py-2 flex items-center gap-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${data.isNPC ? "bg-amber-600/70" : "bg-indigo-600/70"}`}>
        <span className="text-xs text-white">{data.isNPC ? "N" : "C"}</span>
      </div>
      <div className="truncate">
        <div className="text-sm font-semibold text-slate-200 truncate" title={data.label}>{data.label}</div>
        <div className="text-[10px] text-slate-400">{data.isNPC ? "NPC" : "Character"}</div>
      </div>
    </div>
  );
}

// Custom Node: OptionNode
function OptionNode({ data }: NodeProps<NodeData>) {
  const getOptionTypeIcon = (type: string) => {
    switch (type) {
      case "response": return "💬";
      case "choice": return "🎯";
      case "skill_check": return "🎲";
      case "condition": return "🔗";
      default: return "💬";
    }
  };

  return (
    <div 
      className="w-56 rounded-lg bg-slate-800/90 ring-1 ring-slate-700 shadow transition-all duration-200 hover:ring-2 hover:ring-indigo-500/50"
      style={{ borderColor: data.color ? `${data.color}40` : undefined }}
    >
      <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getOptionTypeIcon(data.optionType || "response")}</span>
          <div className="text-xs font-semibold text-slate-200 truncate">
            {data.optionType || "Option"}
          </div>
        </div>
        <Button className="px-2 py-1 text-xs" variant="ghost">Edit</Button>
      </div>
      <div className="p-3 text-slate-200">
        <div className="text-sm font-medium mb-1 truncate" title={data.label}>{data.label}</div>
        {data.text ? (
          <div className="text-xs text-slate-300/80 line-clamp-3 whitespace-pre-wrap">{data.text}</div>
        ) : null}
      </div>
    </div>
  );
}

// Custom Node: BranchNode
function BranchNode({ data }: NodeProps<NodeData>) {
  return (
    <div className="w-48 rounded-lg bg-gradient-to-br from-purple-800/90 to-indigo-800/90 ring-1 ring-purple-600/50 shadow px-3 py-2 flex items-center gap-2">
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-600/70">
        <span className="text-xs text-white">🌿</span>
      </div>
      <div className="truncate">
        <div className="text-sm font-semibold text-slate-200 truncate" title={data.label}>{data.label}</div>
        <div className="text-[10px] text-purple-300">Branch</div>
      </div>
    </div>
  );
}

// Custom Node: QuestNode
function QuestNode({ data }: NodeProps<NodeData>) {
  const getQuestStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10B981';
      case 'active': return '#3B82F6';
      case 'completed': return '#8B5CF6';
      case 'failed': return '#EF4444';
      case 'locked': return '#6B7280';
      case 'paused': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <div 
      className="w-56 rounded-lg bg-slate-800/90 ring-1 ring-slate-700 shadow transition-all duration-200 hover:ring-2 hover:ring-indigo-500/50"
      style={{ borderColor: data.color ? `${data.color}40` : undefined }}
    >
      <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{data.icon || "📋"}</span>
          <div className="text-xs font-semibold text-slate-200 truncate">
            Quest
          </div>
          {data.questStatus && (
            <span 
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ 
                backgroundColor: getQuestStatusColor(data.questStatus) + "20",
                color: getQuestStatusColor(data.questStatus)
              }}
            >
              {data.questStatus}
            </span>
          )}
        </div>
        <Button className="px-2 py-1 text-xs" variant="ghost">Edit</Button>
      </div>
      <div className="p-3 text-slate-200">
        <div className="text-sm font-medium mb-1 truncate" title={data.label}>{data.label}</div>
        {data.text ? (
          <div className="text-xs text-slate-300/80 line-clamp-3 whitespace-pre-wrap">{data.text}</div>
        ) : null}
        {data.questType && (
          <div className="mt-2 text-xs text-indigo-400">
            {data.questType}
          </div>
        )}
      </div>
    </div>
  );
}

const nodeTypes = {
  post: PostNode,
  character: CharacterNode,
  option: OptionNode,
  branch: BranchNode,
  quest: QuestNode,
};

const initialNodes: Node<NodeData>[] = [
  // Start with empty canvas to show welcome message
];

const initialEdges: Edge[] = [
  // Start with empty edges
];

interface CanvasProps {
  dialogueId?: string;
  characterId?: string;
}

export default function Canvas({ dialogueId, characterId }: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<string[]>([]);
  const [dialogueTree, setDialogueTree] = useState<DialogueTreeResponse | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dark theme adjustments
  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  // Load dialogue tree
  const loadDialogueTree = useCallback(async () => {
    if (!dialogueId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDialogueTree(dialogueId, characterId);
      setDialogueTree(response.data);
      buildDialogueNodes(response.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to load dialogue tree");
    } finally {
      setLoading(false);
    }
  }, [dialogueId, characterId]);

  // Load quests
  const loadQuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await listQuests(characterId);
      setQuests(response.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to load quests");
    } finally {
      setLoading(false);
    }
  }, [characterId]);

  // Build nodes and edges from dialogue tree and quests
  const buildDialogueNodes = useCallback((tree: DialogueTreeResponse) => {
    const newNodes: Node<NodeData>[] = [];
    const newEdges: Edge[] = [];
    let nodeId = 0;

    // Add dialogue title node
    newNodes.push({
      id: `dialogue-${tree.dialogue.id}`,
      type: "branch",
      position: { x: 100, y: 50 },
      data: {
        label: tree.dialogue.title,
        type: "branch",
        dialogueId: tree.dialogue.id,
      },
    });

    // Add posts and their options
    tree.dialogue.posts?.forEach((post, postIndex) => {
      const postNodeId = `post-${post.id}`;
      const postX = 100 + (postIndex % 3) * 300;
      const postY = 200 + Math.floor(postIndex / 3) * 200;

      // Add post node
      newNodes.push({
        id: postNodeId,
        type: "post",
        position: { x: postX, y: postY },
        data: {
          label: post.speaker || "Narrator",
          text: post.text,
          type: "post",
          postType: post.post_type,
          color: post.color,
          icon: post.icon,
          isBranchingPoint: post.is_branching_point,
          hasOptions: post.has_options,
          postId: post.id,
        },
      });

      // Connect dialogue to first post
      if (postIndex === 0) {
        newEdges.push({
          id: `edge-dialogue-${postNodeId}`,
          source: `dialogue-${tree.dialogue.id}`,
          target: postNodeId,
          type: "smoothstep",
          style: { stroke: "#6366f1", strokeWidth: 2 },
          markerEnd: { type: "arrow", color: "#6366f1" },
        });
      }

      // Add options for this post
      post.available_options?.forEach((option, optionIndex) => {
        const optionNodeId = `option-${option.id}`;
        const optionX = postX + 200;
        const optionY = postY + (optionIndex * 80);

        newNodes.push({
          id: optionNodeId,
          type: "option",
          position: { x: optionX, y: optionY },
          data: {
            label: option.text.substring(0, 30) + (option.text.length > 30 ? "..." : ""),
            text: option.text,
            type: "option",
            optionType: option.option_type,
            color: option.color,
            icon: option.icon,
            optionId: option.id,
          },
        });

        // Connect post to option
        newEdges.push({
          id: `edge-${postNodeId}-${optionNodeId}`,
          source: postNodeId,
          target: optionNodeId,
          type: "smoothstep",
          style: { 
            stroke: option.color || "#3B82F6", 
            strokeWidth: 2,
            strokeDasharray: option.is_accessible ? "0" : "5,5"
          },
          markerEnd: { type: "arrow", color: option.color || "#3B82F6" },
        });

        // If option leads to another dialogue, add branch node
        if (option.next_dialogue) {
          const branchNodeId = `branch-${option.next_dialogue}`;
          const branchX = optionX + 200;
          const branchY = optionY;

          newNodes.push({
            id: branchNodeId,
            type: "branch",
            position: { x: branchX, y: branchY },
            data: {
              label: option.next_dialogue_title || "New Branch",
              type: "branch",
              dialogueId: option.next_dialogue,
            },
          });

          // Connect option to branch
          newEdges.push({
            id: `edge-${optionNodeId}-${branchNodeId}`,
            source: optionNodeId,
            target: branchNodeId,
            type: "smoothstep",
            style: { stroke: "#8B5CF6", strokeWidth: 2 },
            markerEnd: { type: "arrow", color: "#8B5CF6" },
          });
        }
      });
    });

    // Add quest nodes
    quests.forEach((quest, questIndex) => {
      const questNodeId = `quest-${quest.id}`;
      const questX = 100 + (questIndex % 2) * 400;
      const questY = 50 + Math.floor(questIndex / 2) * 300;

      newNodes.push({
        id: questNodeId,
        type: "quest",
        position: { x: questX, y: questY },
        data: {
          label: quest.title,
          text: quest.description,
          type: "quest",
          questType: quest.quest_type,
          questStatus: quest.status,
          color: quest.color,
          icon: quest.icon,
          questId: quest.id,
        },
      });

      // Connect quest to related dialogues
      if (quest.start_dialogue) {
        const dialogueNodeId = `dialogue-${quest.start_dialogue}`;
        if (newNodes.find(n => n.id === dialogueNodeId)) {
          newEdges.push({
            id: `edge-${questNodeId}-${dialogueNodeId}`,
            source: questNodeId,
            target: dialogueNodeId,
            type: "smoothstep",
            style: { stroke: quest.color, strokeWidth: 2, strokeDasharray: "5,5" },
            markerEnd: { type: "arrow", color: quest.color },
            label: "starts",
          });
        }
      }

      if (quest.completion_dialogue) {
        const dialogueNodeId = `dialogue-${quest.completion_dialogue}`;
        if (newNodes.find(n => n.id === dialogueNodeId)) {
          newEdges.push({
            id: `edge-${dialogueNodeId}-${questNodeId}`,
            source: dialogueNodeId,
            target: questNodeId,
            type: "smoothstep",
            style: { stroke: quest.color, strokeWidth: 2, strokeDasharray: "5,5" },
            markerEnd: { type: "arrow", color: quest.color },
            label: "completes",
          });
        }
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [setNodes, setEdges, quests]);

  // Load dialogue tree when dialogueId changes
  useEffect(() => {
    loadDialogueTree();
  }, [loadDialogueTree]);

  // Load quests on mount
  useEffect(() => {
    loadQuests();
  }, [loadQuests]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          markerEnd: { type: "arrow" },
          style: { stroke: "#64748b" },
        },
        eds
      )
    );
  }, [setEdges]);

  const onSelectionChange = useCallback((sel: { nodes: Node[]; edges: Edge[] }) => {
    setSelectedNodeIds(sel.nodes.map((n) => n.id));
    setSelectedEdgeIds(sel.edges.map((e) => e.id));
  }, []);

  const deleteSelected = useCallback(() => {
    if (selectedNodeIds.length === 0 && selectedEdgeIds.length === 0) return;
    setNodes((nds) => nds.filter((n) => !selectedNodeIds.includes(n.id)));
    setEdges((eds) => eds.filter((e) => !selectedEdgeIds.includes(e.id) && !selectedNodeIds.includes(e.source) && !selectedNodeIds.includes(e.target)));
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
  }, [selectedNodeIds, selectedEdgeIds, setNodes, setEdges]);

  // Handle Delete key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelected();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deleteSelected]);

  const centerView = useCallback(() => {
    // noop placeholder: users can use Controls to fit view
  }, []);

  return (
    <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {dialogueTree ? dialogueTree.dialogue.title : "Dialogue Canvas"}
              </h2>
              <p className="text-xs text-gray-400">
                {dialogueTree 
                  ? `Visual flow: ${dialogueTree.dialogue.posts_count} posts, ${dialogueTree.dialogue.options_count} options, ${dialogueTree.dialogue.branching_points_count} branches`
                  : quests.length > 0
                  ? `Quests: ${quests.length} total, ${quests.filter(q => q.status === 'active').length} active`
                  : "Visual node editor for dialogue flow"
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={centerView} 
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Center
            </Button>
            <Button 
              variant="danger" 
              onClick={deleteSelected} 
              disabled={selectedNodeIds.length + selectedEdgeIds.length === 0}
              className="text-gray-300 hover:text-white hover:bg-red-500/20 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </Button>
          </div>
        </div>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Canvas Area */}
      <div className="flex-1 relative bg-gradient-to-br from-gray-900/50 to-gray-800/50">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p>Loading dialogue tree...</p>
            </div>
          </div>
        ) : nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Welcome to Dialogue Canvas</h3>
              <p className="text-sm text-gray-400 mb-4">Select a dialogue from the sidebar to start editing</p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <span>💡</span>
                <span>Tip: Use the sidebar to manage your scenes, characters, and dialogues</span>
              </div>
            </div>
          </div>
        ) : (
          <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          fitView
          proOptions={proOptions}
          className="reactflow-dark"
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={2}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
        >
          <MiniMap 
            pannable 
            zoomable 
            style={{ 
              backgroundColor: "rgba(17, 24, 39, 0.8)", 
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px"
            }} 
            maskColor="rgba(17, 24, 39, 0.8)" 
            nodeStrokeColor="#6366f1" 
            nodeColor="#4f46e5" 
            className="border border-white/10"
          />
          <Controls 
            position="bottom-right" 
            showInteractive={false}
            style={{ 
              backgroundColor: "rgba(17, 24, 39, 0.8)", 
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px"
            }}
          />
          <Background 
            color="rgba(255, 255, 255, 0.05)" 
            gap={32} 
            variant="dots" 
            size={1}
          />
        </ReactFlow>
        )}
      </div>
    </div>
  );
}

