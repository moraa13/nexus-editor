"""
Project State Management
Управление состоянием проекта для ИИ-агентов
"""
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from enum import Enum
import json


class ProjectPhase(Enum):
    """Этапы разработки проекта"""
    IDEA = "idea"           # Придумываем идею
    WORLD = "world"         # Строим мир
    CHARACTER = "character" # Создаем персонажей
    SCENE = "scene"         # Делаем сцены
    DIALOGUE = "dialogue"   # Пишем диалоги
    BRANCH = "branch"       # Создаем ветвления
    TESTPLAY = "testplay"   # Тестируем


class ToneProfile(Enum):
    """Стилистические профили"""
    DARK_NOIR = "dark-noir"
    SOVIET_SATIRE = "soviet-satire"
    DISCO_LIRIK = "disco-lirik"
    CYBERPUNK = "cyberpunk"
    FANTASY = "fantasy"
    HORROR = "horror"


@dataclass
class ProjectMechanics:
    """Игровые механики"""
    dice_system: str = "d20"  # d20, 3d6, percent, success/fail
    stats: List[str] = field(default_factory=list)  # ["Сила", "Интуиция", "Харизма"]
    voices: List[str] = field(default_factory=list)  # ["Адреналин", "Вина", "Механик"]
    checks: str = "d20 + стат"  # Формула проверок
    inventory: bool = False
    reputation: bool = False
    relationships: bool = False


@dataclass
class ProjectCharacter:
    """Персонаж проекта"""
    name: str = ""
    role: str = ""  # "hero", "npc", "villain"
    background: str = ""
    motivation: str = ""
    fears: List[str] = field(default_factory=list)
    traits: List[str] = field(default_factory=list)
    voices: List[str] = field(default_factory=list)
    speech_style: str = ""


@dataclass
class ProjectScene:
    """Сцена проекта"""
    id: str = ""
    title: str = ""
    description: str = ""
    location: str = ""
    characters: List[str] = field(default_factory=list)
    events: List[str] = field(default_factory=list)
    choices: List[str] = field(default_factory=list)


@dataclass
class ProjectQuest:
    """Квест проекта"""
    id: str = ""
    title: str = ""
    description: str = ""
    objectives: List[str] = field(default_factory=list)
    rewards: List[str] = field(default_factory=list)
    consequences: List[str] = field(default_factory=list)


