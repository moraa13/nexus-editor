import React, { useState, useEffect } from 'react';
import { useAdventureStore, useQuests, useEvents, useCurrentProject, type Quest, type QuestStep } from '../../stores/adventureStore';

interface QuestEditorPanelProps {
  selectedQuestId?: string;
  onQuestSelect?: (questId: string) => void;
  onClose?: () => void;
}

const QuestEditorPanel: React.FC<QuestEditorPanelProps> = ({
  selectedQuestId,
  onQuestSelect,
  onClose
}) => {
  const quests = useQuests();
  const events = useEvents();
  const currentProject = useCurrentProject();
  const { addQuest, updateQuest, removeQuest, addQuestStep, updateQuestStep, removeQuestStep } = useAdventureStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [formData, setFormData] = useState<Partial<Quest>>({
    name: '',
    description: '',
    steps: [],
    startConditions: [],
    initiatorNPC: '',
    rewards: [],
    status: 'not_started'
  });

  useEffect(() => {
    if (selectedQuestId) {
      const quest = quests.find(q => q.id === selectedQuestId);
      if (quest) {
        setEditingQuest(quest);
        setFormData(quest);
        setIsCreating(false);
      }
    }
  }, [selectedQuestId, quests]);

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingQuest(null);
    setFormData({
      name: '',
      description: '',
      steps: [],
      startConditions: [],
      initiatorNPC: '',
      rewards: [],
      status: 'not_started'
    });
  };

  const handleSave = () => {
    if (!currentProject) return;

    const questData: Quest = {
      id: editingQuest?.id || `quest_${Date.now()}`,
      name: formData.name || 'Новый квест',
      description: formData.description || '',
      steps: formData.steps || [],
      startConditions: formData.startConditions || [],
      initiatorNPC: formData.initiatorNPC || '',
      rewards: formData.rewards || [],
      status: formData.status || 'not_started',
      project: currentProject.id
    };

    if (editingQuest) {
      updateQuest(editingQuest.id, questData);
    } else {
      addQuest(questData);
    }

    setIsCreating(false);
    setEditingQuest(null);
    setFormData({
      name: '',
      description: '',
      steps: [],
      startConditions: [],
      initiatorNPC: '',
      rewards: [],
      status: 'not_started'
    });
  };

  const handleDelete = () => {
    if (editingQuest) {
      removeQuest(editingQuest.id);
      setEditingQuest(null);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingQuest(null);
    setFormData({
      name: '',
      description: '',
      steps: [],
      startConditions: [],
      initiatorNPC: '',
      rewards: [],
      status: 'not_started'
    });
  };

  const addArrayItem = (field: 'startConditions' | 'rewards') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const updateArrayItem = (field: 'startConditions' | 'rewards', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (field: 'startConditions' | 'rewards', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  const addStep = () => {
    const newStep: QuestStep = {
      id: `step_${Date.now()}`,
      eventId: '',
      description: '',
      completed: false,
      order: (formData.steps || []).length
    };
    
    setFormData(prev => ({
      ...prev,
      steps: [...(prev.steps || []), newStep]
    }));
  };

  const updateStep = (stepId: string, updates: Partial<QuestStep>) => {
    setFormData(prev => ({
      ...prev,
      steps: (prev.steps || []).map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    }));
  };

  const removeStep = (stepId: string) => {
    setFormData(prev => ({
      ...prev,
      steps: (prev.steps || []).filter(step => step.id !== stepId)
    }));
  };

  const getStatusColor = (status: Quest['status']) => {
    switch (status) {
      case 'not_started': return 'bg-gray-600';
      case 'in_progress': return 'bg-blue-600';
      case 'completed': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: Quest['status']) => {
    switch (status) {
      case 'not_started': return 'Не начат';
      case 'in_progress': return 'В процессе';
      case 'completed': return 'Завершён';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="flex h-full">
      {/* Quests List */}
      <div className="w-1/3 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Квесты</h2>
            <button
              onClick={handleCreateNew}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
            >
              + Создать
            </button>
          </div>
          {currentProject && (
            <p className="text-sm text-gray-400">Проект: {currentProject.name}</p>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {quests.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-gray-400 text-sm mb-3">Квесты не созданы</p>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
              >
                Создать первый квест
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {quests.map((quest) => (
                <div
                  key={quest.id}
                  onClick={() => onQuestSelect?.(quest.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    editingQuest?.id === quest.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm">{quest.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(quest.status)} text-white`}>
                      {getStatusText(quest.status)}
                    </span>
                  </div>
                  <p className="text-xs opacity-75 line-clamp-2">{quest.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs opacity-60">
                    <span>📋 {quest.steps.length} этапов</span>
                    {quest.initiatorNPC && <span>👤 {quest.initiatorNPC}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quest Editor */}
      <div className="flex-1 bg-gray-900 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {isCreating ? 'Создание квеста' : editingQuest ? 'Редактирование квеста' : 'Выберите квест'}
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {(isCreating || editingQuest) && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Название квеста
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Введите название квеста"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Сюжет квеста"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Статус
                    </label>
                    <select
                      value={formData.status || 'not_started'}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Quest['status'] }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="not_started">Не начат</option>
                      <option value="in_progress">В процессе</option>
                      <option value="completed">Завершён</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      NPC-инициатор
                    </label>
                    <input
                      type="text"
                      value={formData.initiatorNPC || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, initiatorNPC: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Кто выдает квест"
                    />
                  </div>
                </div>
              </div>

              {/* Quest Steps */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Этапы квеста
                  </label>
                  <button
                    onClick={addStep}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
                  >
                    + Добавить этап
                  </button>
                </div>
                
                <div className="space-y-3">
                  {(formData.steps || []).map((step, index) => (
                    <div key={step.id} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-white">Этап {index + 1}</h4>
                        <button
                          onClick={() => removeStep(step.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Связанное событие
                          </label>
                          <select
                            value={step.eventId}
                            onChange={(e) => updateStep(step.id, { eventId: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          >
                            <option value="">Выберите событие</option>
                            {events.map(event => (
                              <option key={event.id} value={event.id}>
                                {event.name} ({event.type})
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Описание этапа
                          </label>
                          <textarea
                            value={step.description}
                            onChange={(e) => updateStep(step.id, { description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            placeholder="Описание этапа квеста"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`step-${step.id}-completed`}
                            checked={step.completed}
                            onChange={(e) => updateStep(step.id, { completed: e.target.checked })}
                            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                          />
                          <label htmlFor={`step-${step.id}-completed`} className="text-sm text-gray-300">
                            Этап завершён
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Условия начала
                </label>
                <div className="space-y-2">
                  {(formData.startConditions || []).map((condition, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={condition}
                        onChange={(e) => updateArrayItem('startConditions', index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Условие начала квеста"
                      />
                      <button
                        onClick={() => removeArrayItem('startConditions', index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('startConditions')}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    + Добавить условие
                  </button>
                </div>
              </div>

              {/* Rewards */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Награды
                </label>
                <div className="space-y-2">
                  {(formData.rewards || []).map((reward, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={reward}
                        onChange={(e) => updateArrayItem('rewards', index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Награда за квест"
                      />
                      <button
                        onClick={() => removeArrayItem('rewards', index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('rewards')}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    + Добавить награду
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                  {editingQuest ? 'Сохранить' : 'Создать'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  Отмена
                </button>
                {editingQuest && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {!isCreating && !editingQuest && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Выберите квест</h3>
              <p className="text-gray-500 mb-4">Выберите квест из списка слева или создайте новый</p>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
              >
                Создать квест
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestEditorPanel;
