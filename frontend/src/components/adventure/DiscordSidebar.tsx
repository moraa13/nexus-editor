import { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/api';
import ServerIcon from '../ui/ServerIcon';

interface Project {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  created_at: string;
  dialogues_count?: number;
  characters_count?: number;
}

interface DiscordSidebarProps {
  activeProjectId?: string;
  onProjectSelect: (projectId: string) => void;
}

export default function DiscordSidebar({ activeProjectId, onProjectSelect }: DiscordSidebarProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const hoverZoneRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'My First Story',
        description: 'A magical adventure',
        icon: '🏰',
        color: 'from-blue-500 to-purple-600',
        created_at: '2024-01-01',
        dialogues_count: 5,
        characters_count: 3
      },
      {
        id: '2', 
        name: 'Space Adventure',
        description: 'Journey through the stars',
        icon: '🚀',
        color: 'from-purple-500 to-pink-600',
        created_at: '2024-01-02',
        dialogues_count: 8,
        characters_count: 4
      },
      {
        id: '3',
        name: 'Magic School',
        description: 'Learn spells and potions',
        icon: '🧙‍♂️',
        color: 'from-green-500 to-teal-600',
        created_at: '2024-01-03',
        dialogues_count: 12,
        characters_count: 6
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 500);

    // TODO: Replace with actual API call
    // api.get('/game-projects/').then(response => {
    //   setProjects(response.data);
    //   setIsLoading(false);
    // }).catch(() => {
    //   setIsLoading(false);
    // });
  }, []);

  const handleCreateProject = () => {
    // TODO: Implement project creation modal
    console.log('Create new project');
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative">
      {/* Hover Zone - Left corner area */}
      <div 
        ref={hoverZoneRef}
        className="fixed left-0 top-0 w-8 h-32 z-40"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`
          fixed left-0 top-0 h-screen bg-gray-900 flex flex-col items-center py-6 space-y-4 border-r border-gray-700
          transition-all duration-300 ease-in-out z-30
          ${isVisible ? 'w-24 opacity-100' : 'w-0 opacity-0 overflow-hidden'}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Nexus Logo */}
        <div className="mb-6">
          <ServerIcon
            icon="🎮"
            name="Nexus Adventure"
            isActive={false}
            tooltip="Nexus Adventure - Game Creator"
            size="large"
          />
        </div>

        {/* Separator */}
        <div className="w-16 h-px bg-gray-700" />

        {/* Project Servers - Limited to 4-5 icons */}
        <div className="flex flex-col space-y-4 flex-1 justify-center">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-16 bg-gray-700 rounded-2xl animate-pulse" />
            ))
          ) : (
            projects.slice(0, 4).map((project) => (
              <ServerIcon
                key={project.id}
                icon={project.icon}
                name={project.name}
                isActive={activeProjectId === project.id}
                onClick={() => onProjectSelect(project.id)}
                hasNotification={project.dialogues_count && project.dialogues_count > 0}
                tooltip={`${project.name}\n${project.description}\n\n📊 ${project.dialogues_count || 0} dialogues\n👥 ${project.characters_count || 0} characters`}
                size="large"
              />
            ))
          )}
        </div>

        {/* Add Server Button */}
        <div className="mb-4">
          <button
            onClick={handleCreateProject}
            className="
              w-16 h-16 rounded-2xl bg-gray-600 hover:bg-green-600
              flex items-center justify-center text-white text-2xl
              transition-all duration-200 hover:scale-110
              group
            "
            title="Create New World"
          >
            <span className="transition-transform duration-200 group-hover:rotate-90">+</span>
          </button>
        </div>

        {/* Bottom Separator */}
        <div className="w-16 h-px bg-gray-700 mb-4" />

        {/* Settings Button */}
        <button
          className="
            w-16 h-16 rounded-2xl bg-gray-600 hover:bg-gray-500
            flex items-center justify-center text-white text-xl
            transition-all duration-200 hover:scale-110
          "
          title="Settings"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}