@dataclass
class ProjectState:
    """Глобальное состояние проекта"""
    # Основная информация
    name: str = "Новый проект"
    genre: str = ""
    setting: str = ""
    tone: ToneProfile = ToneProfile.DARK_NOIR
    phase: ProjectPhase = ProjectPhase.IDEA
    
    # Контент
    description: str = ""
    characters: List[ProjectCharacter] = field(default_factory=list)
    scenes: List[ProjectScene] = field(default_factory=list)
    quests: List[ProjectQuest] = field(default_factory=list)
    mechanics: ProjectMechanics = field(default_factory=ProjectMechanics)
    
    # Состояние разработки
    completed_tasks: List[str] = field(default_factory=list)
    current_focus: str = ""
    last_activity: str = ""
    
    # Память агентов
    agent_memory: Dict[str, List[str]] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        """Преобразовать в словарь для передачи агентам"""
        return {
            "name": self.name,
            "genre": self.genre,
            "setting": self.setting,
            "tone": self.tone.value,
            "phase": self.phase.value,
            "description": self.description,
            "characters": [
                {
                    "name": char.name,
                    "role": char.role,
                    "background": char.background,
                    "motivation": char.motivation,
                    "fears": char.fears,
                    "traits": char.traits,
                    "voices": char.voices,
                    "speech_style": char.speech_style
                } for char in self.characters
            ],
            "scenes": [
                {
                    "id": scene.id,
                    "title": scene.title,
                    "description": scene.description,
                    "location": scene.location,
                    "characters": scene.characters,
                    "events": scene.events,
                    "choices": scene.choices
                } for scene in self.scenes
            ],
            "quests": [
                {
                    "id": quest.id,
                    "title": quest.title,
                    "description": quest.description,
                    "objectives": quest.objectives,
                    "rewards": quest.rewards,
                    "consequences": quest.consequences
                } for quest in self.quests
            ],
            "mechanics": {
                "dice_system": self.mechanics.dice_system,
                "stats": self.mechanics.stats,
                "voices": self.mechanics.voices,
                "checks": self.mechanics.checks,
                "inventory": self.mechanics.inventory,
                "reputation": self.mechanics.reputation,
                "relationships": self.mechanics.relationships
            },
            "completed_tasks": self.completed_tasks,
            "current_focus": self.current_focus,
            "last_activity": self.last_activity,
            "agent_memory": self.agent_memory
        }
    
    def update_from_agent_response(self, agent_type: str, response: str) -> None:
        """Обновить состояние на основе ответа агента"""
        self.last_activity = f"{agent_type}: {response[:100]}..."
        
        # Добавляем в память агента
        if agent_type not in self.agent_memory:
            self.agent_memory[agent_type] = []
        self.agent_memory[agent_type].append(response)
        
        # Ограничиваем размер памяти
        if len(self.agent_memory[agent_type]) > 5:
            self.agent_memory[agent_type].pop(0)
    
    def get_context_for_agent(self, agent_type: str) -> str:
        """Получить контекст для конкретного агента"""
        context_parts = []
        
        # Основная информация
        context_parts.append(f"Проект: {self.name}")
        context_parts.append(f"Жанр: {self.genre}")
        context_parts.append(f"Сеттинг: {self.setting}")
        context_parts.append(f"Тон: {self.tone.value}")
        context_parts.append(f"Этап: {self.phase.value}")
        
        # Контент в зависимости от агента
        if agent_type == "character":
            if self.characters:
                context_parts.append("Персонажи:")
                for char in self.characters:
                    context_parts.append(f"- {char.name} ({char.role}): {char.background}")
        
        elif agent_type == "quest":
            if self.quests:
                context_parts.append("Квесты:")
                for quest in self.quests:
                    context_parts.append(f"- {quest.title}: {quest.description}")
        
        elif agent_type == "world":
            if self.scenes:
                context_parts.append("Локации:")
                for scene in self.scenes:
                    context_parts.append(f"- {scene.location}: {scene.description}")
        
        elif agent_type == "logic":
            context_parts.append("Механики:")
            context_parts.append(f"- Система бросков: {self.mechanics.dice_system}")
            context_parts.append(f"- Характеристики: {', '.join(self.mechanics.stats)}")
            context_parts.append(f"- Внутренние голоса: {', '.join(self.mechanics.voices)}")
        
        # Память агента
        if agent_type in self.agent_memory and self.agent_memory[agent_type]:
            context_parts.append("Предыдущие обсуждения:")
            for memory in self.agent_memory[agent_type][-3:]:  # Последние 3
                context_parts.append(f"- {memory[:50]}...")
        
        return "\n".join(context_parts)


class ProjectStateManager:
    """Менеджер состояния проекта"""
    
    def __init__(self):
        self.current_project: Optional[ProjectState] = None
    
    def create_project(self, name: str, genre: str = "", setting: str = "") -> ProjectState:
        """Создать новый проект"""
        self.current_project = ProjectState(
            name=name,
            genre=genre,
            setting=setting
        )
        return self.current_project
    
    def get_current_project(self) -> Optional[ProjectState]:
        """Получить текущий проект"""
        return self.current_project
    
    def update_phase(self, phase: ProjectPhase) -> None:
        """Обновить этап разработки"""
        if self.current_project:
            self.current_project.phase = phase
    
    def add_character(self, character: ProjectCharacter) -> None:
        """Добавить персонажа"""
        if self.current_project:
            self.current_project.characters.append(character)
    
    def add_scene(self, scene: ProjectScene) -> None:
        """Добавить сцену"""
        if self.current_project:
            self.current_project.scenes.append(scene)
    
    def add_quest(self, quest: ProjectQuest) -> None:
        """Добавить квест"""
        if self.current_project:
            self.current_project.quests.append(quest)
    
    def update_mechanics(self, mechanics: ProjectMechanics) -> None:
        """Обновить механики"""
        if self.current_project:
            self.current_project.mechanics = mechanics


# Глобальный менеджер состояния
project_state_manager = ProjectStateManager()
