import React, { useState, useEffect } from 'react';
import { useAdventureStore, useEvents, useCurrentScene, type Event } from '../../stores/adventureStore';

interface EventEditorPanelProps {
  selectedEventId?: string;
  onEventSelect?: (eventId: string) => void;
  onClose?: () => void;
}

const EventEditorPanel: React.FC<EventEditorPanelProps> = ({
  selectedEventId,
  onEventSelect,
  onClose
}) => {
  const events = useEvents();
  const currentScene = useCurrentScene();
  const { addEvent, updateEvent, removeEvent, getEventsByScene } = useAdventureStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    name: '',
    type: 'dialogue',
    description: '',
    triggerConditions: [],
    consequences: [],
    relatedNPCs: [],
    script: '',
    scenePreview: '',
    order: 0
  });

  const sceneEvents = currentScene ? getEventsByScene(currentScene.id) : [];

  useEffect(() => {
    if (selectedEventId) {
      const event = events.find(e => e.id === selectedEventId);
      if (event) {
        setEditingEvent(event);
        setFormData(event);
        setIsCreating(false);
      }
    }
  }, [selectedEventId, events]);

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingEvent(null);
    setFormData({
      name: '',
      type: 'dialogue',
      description: '',
      triggerConditions: [],
      consequences: [],
      relatedNPCs: [],
      script: '',
      scenePreview: '',
      order: sceneEvents.length
    });
  };

  const handleSave = () => {
    if (!currentScene) return;

    const eventData: Event = {
      id: editingEvent?.id || `event_${Date.now()}`,
      name: formData.name || 'Новое событие',
      type: formData.type || 'dialogue',
      description: formData.description || '',
      triggerConditions: formData.triggerConditions || [],
      consequences: formData.consequences || [],
      relatedNPCs: formData.relatedNPCs || [],
      script: formData.script,
      scenePreview: formData.scenePreview,
      scene: currentScene.id,
      project: currentScene.project,
      order: formData.order || 0
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    setIsCreating(false);
    setEditingEvent(null);
    setFormData({
      name: '',
      type: 'dialogue',
      description: '',
      triggerConditions: [],
      consequences: [],
      relatedNPCs: [],
      script: '',
      scenePreview: '',
      order: 0
    });
  };

  const handleDelete = () => {
    if (editingEvent) {
      removeEvent(editingEvent.id);
      setEditingEvent(null);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingEvent(null);
    setFormData({
      name: '',
      type: 'dialogue',
      description: '',
      triggerConditions: [],
      consequences: [],
      relatedNPCs: [],
      script: '',
      scenePreview: '',
      order: 0
    });
  };

  const addArrayItem = (field: 'triggerConditions' | 'consequences' | 'relatedNPCs') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const updateArrayItem = (field: 'triggerConditions' | 'consequences' | 'relatedNPCs', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (field: 'triggerConditions' | 'consequences' | 'relatedNPCs', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="flex h-full">
      {/* Events List */}
      <div className="w-1/3 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">События</h2>
            <button
              onClick={handleCreateNew}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
            >
              + Создать
            </button>
          </div>
          {currentScene && (
            <p className="text-sm text-gray-400">Сцена: {currentScene.name}</p>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {sceneEvents.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-gray-400 text-sm mb-3">События не созданы</p>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
              >
                Создать первое событие
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {sceneEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => onEventSelect?.(event.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    editingEvent?.id === event.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">
                      {event.type === 'dialogue' && '💬'}
                      {event.type === 'skill_check' && '🎯'}
                      {event.type === 'combat' && '⚔️'}
                      {event.type === 'transition' && '🔄'}
                      {event.type === 'script' && '📜'}
                    </span>
                    <h3 className="font-medium text-sm">{event.name}</h3>
                  </div>
                  <p className="text-xs opacity-75 line-clamp-2">{event.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Editor */}
      <div className="flex-1 bg-gray-900 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {isCreating ? 'Создание события' : editingEvent ? 'Редактирование события' : 'Выберите событие'}
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

        {(isCreating || editingEvent) && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Название события
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Введите название события"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Тип события
                  </label>
                  <select
                    value={formData.type || 'dialogue'}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Event['type'] }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dialogue">💬 Диалог</option>
                    <option value="skill_check">🎯 Проверка навыка</option>
                    <option value="combat">⚔️ Бой</option>
                    <option value="transition">🔄 Переход</option>
                    <option value="script">📜 Скрипт</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Краткое описание события"
                  />
                </div>
              </div>

              {/* Trigger Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Условия запуска
                </label>
                <div className="space-y-2">
                  {(formData.triggerConditions || []).map((condition, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={condition}
                        onChange={(e) => updateArrayItem('triggerConditions', index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Условие запуска"
                      />
                      <button
                        onClick={() => removeArrayItem('triggerConditions', index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('triggerConditions')}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    + Добавить условие
                  </button>
                </div>
              </div>

              {/* Consequences */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Последствия
                </label>
                <div className="space-y-2">
                  {(formData.consequences || []).map((consequence, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={consequence}
                        onChange={(e) => updateArrayItem('consequences', index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Последствие события"
                      />
                      <button
                        onClick={() => removeArrayItem('consequences', index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('consequences')}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    + Добавить последствие
                  </button>
                </div>
              </div>

              {/* Related NPCs */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Связанные NPC
                </label>
                <div className="space-y-2">
                  {(formData.relatedNPCs || []).map((npc, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={npc}
                        onChange={(e) => updateArrayItem('relatedNPCs', index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Имя NPC"
                      />
                      <button
                        onClick={() => removeArrayItem('relatedNPCs', index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('relatedNPCs')}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    + Добавить NPC
                  </button>
                </div>
              </div>

              {/* Script (if type is script) */}
              {formData.type === 'script' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Скрипт
                  </label>
                  <textarea
                    value={formData.script || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, script: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="// JavaScript код для выполнения"
                  />
                </div>
              )}

              {/* Scene Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Превью сцены (AI-генерация)
                </label>
                <textarea
                  value={formData.scenePreview || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, scenePreview: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AI-сгенерированное описание сцены..."
                />
                <div className="flex gap-2 mt-2">
                  <button className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors">
                    🧠 AI-генерация
                  </button>
                  <button className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg transition-colors">
                    🔄 Подсказать последствия
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  {editingEvent ? 'Сохранить' : 'Создать'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  Отмена
                </button>
                {editingEvent && (
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

        {!isCreating && !editingEvent && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Выберите событие</h3>
              <p className="text-gray-500 mb-4">Выберите событие из списка слева или создайте новое</p>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                Создать событие
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventEditorPanel;
