import { useState, useEffect } from 'react';
import { ProjectManager as PM, ProjectSettings } from '../../types/project';
import { toast } from '../ui/SimpleToast';

interface ProjectManagerProps {
  currentProject: ProjectSettings | null;
  onProjectChange: (project: ProjectSettings | null) => void;
  onClose?: () => void;
}

export default function ProjectManager({ currentProject, onProjectChange, onClose }: ProjectManagerProps) {
  const [projects, setProjects] = useState<ProjectSettings[]>([]);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = PM.getAllProjects();
    setProjects(allProjects);
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error('Введите название проекта');
      return;
    }

    setLoading(true);
    try {
      const project = PM.createNewProject(newProjectName.trim(), newProjectDescription.trim());
      setProjects(prev => [...prev, project]);
      setNewProjectName('');
      setNewProjectDescription('');
      setShowNewProjectForm(false);
      toast.success(`✅ Проект "${project.name}" создан!`);
    } catch (error) {
      toast.error('Ошибка при создании проекта');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProject = (project: ProjectSettings) => {
    onProjectChange(project);
    if (onClose) onClose();
    toast.success(`📁 Проект "${project.name}" открыт`);
  };

  const handleDeleteProject = (project: ProjectSettings) => {
    if (confirm(`Удалить проект "${project.name}"? Это действие нельзя отменить.`)) {
      const success = PM.deleteProject(project.id);
      if (success) {
        setProjects(prev => prev.filter(p => p.id !== project.id));
        if (currentProject?.id === project.id) {
          onProjectChange(null);
        }
        toast.success(`🗑️ Проект "${project.name}" удален`);
      } else {
        toast.error('Ошибка при удалении проекта');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-600 shadow-2xl w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-xl border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Управление проектами</h2>
              <p className="text-blue-200 text-sm">Создайте или откройте существующий проект</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center justify-center transition-colors"
              title="Закрыть"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Current Project */}
        {currentProject && (
          <div className="mb-6 p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-green-400">📂</span>
              <h3 className="text-green-300 font-semibold">Текущий проект</h3>
            </div>
            <h4 className="text-white font-medium">{currentProject.name}</h4>
            {currentProject.description && (
              <p className="text-gray-300 text-sm mt-1">{currentProject.description}</p>
            )}
            <div className="text-xs text-gray-400 mt-2">
              Обновлен: {formatDate(currentProject.updatedAt)}
            </div>
          </div>
        )}

        {/* New Project Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowNewProjectForm(!showNewProjectForm)}
            className="w-full p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <span>➕</span>
            <span>Создать новый проект</span>
          </button>
        </div>

        {/* New Project Form */}
        {showNewProjectForm && (
          <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <h3 className="text-white font-semibold mb-3">Создание нового проекта</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Название проекта</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Введите название проекта..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Описание (необязательно)</label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Краткое описание проекта..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateProject}
                  disabled={loading || !newProjectName.trim()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Создание...' : 'Создать проект'}
                </button>
                <button
                  onClick={() => {
                    setShowNewProjectForm(false);
                    setNewProjectName('');
                    setNewProjectDescription('');
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div>
          <h3 className="text-white font-semibold mb-3">Существующие проекты</h3>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📁</div>
              <p className="text-gray-400">Проекты не найдены</p>
              <p className="text-gray-500 text-sm">Создайте свой первый проект</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    currentProject?.id === project.id
                      ? 'bg-blue-600/20 border-blue-500/50'
                      : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{project.name}</h4>
                      {project.description && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{project.description}</p>
                      )}
                    </div>
                    {currentProject?.id === project.id && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        Активен
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-3">
                    <div>Создан: {formatDate(project.createdAt)}</div>
                    <div>Обновлен: {formatDate(project.updatedAt)}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenProject(project)}
                      className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                    >
                      Открыть
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-colors"
                      title="Удалить проект"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

