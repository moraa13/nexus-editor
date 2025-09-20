"""
AI Views for Nexus - Enhanced AI chat endpoints
"""
import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.conf import settings
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

# Настройка OpenAI для версии 0.28.1
openai.api_key = getattr(settings, 'OPENAI_API_KEY', None)


class AIChatView(APIView):
    """
    Enhanced AI Chat endpoint with Disco Elysium style responses
    POST /api/ai/chat/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Handle AI chat requests with enhanced context and error handling
        
        Request body:
        {
            "message": "Помоги создать персонажа",
            "context": {
                "genre": "noir",
                "tone": "dark-noir",
                "project_name": "Мой проект"
            }
        }
        
        Response:
        {
            "reply": "AI response",
            "success": true,
            "model": "gpt-3.5-turbo",
            "context_used": {...}
        }
        """
        try:
            # Извлекаем данные из запроса
            user_message = request.data.get('message')
            context = request.data.get('context', {})
            
            # Валидация
            if not user_message:
                return Response(
                    {'error': 'Message is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Проверяем наличие API ключа
            if not openai.api_key:
                logger.warning("OpenAI API key not configured")
                return Response(
                    {
                        'reply': self._get_fallback_response(user_message, context),
                        'success': False,
                        'model': 'fallback',
                        'context_used': context,
                        'warning': 'OpenAI API key not configured, using fallback response'
                    },
                    status=status.HTTP_200_OK
                )
            
            # Строим промпт с учетом контекста
            prompt = self._build_prompt(user_message, context)
            
            # Вызываем OpenAI API
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system", 
                        "content": self._get_system_prompt(context)
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                max_tokens=500,
                temperature=0.7,
                top_p=0.9
            )
            
            ai_reply = completion['choices'][0]['message']['content']
            
            # Логируем успешный запрос
            logger.info(f"AI chat request processed successfully. Tokens used: {completion.get('usage', {}).get('total_tokens', 0)}")
            
            return Response({
                'reply': ai_reply,
                'success': True,
                'model': 'gpt-3.5-turbo',
                'context_used': context,
                'tokens_used': completion.get('usage', {}).get('total_tokens', 0),
                'created_at': timezone.now().isoformat()
            }, status=status.HTTP_200_OK)
            
        except openai.error.RateLimitError:
            logger.error("OpenAI rate limit exceeded")
            return Response(
                {
                    'reply': 'Извините, сервер перегружен. Попробуйте через минуту.',
                    'success': False,
                    'error': 'Rate limit exceeded'
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
            
        except openai.error.AuthenticationError:
            logger.error("OpenAI authentication failed")
            return Response(
                {
                    'reply': 'Проблема с аутентификацией AI сервиса.',
                    'success': False,
                    'error': 'Authentication failed'
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        except Exception as e:
            logger.error(f"AI chat error: {str(e)}")
            return Response(
                {
                    'reply': self._get_fallback_response(user_message, context),
                    'success': False,
                    'error': str(e),
                    'model': 'fallback'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _get_system_prompt(self, context):
        """Создает системный промпт на основе контекста"""
        genre = context.get('genre', 'noir')
        tone = context.get('tone', 'dark-noir')
        project_name = context.get('project_name', 'ваш проект')
        
        # Стилистические инструкции
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
        
        return f"""Ты — ИИ-сценарист, работающий в духе Disco Elysium. Ты помогаешь создавать глубокие, философские игры с моральными дилеммами и сложными персонажами.

🎮 Проект: {project_name}
🎭 Жанр: {genre}
🎨 Стиль: {style_instruction}

📝 Твоя роль:
- Помогать создавать уникальных персонажей с глубиной
- Предлагать моральные дилеммы и сложные выборы
- Создавать атмосферные сцены и диалоги
- Развивать философские темы в игровом контексте
- Поддерживать стиль Disco Elysium: ирония, глубина, человечность

🔧 Правила:
- Отвечай на русском языке
- Будь креативным, но практичным
- Предлагай конкретные решения
- Учитывай контекст проекта
- Поддерживай атмосферу игры

Отвечай как опытный сценарист, готовый помочь создать увлекательную игру."""
    
    def _build_prompt(self, user_message, context):
        """Строит промпт для пользователя"""
        project_name = context.get('project_name', 'ваш проект')
        genre = context.get('genre', 'игра')
        
        return f"""Пользователь работает над проектом "{project_name}" в жанре {genre}.

Сообщение пользователя: {user_message}

Помоги пользователю с его запросом, учитывая контекст проекта и стиль Disco Elysium."""
    
    def _get_fallback_response(self, user_message, context):
        """Fallback ответы когда AI недоступен"""
        project_name = context.get('project_name', 'ваш проект')
        genre = context.get('genre', 'игра')
        
        fallback_responses = [
            f"Понял ваше сообщение: \"{user_message}\". Как ИИ-сценарист, я помогу вам создать увлекательную {genre} для {project_name}. Что конкретно вас интересует?",
            f"Интересная идея! \"{user_message}\" — это хорошее направление для развития {project_name}. Давайте обсудим детали.",
            f"Отличный вопрос! В контексте {genre} игры \"{user_message}\" может открыть много возможностей. Расскажите больше о вашем видении.",
            f"Понял! \"{user_message}\" — важный аспект для {project_name}. Как ИИ-сценарист, я готов помочь с реализацией этой идеи."
        ]
        
        import random
        return random.choice(fallback_responses)


class AIContentGenerationView(APIView):
    """
    AI Content Generation endpoint
    POST /api/ai/generate-content/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Generate specific content using AI
        
        Request body:
        {
            "content_type": "dialogue",
            "prompt": "Создай диалог между детективом и подозреваемым",
            "context": {...}
        }
        """
        try:
            content_type = request.data.get('content_type', 'dialogue')
            prompt = request.data.get('prompt', '')
            context = request.data.get('context', {})
            
            if not prompt:
                return Response(
                    {'error': 'Prompt is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not openai.api_key:
                return Response(
                    {
                        'content': self._get_fallback_content(content_type, prompt),
                        'success': False,
                        'model': 'fallback'
                    },
                    status=status.HTTP_200_OK
                )
            
            # Специальные промпты для разных типов контента
            system_prompts = {
                'dialogue': f"""Ты создаешь диалоги для игры в стиле Disco Elysium.
                
Контекст: {context}

Создай естественный, живой диалог с:
- Уникальными голосами персонажей
- Эмоциональной окраской
- Подтекстом и скрытыми мотивами
- Вариантами ответов для игрока""",
                
                'character': f"""Ты создаешь персонажей для игры в стиле Disco Elysium.
                
Контекст: {context}

Создай глубокого, многогранного персонажа с:
- Уникальными чертами характера
- Мотивациями и целями
- Недостатками и противоречиями
- Отношениями с другими персонажами""",
                
                'quest': f"""Ты создаешь квесты для игры в стиле Disco Elysium.
                
Контекст: {context}

Создай увлекательный квест с:
- Моральными дилеммами
- Несколькими путями решения
- Последствиями выборов
- Атмосферными описаниями""",
                
                'scene': f"""Ты создаешь сцены для игры в стиле Disco Elysium.
                
Контекст: {context}

Создай атмосферную сцену с:
- Детальными описаниями окружения
- Эмоциональной окраской
- Взаимодействиями персонажей
- Визуальными образами"""
            }
            
            system_prompt = system_prompts.get(content_type, system_prompts['dialogue'])
            
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.8
            )
            
            content = completion['choices'][0]['message']['content']
            
            return Response({
                'content': content,
                'content_type': content_type,
                'success': True,
                'model': 'gpt-3.5-turbo',
                'tokens_used': completion.get('usage', {}).get('total_tokens', 0)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Content generation error: {str(e)}")
            return Response(
                {
                    'content': self._get_fallback_content(content_type, prompt),
                    'success': False,
                    'error': str(e),
                    'model': 'fallback'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _get_fallback_content(self, content_type, prompt):
        """Fallback контент когда AI недоступен"""
        fallback_content = {
            'dialogue': f"Диалог на тему: {prompt}\n\n[Персонаж]: Это интересная тема для обсуждения.\n[Игрок]: Да, я согласен.\n[Персонаж]: Что вы думаете об этом?",
            'character': f"Персонаж: {prompt}\n\nОписание: Интересный персонаж с уникальными чертами характера.\nМотивация: Имеет свои цели и стремления.\nОтношения: Взаимодействует с другими персонажами.",
            'quest': f"Квест: {prompt}\n\nОписание: Увлекательное задание для игрока.\nЦель: Достичь определенного результата.\nНаграда: Получить что-то ценное.",
            'scene': f"Сцена: {prompt}\n\nОписание: Атмосферная локация с интересными деталями.\nНастроение: Создает определенную атмосферу.\nВзаимодействия: Возможности для игрока."
        }
        
        return fallback_content.get(content_type, f"Контент: {prompt}")


class AIStatusView(APIView):
    """
    AI Service Status endpoint
    GET /api/ai/status/
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get AI service status"""
        try:
            is_configured = bool(openai.api_key)
            
            return Response({
                'available': is_configured,
                'model': 'gpt-3.5-turbo',
                'api_configured': is_configured,
                'fallback_mode': not is_configured,
                'service': 'OpenAI'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"AI status error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
