"""
Simple AI Views for testing
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


class SimpleAIChatView(APIView):
    """
    Simple AI Chat endpoint for testing
    POST /api/ai/chat/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Simple AI chat that always returns a fallback response
        """
        try:
            # Извлекаем данные из запроса
            user_message = request.data.get('message', '')
            context = request.data.get('context', {})
            
            # Валидация
            if not user_message:
                return Response(
                    {'error': 'Message is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Простой fallback ответ
            project_name = context.get('project_name', 'ваш проект')
            genre = context.get('genre', 'игра')
            
            fallback_responses = [
                f"Понял ваше сообщение: \"{user_message}\". Как ИИ-помощник, я помогу вам создать увлекательную {genre} для {project_name}. Что конкретно вас интересует?",
                f"Интересная идея! \"{user_message}\" — это хорошее направление для развития {project_name}. Давайте обсудим детали.",
                f"Отличный вопрос! В контексте {genre} игры \"{user_message}\" может открыть много возможностей. Расскажите больше о вашем видении.",
                f"Понял! \"{user_message}\" — важный аспект для {project_name}. Как ИИ-сценарист, я готов помочь с реализацией этой идеи."
            ]
            
            import random
            ai_reply = random.choice(fallback_responses)
            
            logger.info(f"AI chat request processed: {user_message[:50]}...")
            
            return Response({
                'reply': ai_reply,
                'success': True,
                'model': 'fallback',
                'context_used': context,
                'tokens_used': 0,
                'created_at': timezone.now().isoformat()
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"AI chat error: {str(e)}")
            return Response(
                {
                    'reply': 'Извините, произошла ошибка. Попробуйте еще раз.',
                    'success': False,
                    'error': str(e),
                    'model': 'fallback'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SimpleAIStatusView(APIView):
    """
    Simple AI Status endpoint
    GET /api/ai/status/
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get AI service status"""
        try:
            return Response({
                'available': True,
                'model': 'fallback',
                'api_configured': False,
                'fallback_mode': True,
                'service': 'Simple Fallback'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"AI status error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
