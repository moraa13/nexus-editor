from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Аутентификация пользователя"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
        })
    else:
        return Response(
            {'error': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Регистрация нового пользователя"""
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    password_confirm = request.data.get('password_confirm')
    
    # Валидация
    if not all([username, email, password, password_confirm]):
        return Response(
            {'error': 'All fields are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if password != password_confirm:
        return Response(
            {'error': 'Passwords do not match'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(password) < 8:
        return Response(
            {'error': 'Password must be at least 8 characters long'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Email already exists'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        token = Token.objects.create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response(
            {'error': f'Registration failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def logout(request):
    """Выход пользователя"""
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out'})
    except:
        return Response(
            {'error': 'Logout failed'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def user_profile(request):
    """Получение профиля пользователя"""
    return Response({
        'user_id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
        'is_staff': request.user.is_staff,
        'date_joined': request.user.date_joined,
    })
