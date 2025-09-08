import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, addEdge, useEdgesState, useNodesState } from "reactflow";
import type { Connection, Edge, Node, NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import Button from "../notus/Button";

type NodeData = {
  label: string;
  text?: string; // for posts
  type?: "post" | "character"; // character covers NPC too
  isNPC?: boolean; // only for character
};

// Custom Node: PostNode
function PostNode({ data }: NodeProps<NodeData>) {
  return (
    <div className="w-56 max-w-[18rem] rounded-lg bg-slate-800/90 ring-1 ring-slate-700 shadow">
      <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-200 truncate">Post</div>
        <Button className="px-2 py-1 text-xs" variant="ghost">Редактировать</Button>
      </div>
      <div className="p-3 text-slate-200">
        <div className="text-sm font-medium mb-1 truncate" title={data.label}>{data.label}</div>
        {data.text ? <div className="text-xs text-slate-300/80 line-clamp-4 whitespace-pre-wrap">{data.text}</div> : null}
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

const nodeTypes = {
  post: PostNode,
  character: CharacterNode,
};

const initialNodes: Node<NodeData>[] = [
  // Start with empty canvas to show welcome message
];

const initialEdges: Edge[] = [
  // Start with empty edges
];

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<string[]>([]);

  // Dark theme adjustments
  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

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
              <h2 className="text-lg font-semibold text-white">Dialogue Canvas</h2>
              <p className="text-xs text-gray-400">Visual node editor for dialogue flow</p>
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
      
      {/* Canvas Area */}
      <div className="flex-1 relative bg-gradient-to-br from-gray-900/50 to-gray-800/50">
        {nodes.length === 0 ? (
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

