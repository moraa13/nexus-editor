import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .quest_generator import quest_generator


@api_view(['POST'])
@permission_classes([AllowAny])
def generate_chat_response(request):
    """Generate AI response for chat messages"""
    try:
        data = request.data
        message = data.get('message', '')
        project_id = data.get('projectId')
        context = data.get('context', {})
        
        if not message:
            return Response(
                {'error': 'Message is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Build context for AI generation
        ai_context = {
            'user_message': message,
            'project_id': project_id,
            'genre': context.get('genre', 'noir'),
            'tone': context.get('tone', 'dark-noir'),
            'project_name': context.get('project_name', ''),
            'setting': context.get('setting', ''),
            'character': context.get('character', {}),
            'current_step': 0
        }
        
        # Use quest generator for now (we'll create a dedicated chat generator later)
        try:
            # Generate response using AI
            response_data = quest_generator.generate_chat_response(ai_context)
        except Exception as e:
            print(f"AI generation failed: {e}")
            # Fallback response
            response_data = {
                'message': f'Понял ваше сообщение: "{message}". Как ИИ-помощник, я помогу вам создать увлекательную игру в стиле Disco Elysium. Что конкретно вас интересует?'
            }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Chat API error: {e}")
        return Response(
            {'error': 'Internal server error'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
