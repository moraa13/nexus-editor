import React, { useState } from 'react';
import Button from './ui/Button';
import Card from './ui/Card';
import Modal from './ui/Modal';
import SceneEditor from './SceneEditor';
import type { Scene, ProjectSettings } from '../types/project';
import type { Scene as SceneType } from '../types/scene';

interface ProjectPanelProps {
  project: ProjectSettings;
  onUpdateProject: (project: ProjectSettings) => void;
}

export default function ProjectPanel({ project, onUpdateProject }: ProjectPanelProps) {
  const [activeTab, setActiveTab] = useState<'scenes' | 'characters' | 'events'>('scenes');
  const [showSceneEditor, setShowSceneEditor] = useState(false);
  const [editingScene, setEditingScene] = useState<SceneType | null>(null);

  // Преобразуем события проекта в сцены для отображения
  const scenes: SceneType[] = project.events?.map(event => ({
    id: event.id,
    title: event.title || 'Без названия',
    description: event.description || '',
    location: event.location || 'Не указано',
    characters: event.characters || [],
    events: [],
    nextScenes: [],
    createdAt: new Date(),
    updatedAt: new Date()
  })) || [];

  const handleCreateScene = () => {
    setEditingScene(null);
    setShowSceneEditor(true);
  };

  const handleEditScene = (scene: SceneType) => {
    setEditingScene(scene);
    setShowSceneEditor(true);
  };

  const handleSaveScene = (scene: SceneType) => {
    // Преобразуем сцену обратно в событие проекта
    const newEvent: Scene = {
      id: scene.id,
      title: scene.title,
      description: scene.description,
      location: scene.location,
      characters: scene.characters,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const existingIndex = project.events?.findIndex(e => e.id === scene.id) ?? -1;
    let updatedEvents;
    
    if (existingIndex >= 0) {
      updatedEvents = [...(project.events || [])];
      updatedEvents[existingIndex] = newEvent;
    } else {
      updatedEvents = [...(project.events || []), newEvent];
    }

    onUpdateProject({
      ...project,
      events: updatedEvents
    });

    setShowSceneEditor(false);
    setEditingScene(null);
  };

  const handleDeleteScene = (sceneId: string) => {
    const updatedEvents = project.events?.filter(e => e.id !== sceneId) || [];
    onUpdateProject({
      ...project,
      events: updatedEvents
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#2F3136]">
      {/* Header */}
      <div className="p-4 border-b border-[#40444B]">
        <h2 className="text-xl font-bold text-white mb-2">{project.name}</h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'scenes' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('scenes')}
          >
            Сцены
          </Button>
          <Button
            variant={activeTab === 'characters' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('characters')}
          >
            Персонажи
          </Button>
          <Button
            variant={activeTab === 'events' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('events')}
          >
            События
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'scenes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Сцены проекта</h3>
              <Button variant="primary" onClick={handleCreateScene}>
                + Создать сцену
              </Button>
            </div>

            {scenes.length === 0 ? (
              <Card variant="elevated" className="text-center py-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-[#5865F2] rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">🎬</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Сцены не созданы</h4>
                    <p className="text-[#B9BBBE] mb-4">
                      Создайте первую сцену для вашего проекта
                    </p>
                    <Button variant="primary" onClick={handleCreateScene}>
                      Создать сцену
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4">
                {scenes.map((scene) => (
                  <Card key={scene.id} variant="elevated">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{scene.title}</h4>
                          <p className="text-sm text-[#B9BBBE] mt-1">{scene.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-[#B9BBBE]">
                            <span>📍 {scene.location}</span>
                            <span>👥 {scene.characters.length} персонажей</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditScene(scene)}
                          >
                            Редактировать
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteScene(scene.id)}
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'characters' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Персонажи проекта</h3>
              <Button variant="primary">
                + Создать персонажа
              </Button>
            </div>

            {project.character ? (
              <Card variant="elevated">
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">{project.character.name}</h4>
                  <p className="text-sm text-[#B9BBBE]">{project.character.description}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Редактировать
                    </Button>
                    <Button variant="danger" size="sm">
                      Удалить
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card variant="elevated" className="text-center py-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-[#5865F2] rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Персонажи не созданы</h4>
                    <p className="text-[#B9BBBE] mb-4">
                      Создайте главного персонажа для вашего проекта
                    </p>
                    <Button variant="primary">
                      Создать персонажа
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">События проекта</h3>
              <Button variant="primary">
                + Создать событие
              </Button>
            </div>

            <Card variant="elevated" className="text-center py-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-[#5865F2] rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">События не созданы</h4>
                  <p className="text-[#B9BBBE] mb-4">
                    Создайте события для развития сюжета
                  </p>
                  <Button variant="primary">
                    Создать событие
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Scene Editor Modal */}
      {showSceneEditor && (
        <Modal
          isOpen={showSceneEditor}
          onClose={() => {
            setShowSceneEditor(false);
            setEditingScene(null);
          }}
          title={editingScene ? 'Редактировать сцену' : 'Создать сцену'}
          size="large"
        >
          <SceneEditor
            scene={editingScene || undefined}
            onSave={handleSaveScene}
            onCancel={() => {
              setShowSceneEditor(false);
              setEditingScene(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
