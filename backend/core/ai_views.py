"""
AI Views for Nexus - Production-ready AI chat and content generation endpoints
"""
import logging
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction

from .models import ChatSession, ChatMessage, AIConfig, GameProject
from .serializers import (
    ChatSessionSerializer, ChatSessionListSerializer, ChatMessageSerializer,
    AIConfigSerializer, ChatRequestSerializer, ChatResponseSerializer,
    ContentGenerationRequestSerializer, ContentGenerationResponseSerializer
)
from .ai_service import ai_service

logger = logging.getLogger(__name__)


class ChatSessionViewSet(viewsets.ModelViewSet):
    """ViewSet для управления сессиями чата"""
    queryset = ChatSession.objects.all()
    permission_classes = [permissions.AllowAny]  # TODO: Change to IsAuthenticated for production
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ChatSessionListSerializer
        return ChatSessionSerializer
    
    def get_queryset(self):
        # Фильтруем по пользователю, если аутентифицирован
        user = self.request.user
        if user.is_authenticated:
            return self.queryset.filter(user=user)
        return self.queryset.filter(user__isnull=True)
    
    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Получить сообщения сессии"""
        session = self.get_object()
        messages = session.messages.all()
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def clear_history(self, request, pk=None):
        """Очистить историю сообщений"""
        session = self.get_object()
        session.messages.all().delete()
        return Response({'message': 'History cleared successfully'})


class AIConfigViewSet(viewsets.ModelViewSet):
    """ViewSet для управления конфигурацией ИИ"""
    queryset = AIConfig.objects.all()
    serializer_class = AIConfigSerializer
    permission_classes = [permissions.AllowAny]  # TODO: Change to IsAuthenticated for production


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def ai_chat(request):
    """
    Production-ready AI chat endpoint
    POST /api/ai/chat/
    
    Request body:
    {
        "message": "Привет! Помоги создать персонажа",
        "session_id": "uuid", // optional
        "project_id": "uuid", // optional
        "context": {
            "genre": "noir",
            "tone": "dark-noir",
            "project_name": "Мой проект"
        },
        "save_to_history": true
    }
    
    Response:
    {
        "message": "Ответ ИИ",
        "session_id": "uuid",
        "message_id": "uuid",
        "success": true,
        "model": "anthropic/claude-3.5-sonnet",
        "tokens_used": 150,
        "fallback": false,
        "created_at": "2024-01-01T12:00:00Z"
    }
    """
    try:
        # Валидация входных данных
        serializer = ChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid request data', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = serializer.validated_data
        message = data['message']
        session_id = data.get('session_id')
        project_id = data.get('project_id')
        context = data.get('context', {})
        save_to_history = data.get('save_to_history', True)
        
        # Получаем или создаем сессию чата
        session = _get_or_create_chat_session(
            session_id=session_id,
            project_id=project_id,
            context=context,
            user=request.user if request.user.is_authenticated else None
        )
        
        # Получаем историю сообщений для контекста
        conversation_history = []
        if save_to_history:
            recent_messages = session.get_recent_messages(limit=10)
            conversation_history = [
                {'role': msg['role'], 'content': msg['content']}
                for msg in recent_messages
            ]
        
        # Генерируем ответ через AI сервис
        ai_response = ai_service.generate_chat_response(
            message=message,
            context=context,
            conversation_history=conversation_history
        )
        
        # Сохраняем сообщения в базу данных
        user_message = None
        ai_message = None
        
        if save_to_history:
            with transaction.atomic():
                # Сохраняем сообщение пользователя
                user_message = ChatMessage.objects.create(
                    session=session,
                    role='user',
                    content=message,
                    is_ai_generated=False
                )
                
                # Сохраняем ответ ИИ
                ai_message = ChatMessage.objects.create(
                    session=session,
                    role='assistant',
                    content=ai_response['message'],
                    is_ai_generated=True,
                    metadata={
                        'model': ai_response.get('model', 'unknown'),
                        'tokens_used': ai_response.get('tokens_used', 0),
                        'success': ai_response.get('success', False),
                        'fallback': ai_response.get('fallback', False)
                    }
                )
        
        # Формируем ответ
        response_data = {
            'message': ai_response['message'],
            'session_id': str(session.id),
            'message_id': str(ai_message.id) if ai_message else None,
            'success': ai_response.get('success', True),
            'model': ai_response.get('model', 'unknown'),
            'tokens_used': ai_response.get('tokens_used', 0),
            'fallback': ai_response.get('fallback', False),
            'created_at': timezone.now()
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"AI chat error: {e}")
        return Response(
            {'error': 'Internal server error', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def generate_content(request):
    """
    Generate specific content using AI
    POST /api/ai/generate-content/
    
    Request body:
    {
        "content_type": "dialogue",
        "prompt": "Создай диалог между детективом и подозреваемым",
        "project_id": "uuid", // optional
        "context": {
            "genre": "noir",
            "tone": "dark-noir"
        }
    }
    
    Response:
    {
        "content": {...},
        "content_type": "dialogue",
        "success": true,
        "model": "anthropic/claude-3.5-sonnet",
        "tokens_used": 200,
        "fallback": false
    }
    """
    try:
        # Валидация входных данных
        serializer = ContentGenerationRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'error': 'Invalid request data', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = serializer.validated_data
        content_type = data['content_type']
        prompt = data['prompt']
        project_id = data.get('project_id')
        context = data.get('context', {})
        
        # Получаем контекст проекта, если указан
        if project_id:
            try:
                project = GameProject.objects.get(id=project_id)
                context.update({
                    'project_name': project.name,
                    'project_description': project.description
                })
            except GameProject.DoesNotExist:
                pass
        
        # Генерируем контент через AI сервис
        ai_response = ai_service.generate_content(
            content_type=content_type,
            prompt=prompt,
            context=context
        )
        
        # Формируем ответ
        response_data = {
            'content': ai_response['content'],
            'content_type': content_type,
            'success': ai_response.get('success', True),
            'model': ai_response.get('model', 'unknown'),
            'tokens_used': ai_response.get('tokens_used', 0),
            'fallback': ai_response.get('fallback', False)
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Content generation error: {e}")
        return Response(
            {'error': 'Internal server error', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def ai_status(request):
    """
    Get AI service status
    GET /api/ai/status/
    
    Response:
    {
        "available": true,
        "model": "anthropic/claude-3.5-sonnet",
        "api_configured": true,
        "fallback_mode": false
    }
    """
    try:
        is_available = ai_service.is_available()
        
        response_data = {
            'available': is_available,
            'model': ai_service.model,
            'api_configured': bool(ai_service.api_key),
            'fallback_mode': not is_available
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"AI status error: {e}")
        return Response(
            {'error': 'Internal server error', 'details': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def _get_or_create_chat_session(session_id=None, project_id=None, context=None, user=None):
    """Получить или создать сессию чата"""
    if session_id:
        try:
            session = ChatSession.objects.get(id=session_id)
            # Обновляем контекст, если передан
            if context:
                session.context.update(context)
                session.save()
            return session
        except ChatSession.DoesNotExist:
            pass
    
    # Создаем новую сессию
    project = None
    if project_id:
        try:
            project = GameProject.objects.get(id=project_id)
        except GameProject.DoesNotExist:
            pass
    
    session_name = f"Chat Session {timezone.now().strftime('%Y-%m-%d %H:%M')}"
    if project:
        session_name = f"Chat with {project.name}"
    
    session = ChatSession.objects.create(
        user=user,
        project=project,
        session_name=session_name,
        context=context or {}
    )
    
    return session
