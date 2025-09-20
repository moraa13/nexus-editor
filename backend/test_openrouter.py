#!/usr/bin/env python3
"""
Тест подключения к OpenRouter API
"""
import os
import sys
import django
from pathlib import Path

# Добавляем путь к Django проекту
sys.path.append(str(Path(__file__).parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nexus_backend.settings')
django.setup()

from django.conf import settings
from core.quest_generator import QuestGenerator

def test_openrouter_connection():
    """Тестируем подключение к OpenRouter"""
    print("🔍 Тестируем подключение к OpenRouter...")
    
    # Проверяем настройки
    print(f"API Key: {'✅ Установлен' if settings.OPENROUTER_API_KEY else '❌ Не установлен'}")
    print(f"Base URL: {settings.OPENROUTER_BASE_URL}")
    print(f"Model: {settings.OPENROUTER_MODEL}")
    
    if not settings.OPENROUTER_API_KEY:
        print("❌ OPENROUTER_API_KEY не установлен в .env файле")
        return False
    
    # Создаем генератор
    generator = QuestGenerator()
    
    # Тестовый контекст
    test_context = {
        'user_message': 'Привет! Я хочу создать детективную историю в стиле нуар.',
        'project_name': 'Тестовый проект',
        'genre': 'noir',
        'tone': 'dark-noir',
        'setting': 'Неоновые улицы будущего'
    }
    
    print("\n🤖 Отправляем тестовое сообщение...")
    try:
        response = generator.generate_chat_response(test_context)
        print("✅ Ответ получен!")
        print(f"Сообщение: {response.get('message', 'Нет сообщения')}")
        return True
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return False

if __name__ == "__main__":
    success = test_openrouter_connection()
    if success:
        print("\n🎉 OpenRouter подключен успешно!")
    else:
        print("\n💥 Проблема с подключением к OpenRouter")
