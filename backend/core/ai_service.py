"""
AI Service for Nexus - Production-ready AI chat and content generation
"""
import os
import json
import requests
from typing import Dict, List, Optional, Any
from django.conf import settings
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)


class AIService:
    """Production-ready AI service for chat and content generation"""
    
    def __init__(self):
        self.api_key = getattr(settings, 'OPENROUTER_API_KEY', None)
        self.base_url = getattr(settings, 'OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1')
        self.model = getattr(settings, 'OPENROUTER_MODEL', 'anthropic/claude-3.5-sonnet')
        self.timeout = 30  # seconds
        self.max_retries = 3
        
    def is_available(self) -> bool:
        """Check if AI service is available"""
        return bool(self.api_key)
    
    def generate_chat_response(
        self, 
        message: str, 
        context: Dict[str, Any] = None,
        conversation_history: List[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Generate AI chat response with context and history
        
        Args:
            message: User's message
            context: Project context (genre, tone, characters, etc.)
            conversation_history: Previous messages in conversation
            
        Returns:
            Dict with AI response and metadata
        """
        if not self.is_available():
            return self._get_fallback_response(message, context)
        
        try:
            # Build conversation context
            system_prompt = self._build_system_prompt(context or {})
            messages = self._build_conversation_messages(
                system_prompt, message, conversation_history or []
            )
            
            # Make API request
            response = self._call_ai_api(messages)
            
            # Parse and return response
            return self._parse_chat_response(response, message, context)
            
        except Exception as e:
            logger.error(f"AI chat generation failed: {e}")
            return self._get_fallback_response(message, context)
    
    def generate_content(
        self, 
        content_type: str, 
        prompt: str, 
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Generate specific content (dialogue, character, quest, etc.)
        
        Args:
            content_type: Type of content to generate
            prompt: Specific prompt for generation
            context: Project context
            
        Returns:
            Dict with generated content
        """
        if not self.is_available():
            return self._get_fallback_content(content_type, prompt)
        
        try:
            system_prompt = self._build_content_system_prompt(content_type, context or {})
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]
            
            response = self._call_ai_api(messages)
            return self._parse_content_response(response, content_type)
            
        except Exception as e:
            logger.error(f"AI content generation failed: {e}")
            return self._get_fallback_content(content_type, prompt)
    
    def _build_system_prompt(self, context: Dict[str, Any]) -> str:
        """Build system prompt for chat responses"""
        project_name = context.get('project_name', '')
        genre = context.get('genre', 'noir')
        tone = context.get('tone', 'dark-noir')
        setting = context.get('setting', '')
        characters = context.get('characters', [])
        
        # Style instructions based on tone
        style_instructions = {
            'dark-noir': 'Отвечай в стиле темного нуара: мрачно, иронично, с философскими размышлениями о природе человека.',
            'philosophical': 'Отвечай как философ-нарратор: глубоко, размышляя о смысле и сути вещей.',
            'satirical': 'Отвечай с сарказмом и остроумием: критично, но конструктивно.',
            'melancholic': 'Отвечай меланхолично: грустно, но красиво, с ностальгией.',
            'energetic': 'Отвечай энергично: динамично, с энтузиазмом и драйвом.',
            'mystical': 'Отвечай загадочно: с элементами мистики и тайны.',
            'cyberpunk': 'Отвечай в стиле киберпанка: технологично, с элементами антиутопии.'
        }
        
        style_instruction = style_instructions.get(tone, style_instructions['dark-noir'])
        
        # Character context
        character_context = ""
        if characters:
            character_names = [char.get('name', 'Unknown') for char in characters[:3]]
            character_context = f"\nПерсонажи в проекте: {', '.join(character_names)}"
        
        system_prompt = f"""Ты — виртуальный нарративный архитектор, гейм-дизайнер и креативный ассистент в редакторе интерактивных игр Nexus.

🎮 Цель: помогать пользователю создавать уникальные проекты в стиле Disco Elysium, Baldur's Gate, Pentiment, используя сцены, персонажей, диалоги, события и механики.

🔧 Ты работаешь в режиме ИИ-помощника:
- Отвечай на вопросы о создании игр
- Предлагай идеи для сюжета, персонажей, диалогов
- Помогай с геймдизайном и нарративом
- Анализируй и улучшай существующий контент

📦 Контекст проекта:
- Название: {project_name}
- Жанр: {genre}
- Сеттинг: {setting}
- Тональность: {tone}{character_context}

🎨 Стиль ответа:
{style_instruction}

📝 Правила:
1. Отвечай на русском языке
2. Будь креативным, но практичным
3. Предлагай конкретные решения
4. Учитывай контекст проекта
5. Поддерживай атмосферу игры

Отвечай как опытный геймдизайнер и нарративный дизайнер, готовый помочь создать увлекательную игру."""
        
        return system_prompt
    
    def _build_content_system_prompt(self, content_type: str, context: Dict[str, Any]) -> str:
        """Build system prompt for specific content generation"""
        base_prompt = self._build_system_prompt(context)
        
        content_instructions = {
            'dialogue': """
Дополнительно для генерации диалогов:
- Создавай естественные, живые диалоги
- Учитывай характер персонажей
- Добавляй эмоциональную окраску
- Включай подтекст и скрытые мотивы
- Создавай варианты ответов для игрока""",
            
            'character': """
Дополнительно для создания персонажей:
- Разрабатывай глубокие, многогранные личности
- Создавай уникальные черты характера
- Добавляй мотивации и цели
- Продумывай отношения с другими персонажами
- Включай недостатки и противоречия""",
            
            'quest': """
Дополнительно для создания квестов:
- Создавай увлекательные сюжетные линии
- Добавляй моральные дилеммы
- Включай несколько путей решения
- Продумывай последствия выборов
- Создавай атмосферные описания""",
            
            'scene': """
Дополнительно для создания сцен:
- Создавай атмосферные описания
- Включай детали окружения
- Добавляй эмоциональную окраску
- Продумывай взаимодействия
- Создавай визуальные образы"""
        }
        
        additional_instruction = content_instructions.get(content_type, "")
        return base_prompt + additional_instruction
    
    def _build_conversation_messages(
        self, 
        system_prompt: str, 
        current_message: str, 
        history: List[Dict[str, str]]
    ) -> List[Dict[str, str]]:
        """Build conversation messages for API"""
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history (limit to last 10 messages to avoid token limits)
        for msg in history[-10:]:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
        
        # Add current message
        messages.append({"role": "user", "content": current_message})
        
        return messages
    
    def _call_ai_api(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """Make API call to OpenRouter"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://nexus-editor.local",
            "X-Title": "Nexus Editor"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": 1000,
            "temperature": 0.7,
            "top_p": 0.9,
            "frequency_penalty": 0.1,
            "presence_penalty": 0.1
        }
        
        for attempt in range(self.max_retries):
            try:
                response = requests.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
                
            except requests.exceptions.RequestException as e:
                logger.warning(f"API call attempt {attempt + 1} failed: {e}")
                if attempt == self.max_retries - 1:
                    raise
                continue
    
    def _parse_chat_response(
        self, 
        api_response: Dict[str, Any], 
        user_message: str, 
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Parse AI API response for chat"""
        try:
            content = api_response['choices'][0]['message']['content']
            
            return {
                'message': content,
                'success': True,
                'model': self.model,
                'tokens_used': api_response.get('usage', {}).get('total_tokens', 0),
                'context': context,
                'user_message': user_message
            }
        except (KeyError, IndexError) as e:
            logger.error(f"Failed to parse AI response: {e}")
            return self._get_fallback_response(user_message, context)
    
    def _parse_content_response(
        self, 
        api_response: Dict[str, Any], 
        content_type: str
    ) -> Dict[str, Any]:
        """Parse AI API response for content generation"""
        try:
            content = api_response['choices'][0]['message']['content']
            
            # Try to parse as JSON if it looks like structured data
            try:
                parsed_content = json.loads(content)
            except json.JSONDecodeError:
                parsed_content = {'content': content}
            
            return {
                'content': parsed_content,
                'success': True,
                'content_type': content_type,
                'model': self.model,
                'tokens_used': api_response.get('usage', {}).get('total_tokens', 0)
            }
        except (KeyError, IndexError) as e:
            logger.error(f"Failed to parse AI content response: {e}")
            return self._get_fallback_content(content_type, "")
    
    def _get_fallback_response(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Get fallback response when AI is unavailable"""
        project_name = context.get('project_name', 'ваш проект')
        genre = context.get('genre', 'игра')
        
        fallback_responses = [
            f"Понял ваше сообщение: \"{message}\". Как ИИ-помощник, я помогу вам создать увлекательную {genre} для {project_name}. Что конкретно вас интересует?",
            f"Интересная идея! \"{message}\" — это хорошее направление для развития {project_name}. Давайте обсудим детали.",
            f"Отличный вопрос! В контексте {genre} игры \"{message}\" может открыть много возможностей. Расскажите больше о вашем видении.",
            f"Понял! \"{message}\" — важный аспект для {project_name}. Как ИИ-помощник, я готов помочь с реализацией этой идеи."
        ]
        
        import random
        fallback_message = random.choice(fallback_responses)
        
        return {
            'message': fallback_message,
            'success': False,
            'fallback': True,
            'model': 'fallback',
            'tokens_used': 0,
            'context': context,
            'user_message': message
        }
    
    def _get_fallback_content(self, content_type: str, prompt: str) -> Dict[str, Any]:
        """Get fallback content when AI is unavailable"""
        fallback_content = {
            'dialogue': {
                'content': f"Диалог на тему: {prompt}\n\n[Персонаж]: Это интересная тема для обсуждения.\n[Игрок]: Да, я согласен.\n[Персонаж]: Что вы думаете об этом?",
                'suggestions': [
                    "Попробуйте добавить больше эмоций",
                    "Включите конфликт интересов",
                    "Добавьте подтекст в диалог"
                ]
            },
            'character': {
                'content': f"Персонаж: {prompt}\n\nОписание: Интересный персонаж с уникальными чертами характера.\nМотивация: Имеет свои цели и стремления.\nОтношения: Взаимодействует с другими персонажами.",
                'suggestions': [
                    "Добавьте недостатки персонажа",
                    "Создайте уникальную внешность",
                    "Продумайте мотивацию"
                ]
            },
            'quest': {
                'content': f"Квест: {prompt}\n\nОписание: Увлекательное задание для игрока.\nЦель: Достичь определенного результата.\nНаграда: Получить что-то ценное.",
                'suggestions': [
                    "Добавьте моральные дилеммы",
                    "Создайте несколько путей решения",
                    "Включите неожиданные повороты"
                ]
            }
        }
        
        return {
            'content': fallback_content.get(content_type, {'content': f"Контент: {prompt}"}),
            'success': False,
            'fallback': True,
            'content_type': content_type,
            'model': 'fallback',
            'tokens_used': 0
        }


# Global instance
ai_service = AIService()
