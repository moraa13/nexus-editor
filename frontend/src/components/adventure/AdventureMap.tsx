import { useState, useEffect, useRef } from 'react';
import AdventureNode from './AdventureNode';
import { api } from '../../lib/api';

interface NodeData {
  id: string;
  type: 'dialogue' | 'quest' | 'skill_check' | 'location';
  title: string;
  description?: string;
  icon: string;
  x: number;
  y: number;
  isCompleted?: boolean;
  isLocked?: boolean;
}

interface AdventureMapProps {
  projectId?: string;
  onNodeSelect?: (nodeId: string) => void;
}

export default function AdventureMap({ projectId, onNodeSelect }: AdventureMapProps) {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!projectId) return;

    // Mock data for now - replace with actual API call
    const mockNodes: NodeData[] = [
      {
        id: '1',
        type: 'location',
        title: 'Village Square',
        description: 'The heart of the village where adventures begin',
        icon: '🏘️',
        x: 100,
        y: 100,
        isCompleted: true
      },
      {
        id: '2',
        type: 'dialogue',
        title: 'Meet the Elder',
        description: 'Talk to the village elder for guidance',
        icon: '👴',
        x: 300,
        y: 150,
        isCompleted: true
      },
      {
        id: '3',
        type: 'quest',
        title: 'Find the Lost Artifact',
        description: 'A mysterious quest from the elder',
        icon: '🗝️',
        x: 500,
        y: 200,
        isCompleted: false
      },
      {
        id: '4',
        type: 'skill_check',
        title: 'Climb the Tower',
        description: 'Test your physical abilities',
        icon: '🧗‍♂️',
        x: 700,
        y: 100,
        isCompleted: false,
        isLocked: true
      },
      {
        id: '5',
        type: 'location',
        title: 'Mysterious Forest',
        description: 'A dark forest full of secrets',
        icon: '🌲',
        x: 200,
        y: 400,
        isCompleted: false
      },
      {
        id: '6',
        type: 'dialogue',
        title: 'Forest Guardian',
        description: 'Meet the mysterious guardian',
        icon: '🧝‍♂️',
        x: 400,
        y: 450,
        isCompleted: false,
        isLocked: true
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setNodes(mockNodes);
      setIsLoading(false);
    }, 500);

    // TODO: Replace with actual API call
    // api.get(`/projects/${projectId}/nodes/`).then(response => {
    //   setNodes(response.data);
    //   setIsLoading(false);
    // }).catch(() => {
    //   setIsLoading(false);
    // });
  }, [projectId]);

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    onNodeSelect?.(nodeId);
  };

  const handleNodeDrag = (nodeId: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, x, y } : node
    ));
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (e.target === mapRef.current) {
      setSelectedNodeId(undefined);
    }
  };

  return (
    <div 
      ref={mapRef}
      className="relative w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 overflow-hidden"
      onClick={handleMapClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 animate-pulse">
              🗺️
            </div>
            <div className="text-white text-lg font-semibold">Loading Adventure Map...</div>
            <div className="text-gray-400 text-sm">Preparing your story world</div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl flex items-center justify-center text-white text-4xl mb-6 mx-auto">
              🗺️
            </div>
            <div className="text-white text-xl font-semibold mb-2">No Adventure Yet</div>
            <div className="text-gray-400 text-sm mb-6">
              Start your story by creating your first dialogue or location
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105">
              🎯 Create First Adventure
            </button>
          </div>
        </div>
      )}

      {/* Adventure Nodes */}
      {!isLoading && nodes.map((node) => (
        <AdventureNode
          key={node.id}
          id={node.id}
          type={node.type}
          title={node.title}
          description={node.description}
          icon={node.icon}
          x={node.x}
          y={node.y}
          isCompleted={node.isCompleted}
          isLocked={node.isLocked}
          isActive={selectedNodeId === node.id}
          onClick={() => handleNodeSelect(node.id)}
          onDrag={(x, y) => handleNodeDrag(node.id, x, y)}
        />
      ))}

      {/* Connection Lines */}
      {!isLoading && (
        <svg className="absolute inset-0 pointer-events-none z-0">
          {/* Connection lines between nodes would be drawn here */}
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Example connection lines */}
          <line x1="220" y1="120" x2="280" y2="150" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="380" y1="170" x2="480" y2="200" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="580" y1="220" x2="680" y2="120" stroke="url(#connectionGradient)" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      )}

      {/* Map Controls */}
      {!isLoading && nodes.length > 0 && (
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          <button className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200">
            🔍
          </button>
          <button className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200">
            🎯
          </button>
          <button className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200">
            ➕
          </button>
        </div>
      )}
    </div>
  );
}

