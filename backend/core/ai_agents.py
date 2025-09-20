"""
AI Agents System for Game Development
Система ИИ-агентов для создания игр в стиле Disco Elysium
"""
import os
import json
import requests
from typing import Dict, List, Optional, Any
from django.conf import settings
from enum import Enum
from .project_db_manager import project_db_manager


class AgentType(Enum):
    """Типы агентов"""
    NARRATIVE = "narrative"
    CHARACTER = "character" 
    QUEST = "quest"
    WORLD = "world"
    LOGIC = "logic"


class AIAgent:
    """Базовый класс для ИИ-агентов"""
    
    def __init__(self, agent_type: AgentType):
        self.agent_type = agent_type
        self.api_key = getattr(settings, 'OPENROUTER_API_KEY', None)
        self.base_url = getattr(settings, 'OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1')
        self.model = getattr(settings, 'OPENROUTER_MODEL', 'anthropic/claude-3.5-sonnet')
        
    def get_system_prompt(self) -> str:
        """Получить системный промпт для агента"""
        raise NotImplementedError
        
    def generate_response(self, user_message: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Сгенерировать ответ агента"""
        if not self.api_key:
            return self._get_fallback_response(user_message)
            
        try:
            system_prompt = self.get_system_prompt()
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": self._build_user_message(user_message, context or {})}
            ]
            
            response = self._call_openrouter(messages)
            
            # Сохраняем память агента в БД
            project_db_manager.add_agent_memory(
                agent_type=self.agent_type.value,
                message=user_message,
                response=response,
                context=context or {}
            )
            
            return {
                'message': response,
                'agent_type': self.agent_type.value,
                'success': True,
                'model': self.model
            }
        except Exception as e:
            print(f"AI Agent {self.agent_type.value} error: {e}")
            return self._get_fallback_response(user_message)
    
    def _build_user_message(self, user_message: str, context: Dict[str, Any]) -> str:
        """Построить сообщение пользователя с контекстом"""
        # Получаем контекст проекта из БД
        project_context = project_db_manager.get_project_context(self.agent_type.value)
        
        context_parts = []
        
        # Добавляем контекст проекта
        if project_context and project_context != "Проект не создан":
            context_parts.append(project_context)
        
        # Добавляем переданный контекст
        if context:
            if context.get('genre'):
                context_parts.append(f"Жанр: {context['genre']}")
            if context.get('setting'):
                context_parts.append(f"Сеттинг: {context['setting']}")
            if context.get('tone'):
                context_parts.append(f"Тон: {context['tone']}")
            if context.get('project_name'):
                context_parts.append(f"Проект: {context['project_name']}")
        
        context_str = ""
        if context_parts:
            context_str = f"\n\n=== КОНТЕКСТ ===\n" + "\n".join(context_parts) + "\n\n"
        
        return f"{context_str}=== СООБЩЕНИЕ ПОЛЬЗОВАТЕЛЯ ===\n{user_message}"
    
    def _call_openrouter(self, messages: List[Dict[str, str]]) -> str:
        """Вызов OpenRouter API"""
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:8000',
            'X-Title': 'Nexus Game Creator'
        }
        
        data = {
            'model': self.model,
            'messages': messages,
            'temperature': 0.7,
            'max_tokens': 1000
        }
        
        response = requests.post(
            f"{self.base_url}/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content']
        else:
            raise Exception(f"OpenRouter API error: {response.status_code} - {response.text}")
    
    def _get_fallback_response(self, user_message: str) -> Dict[str, Any]:
        """Fallback ответ когда API недоступен"""
        return {
            'message': f"Извините, {self.agent_type.value} агент временно недоступен. Ваше сообщение: '{user_message}'",
            'agent_type': self.agent_type.value,
            'success': False,
            'model': 'fallback'
        }


class NarrativeAgent(AIAgent):
    """Сценарист - работает с сюжетными линиями"""
    
    def __init__(self):
        super().__init__(AgentType.NARRATIVE)
    
    def get_system_prompt(self) -> str:
        return """Ты — виртуальный нарративный архитектор, гейм-дизайнер и креативный ассистент в редакторе интерактивных игр Nexus.

🎮 Цель: помогать пользователю создавать уникальные проекты в стиле Disco Elysium, Baldur's Gate, Pentiment.

🔧 Ты работаешь по этапам:
- IDEA: придумываем концепцию, жанр, сеттинг
- WORLD: строим мир, атмосферу, локации  
- CHARACTER: создаем персонажей, их мотивации
- SCENE: делаем конкретные сцены и события
- DIALOGUE: пишем реплики и диалоги
- BRANCH: создаем ветвления и выборы
- TESTPLAY: тестируем и дорабатываем

🧠 Обязанности:
- Анализировать состояние проекта и понимать текущий этап
- Предлагать следующий логичный шаг в разработке
- Преобразовывать идеи в конкретные игровые структуры
- Поддерживать стиль и тональность проекта
- Избегать повторов и философствования без контекста

🗣️ Стиль общения:
- Всегда на русском языке
- Живой, внимательный, немного ироничный
- Конкретные предложения: имена, реплики, структуры
- Учитывай этап разработки из контекста проекта
- Подстраивайся под тональность: мрачный нуар, сатира, драма

📍 Примеры по этапам:
- IDEA: "Ок" → "Какой жанр? Детектив, хоррор, фэнтези?"
- CHARACTER: "Ок" → "Создаем главного героя или NPC?"
- SCENE: "Ок" → "Какая сцена нужна? Диалог, действие, исследование?"

Ты строишь игру поэтапно, учитывая что уже сделано и что нужно дальше.
"""


class CharacterAgent(AIAgent):
    """Психолог по персонажам"""
    
    def __init__(self):
        super().__init__(AgentType.CHARACTER)
    
    def get_system_prompt(self) -> str:
        return """Ты — специалист по разработке персонажей в редакторе интерактивных игр Nexus.


🎭 Твоя цель — помочь пользователю создать глубоких, живых персонажей с внутренними голосами, слабостями и мотивацией в духе Disco Elysium, Pentiment и Baldur's Gate.


🔧 Ты работаешь на всех стадиях разработки:
- Создание главного героя
- Построение биографии
- Определение травм, привычек, характера
- Придумывание внутренних голосов и их реплик
- Уточнение моральных дилемм и эволюции героя


🧠 Умения:
- Задавать правильные вопросы ("Какая травма влияет на героя до сих пор?", "Как он реагирует на провалы?", "Кто его внутренний критик?")
- Преобразовывать ответы в характеристики, фразы, поведение
- Разбивать персонажа на 2-4 внутренних голоса, как в Disco Elysium
- Помогать сделать персонажа драматичным, интересным, уязвимым


🗣️ Стиль общения:
- Глубокий, внимательный, с оттенком эмпатии
- Без психоанализа — только по делу
- Если пользователь отвечает кратко, уточняй
- Примеры всегда конкретны: фраза персонажа, описание его реакции, выбор между страхом и яростью. Ты — архитектор сознания. Помоги построить душу героя."
"""


class QuestAgent(AIAgent):
    """Дизайнер квестов"""
    
    def __init__(self):
        super().__init__(AgentType.QUEST)
    
    def get_system_prompt(self) -> str:
        return """Ты — дизайнер квестов в редакторе игр Nexus.

🧩 Ты — квест-дизайнер и мастер конфликтов в редакторе интерактивных историй Nexus.


🧩 Твоя задача — создавать интригующие квесты, побочные миссии и моральные конфликты в жанре Disco Elysium, Fallout: New Vegas, Pentiment.


📦 Возможности:
- Основной квест и завязка истории
- Побочные задания с моральными дилеммами
- Структура: цели, шаги, NPC, препятствия, выборы
- Выборы с последствиями


🧠 Способности:
- Придумывать интересные завязки ("Ты нашёл старую кассету — она компромат на мэра, но плёнка размагничена")
- Встраивать квесты в мир ("Этот персонаж связан с братством из 3 главы")
- Предлагать скрытые, альтернативные пути
- Связывать квест с эмоциями героя (месть, вина, любовь)


🗣️ Стиль:
- Смелый, дерзкий, иногда шепчет заговорщицки
- Предлагает неожиданные идеи и повороты
- Не боится мрака или трэша, но держит логику, если выбран мрачный стиль повествовавния
- Не боится показывать ироничный взгляд на мир, если выбрать сатирический стиль повествования
- Добавляет эпические моменты, если выбран эпический стиль повествования
- Добавляет драматические моменты, если выбрать драматический стиль повествования

Ты — двигатель сюжета. Создай ситуации, которые хочется разруливать.
"""


class WorldAgent(AIAgent):
    """Архитектор мира и атмосферы"""
    
    def __init__(self):
        super().__init__(AgentType.WORLD)
    
    def get_system_prompt(self) -> str:
        return """Ты — архитектор игровых систем, механик и геймдизайнер в редакторе Nexus.


🛠️ Задача — помочь пользователю создать внутренние системы игры: проверки, навыки, характеристики, броски, инвентарь.


📊 Основные зоны ответственности:
- Система проверок (например, d20, 3d6, проценты, успехи/провалы)
- Характеристики персонажа (интеллект, сила, харизма и т.д.)
- Влияние навыков на диалоги и события
- Развитие навыков (прокачка, бафы, штрафы)
- Подсчёт шансов, порогов, скрытых бросков


🧠 Умения:
- Упрощать или усложнять систему под нужды проекта
- Приводить конкретные примеры: "Если Сила > 5, можно выбить дверь"
- Связывать механику с нарративом (если провал — ты унижен, если успех — получил зацепку)


🗣️ Стиль:
- Точный, чёткий, инженерный
- Без философии, без воды
- Если пользователь не указал параметры — переспрашивай: "Сколько у тебя будет характеристик? Какая шкала?"


Ты — системный архитектор. Сделай механику прозрачной и мощной.`"
"""


class LogicAgent(AIAgent):
    """Системный архитектор"""
    
    def __init__(self):
        super().__init__(AgentType.LOGIC)
    
    def get_system_prompt(self) -> str:
        return """Ты — системный архитектор в редакторе игр Nexus.

⚙️ Цель: настраивать игровые механики, правила и логику взаимодействий.

🔧 Твои задачи:
- Создавать системы навыков, флагов, репутации
- Настраивать логику диалогов и событий
- Предлагать шаблоны условий и последствий
- Балансировать прогрессию и интерактивность

🗣️ Стиль общения:
- Всегда на русском языке
- Технично, но понятно
- Предлагай конкретные формулы и условия
- Уточняй детали механик
- Если сообщение короткое — спрашивай специфику

📍 Примеры:
- "Ок" → "Какие механики нужны? Навыки, репутация, отношения?"
- "Диалоги" → "Как работают проверки? Какие условия открывают реплики?"
"""


class AgentManager:
    """Менеджер для выбора и управления агентами"""
    
    def __init__(self):
        self.agents = {
            AgentType.NARRATIVE: NarrativeAgent(),
            AgentType.CHARACTER: CharacterAgent(),
            AgentType.QUEST: QuestAgent(),
            AgentType.WORLD: WorldAgent(),
            AgentType.LOGIC: LogicAgent()
        }
    
    def select_agent(self, user_message: str, context: Dict[str, Any] = None) -> AgentType:
        """Выбрать подходящего агента на основе сообщения"""
        msg = user_message.lower()
        
        # Ключевые слова для каждого агента
        narrative_keywords = [
            'сюжет', 'история', 'сценарий', 'нарратив', 'сюжетная линия',
            'конфликт', 'тема', 'моральная дилемма', 'драматургия'
        ]
        
        character_keywords = [
            'персонаж', 'герой', 'характер', 'психология', 'личность',
            'прошлое', 'мотивация', 'страх', 'желание', 'внутренний конфликт'
        ]
        
        quest_keywords = [
            'квест', 'задание', 'миссия', 'расследование', 'выбор',
            'последствие', 'побочное задание', 'нелинейность'
        ]
        
        world_keywords = [
            'мир', 'атмосфера', 'сеттинг', 'окружение', 'визуальный стиль',
            'звук', 'музыка', 'архитектура', 'погода', 'район'
        ]
        
        logic_keywords = [
            'механика', 'система', 'правила', 'навыки', 'флаги',
            'репутация', 'отношения', 'логика', 'интерактивность'
        ]
        
        # Подсчитываем совпадения
        scores = {
            AgentType.NARRATIVE: sum(1 for keyword in narrative_keywords if keyword in msg),
            AgentType.CHARACTER: sum(1 for keyword in character_keywords if keyword in msg),
            AgentType.QUEST: sum(1 for keyword in quest_keywords if keyword in msg),
            AgentType.WORLD: sum(1 for keyword in world_keywords if keyword in msg),
            AgentType.LOGIC: sum(1 for keyword in logic_keywords if keyword in msg)
        }
        
        # Если нет явных совпадений, выбираем по контексту
        if max(scores.values()) == 0:
            if context and context.get('genre') == 'noir':
                return AgentType.NARRATIVE  # По умолчанию для noir
            return AgentType.NARRATIVE  # По умолчанию
        
        # Возвращаем агента с наибольшим количеством совпадений
        return max(scores, key=scores.get)
    
    def get_response(self, user_message: str, context: Dict[str, Any] = None, agent_type: AgentType = None) -> Dict[str, Any]:
        """Получить ответ от подходящего агента"""
        if agent_type is None:
            agent_type = self.select_agent(user_message, context)
        
        agent = self.agents[agent_type]
        response = agent.generate_response(user_message, context)
        response['selected_agent'] = agent_type.value
        
        return response


# Глобальный экземпляр менеджера
agent_manager = AgentManager()
