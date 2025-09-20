import React, { useState } from 'react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Modal from './ui/Modal';
import type { Scene, Event, EventOption, SkillCheck } from '../types/scene';

interface SceneEditorProps {
  scene?: Scene;
  onSave: (scene: Scene) => void;
  onCancel: () => void;
}

export default function SceneEditor({ scene, onSave, onCancel }: SceneEditorProps) {
  const [currentScene, setCurrentScene] = useState<Scene>(
    scene || {
      id: Date.now().toString(),
      title: '',
      description: '',
      location: '',
      characters: [],
      events: [],
      nextScenes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const handleSave = () => {
    onSave({
      ...currentScene,
      updatedAt: new Date()
    });
  };

  const addEvent = () => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: '',
      description: '',
      type: 'dialogue',
      content: '',
      order: currentScene.events.length
    };
    setEditingEvent(newEvent);
    setShowEventModal(true);
  };

  const editEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const saveEvent = (event: Event) => {
    const existingIndex = currentScene.events.findIndex(e => e.id === event.id);
    let updatedEvents;
    
    if (existingIndex >= 0) {
      updatedEvents = [...currentScene.events];
      updatedEvents[existingIndex] = event;
    } else {
      updatedEvents = [...currentScene.events, event];
    }

    setCurrentScene(prev => ({
      ...prev,
      events: updatedEvents
    }));
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const deleteEvent = (eventId: string) => {
    setCurrentScene(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== eventId)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {scene ? 'Редактировать сцену' : 'Создать сцену'}
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </div>

      <Card variant="elevated">
        <div className="space-y-4">
          <Input
            label="Название сцены"
            value={currentScene.title}
            onChange={(e) => setCurrentScene(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Введите название сцены"
          />

          <div>
            <label className="block text-white font-medium mb-2">
              Описание сцены
            </label>
            <textarea
              value={currentScene.description}
              onChange={(e) => setCurrentScene(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Опишите, что происходит в сцене"
              className="w-full h-24 p-3 bg-[#2F3136] border border-[#40444B] rounded-lg text-white placeholder-[#B9BBBE] focus:border-[#5865F2] focus:outline-none resize-none"
            />
          </div>

          <Input
            label="Локация"
            value={currentScene.location}
            onChange={(e) => setCurrentScene(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Где происходит сцена?"
          />

          <div>
            <label className="block text-white font-medium mb-2">
              Персонажи в сцене
            </label>
            <div className="flex flex-wrap gap-2">
              {currentScene.characters.map((character, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#5865F2] text-white rounded-full text-sm flex items-center gap-2"
                >
                  {character}
                  <button
                    onClick={() => setCurrentScene(prev => ({
                      ...prev,
                      characters: prev.characters.filter((_, i) => i !== index)
                    }))}
                    className="text-white hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Добавить персонажа"
                className="px-3 py-1 bg-[#2F3136] border border-[#40444B] rounded-full text-white placeholder-[#B9BBBE] focus:border-[#5865F2] focus:outline-none text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      setCurrentScene(prev => ({
                        ...prev,
                        characters: [...prev.characters, input.value.trim()]
                      }));
                      input.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card variant="elevated">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">События в сцене</h3>
            <Button variant="primary" onClick={addEvent}>
              + Добавить событие
            </Button>
          </div>

          {currentScene.events.length === 0 ? (
            <div className="text-center py-8 text-[#B9BBBE]">
              <p>События не добавлены</p>
              <p className="text-sm">Нажмите "Добавить событие" чтобы создать первое событие</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentScene.events
                .sort((a, b) => a.order - b.order)
                .map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-[#2F3136] rounded-lg border border-[#40444B]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{event.title || 'Без названия'}</h4>
                        <p className="text-sm text-[#B9BBBE] mt-1">{event.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 bg-purple-600 text-white rounded text-xs">
                            {event.type}
                          </span>
                          <span className="text-xs text-[#B9BBBE]">
                            Порядок: {event.order}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editEvent(event)}
                        >
                          Редактировать
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteEvent(event.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </Card>

      {showEventModal && editingEvent && (
        <EventEditor
          event={editingEvent}
          onSave={saveEvent}
          onCancel={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
}

// Компонент редактора событий
interface EventEditorProps {
  event: Event;
  onSave: (event: Event) => void;
  onCancel: () => void;
}

function EventEditor({ event, onSave, onCancel }: EventEditorProps) {
  const [currentEvent, setCurrentEvent] = useState<Event>(event);

  const handleSave = () => {
    onSave(currentEvent);
  };

  const addOption = () => {
    const newOption: EventOption = {
      id: Date.now().toString(),
      text: '',
      consequence: '',
    };
    setCurrentEvent(prev => ({
      ...prev,
      options: [...(prev.options || []), newOption]
    }));
  };

  const updateOption = (index: number, field: keyof EventOption, value: string) => {
    setCurrentEvent(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      ) || []
    }));
  };

  const deleteOption = (index: number) => {
    setCurrentEvent(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title="Редактировать событие">
      <div className="space-y-4">
        <Input
          label="Название события"
          value={currentEvent.title}
          onChange={(e) => setCurrentEvent(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Введите название события"
        />

        <div>
          <label className="block text-white font-medium mb-2">
            Описание события
          </label>
          <textarea
            value={currentEvent.description}
            onChange={(e) => setCurrentEvent(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Опишите событие"
            className="w-full h-20 p-3 bg-[#2F3136] border border-[#40444B] rounded-lg text-white placeholder-[#B9BBBE] focus:border-[#5865F2] focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">
            Тип события
          </label>
          <select
            value={currentEvent.type}
            onChange={(e) => setCurrentEvent(prev => ({ ...prev, type: e.target.value as any }))}
            className="w-full p-3 bg-[#2F3136] border border-[#40444B] rounded-lg text-white focus:border-[#5865F2] focus:outline-none"
          >
            <option value="dialogue">Диалог</option>
            <option value="action">Действие</option>
            <option value="choice">Выбор</option>
            <option value="skill_check">Проверка навыка</option>
          </select>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">
            Содержимое
          </label>
          <textarea
            value={currentEvent.content}
            onChange={(e) => setCurrentEvent(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Текст диалога, описание действия и т.д."
            className="w-full h-24 p-3 bg-[#2F3136] border border-[#40444B] rounded-lg text-white placeholder-[#B9BBBE] focus:border-[#5865F2] focus:outline-none resize-none"
          />
        </div>

        {currentEvent.type === 'choice' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-white font-medium">
                Варианты выбора
              </label>
              <Button variant="secondary" size="sm" onClick={addOption}>
                + Добавить вариант
              </Button>
            </div>
            <div className="space-y-2">
              {currentEvent.options?.map((option, index) => (
                <div key={option.id} className="p-3 bg-[#2F3136] rounded-lg border border-[#40444B]">
                  <div className="space-y-2">
                    <Input
                      label="Текст варианта"
                      value={option.text}
                      onChange={(e) => updateOption(index, 'text', e.target.value)}
                      placeholder="Текст выбора"
                    />
                    <Input
                      label="Последствие"
                      value={option.consequence}
                      onChange={(e) => updateOption(index, 'consequence', e.target.value)}
                      placeholder="Что происходит при выборе"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteOption(index)}
                    >
                      Удалить вариант
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onCancel}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </div>
    </Modal>
  );
}
