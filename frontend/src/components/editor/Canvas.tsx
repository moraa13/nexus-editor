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
  { id: "n1", position: { x: 80, y: 80 }, data: { label: "Intro", text: "Начало разговора у костра.", type: "post" }, type: "post" },
  { id: "n2", position: { x: 360, y: 80 }, data: { label: "Choice A", text: "Спросить про дорогу.", type: "post" }, type: "post" },
  { id: "n3", position: { x: 360, y: 220 }, data: { label: "Choice B", text: "Помолчать и кивнуть.", type: "post" }, type: "post" },
  { id: "c1", position: { x: 80, y: 220 }, data: { label: "Герой", type: "character", isNPC: false }, type: "character" },
  { id: "c2", position: { x: 80, y: 20 }, data: { label: "Старец", type: "character", isNPC: true }, type: "character" },
];

const initialEdges: Edge[] = [
  { id: "e1", source: "n1", target: "n2", label: "→", markerEnd: { type: "arrow" }, animated: false },
  { id: "e2", source: "n1", target: "n3", label: "→", markerEnd: { type: "arrow" }, animated: false },
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
    <div className="h-full bg-gray-900 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <h2 className="text-lg font-semibold text-white">Dialogue Canvas</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={centerView} className="text-gray-300 hover:text-white">
            Center
          </Button>
          <Button 
            variant="danger" 
            onClick={deleteSelected} 
            disabled={selectedNodeIds.length + selectedEdgeIds.length === 0}
            className="text-gray-300 hover:text-white"
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="h-[calc(100%-60px)] relative rounded-lg border border-gray-600 bg-gray-800/50 overflow-hidden">
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
            style={{ backgroundColor: "#1f2937" }} 
            maskColor="#1f2937" 
            nodeStrokeColor="#6b7280" 
            nodeColor="#374151" 
            className="border border-gray-600"
          />
          <Controls 
            position="bottom-right" 
            showInteractive={false}
            style={{ backgroundColor: "#374151", border: "1px solid #6b7280" }}
          />
          <Background 
            color="#4b5563" 
            gap={24} 
            variant="lines" 
            size={1}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

