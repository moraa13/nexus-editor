"""
Database-based Project State Manager
Менеджер состояния проекта на основе базы данных
"""
from typing import Dict, List, Optional, Any
from django.db import transaction
from .models import (
    ProjectSession, ProjectCharacter, ProjectScene, ProjectQuest, 
    ProjectMechanics, AgentMemory, ProjectTask
)


class ProjectDBManager:
    """Менеджер состояния проекта на основе БД"""
    
    def __init__(self):
        self.current_session_id: Optional[str] = None
    
    def create_project(self, name: str, genre: str = "", setting: str = "") -> ProjectSession:
        """Создать новый проект"""
        with transaction.atomic():
            # Создаем сессию
            session = ProjectSession.objects.create(
                name=name,
                genre=genre,
                setting=setting
            )
            
            # Создаем механики по умолчанию
            ProjectMechanics.objects.create(session=session)
            
            self.current_session_id = str(session.id)
            return session
    
    def get_current_session(self) -> Optional[ProjectSession]:
        """Получить текущую сессию"""
        if not self.current_session_id:
            return None
        
        try:
            return ProjectSession.objects.get(id=self.current_session_id)
        except ProjectSession.DoesNotExist:
            return None
    
    def set_current_session(self, session_id: str) -> bool:
        """Установить текущую сессию"""
        try:
            session = ProjectSession.objects.get(id=session_id)
            self.current_session_id = session_id
            return True
        except ProjectSession.DoesNotExist:
            return False
    
    def update_session(self, **kwargs) -> bool:
        """Обновить сессию"""
        session = self.get_current_session()
        if not session:
            return False
        
        for key, value in kwargs.items():
            if hasattr(session, key):
                setattr(session, key, value)
        
        session.save()
        return True
    
    def add_character(self, name: str, role: str = "npc", **kwargs) -> Optional[ProjectCharacter]:
        """Добавить персонажа"""
        session = self.get_current_session()
        if not session:
            return None
        
        return ProjectCharacter.objects.create(
            session=session,
            name=name,
            role=role,
            **kwargs
        )
    
    def add_scene(self, title: str, **kwargs) -> Optional[ProjectScene]:
        """Добавить сцену"""
        session = self.get_current_session()
        if not session:
            return None
        
        return ProjectScene.objects.create(
            session=session,
            title=title,
            **kwargs
        )
    
    def add_quest(self, title: str, **kwargs) -> Optional[ProjectQuest]:
        """Добавить квест"""
        session = self.get_current_session()
        if not session:
            return None
        
        return ProjectQuest.objects.create(
            session=session,
            title=title,
            **kwargs
        )
    
    def add_agent_memory(self, agent_type: str, message: str, response: str, context: Dict = None) -> Optional[AgentMemory]:
        """Добавить память агента"""
        session = self.get_current_session()
        if not session:
            return None
        
        return AgentMemory.objects.create(
            session=session,
            agent_type=agent_type,
            message=message,
            response=response,
            context=context or {}
        )
    
    def get_agent_memories(self, agent_type: str = None, limit: int = 10) -> List[AgentMemory]:
        """Получить память агентов"""
        session = self.get_current_session()
        if not session:
            return []
        
        memories = session.agent_memories.all()
        if agent_type:
            memories = memories.filter(agent_type=agent_type)
        
        return list(memories[:limit])
    
    def get_project_context(self, agent_type: str = None) -> str:
        """Получить контекст проекта для агента"""
        session = self.get_current_session()
        if not session:
            return "Проект не создан"
        
        context_parts = []
        
        # Основная информация
        context_parts.append(f"=== СОСТОЯНИЕ ПРОЕКТА ===")
        context_parts.append(f"Проект: {session.name}")
        context_parts.append(f"Жанр: {session.genre}")
        context_parts.append(f"Сеттинг: {session.setting}")
        context_parts.append(f"Тон: {session.tone}")
        context_parts.append(f"Этап: {session.phase}")
        context_parts.append(f"Фокус: {session.current_focus}")
        
        # Контент в зависимости от агента
        if agent_type == "character":
            characters = session.characters.all()
            if characters:
                context_parts.append("\n=== ПЕРСОНАЖИ ===")
                for char in characters:
                    context_parts.append(f"- {char.name} ({char.role}): {char.background[:100]}...")
        
        elif agent_type == "quest":
            quests = session.quests.all()
            if quests:
                context_parts.append("\n=== КВЕСТЫ ===")
                for quest in quests:
                    context_parts.append(f"- {quest.title}: {quest.description[:100]}...")
        
        elif agent_type == "world":
            scenes = session.scenes.all()
            if scenes:
                context_parts.append("\n=== ЛОКАЦИИ ===")
                for scene in scenes:
                    context_parts.append(f"- {scene.location}: {scene.description[:100]}...")
        
        elif agent_type == "logic":
            try:
                mechanics = session.mechanics
                context_parts.append("\n=== МЕХАНИКИ ===")
                context_parts.append(f"- Система бросков: {mechanics.dice_system}")
                context_parts.append(f"- Характеристики: {', '.join(mechanics.stats)}")
                context_parts.append(f"- Внутренние голоса: {', '.join(mechanics.voices)}")
            except ProjectMechanics.DoesNotExist:
                context_parts.append("\n=== МЕХАНИКИ ===")
                context_parts.append("- Механики не настроены")
        
        # Память агента
        memories = self.get_agent_memories(agent_type, limit=3)
        if memories:
            context_parts.append(f"\n=== ПАМЯТЬ {agent_type.upper()} АГЕНТА ===")
            for memory in memories:
                context_parts.append(f"- {memory.message[:50]}... → {memory.response[:50]}...")
        
        return "\n".join(context_parts)
    
    def get_project_summary(self) -> Dict[str, Any]:
        """Получить краткое описание проекта"""
        session = self.get_current_session()
        if not session:
            return {}
        
        return {
            "id": str(session.id),
            "name": session.name,
            "genre": session.genre,
            "setting": session.setting,
            "tone": session.tone,
            "phase": session.phase,
            "description": session.description,
            "current_focus": session.current_focus,
            "last_activity": session.last_activity,
            "characters_count": session.characters.count(),
            "scenes_count": session.scenes.count(),
            "quests_count": session.quests.count(),
            "memories_count": session.agent_memories.count(),
            "created_at": session.created_at.isoformat(),
            "updated_at": session.updated_at.isoformat()
        }
    
    def list_sessions(self) -> List[Dict[str, Any]]:
        """Получить список всех сессий"""
        sessions = ProjectSession.objects.filter(is_active=True).order_by('-updated_at')
        return [
            {
                "id": str(session.id),
                "name": session.name,
                "genre": session.genre,
                "phase": session.phase,
                "updated_at": session.updated_at.isoformat()
            }
            for session in sessions
        ]


# Глобальный менеджер
project_db_manager = ProjectDBManager()
