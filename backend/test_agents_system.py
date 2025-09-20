#!/usr/bin/env python3
"""
Тест системы агентов
"""
import os
import sys
import django
from pathlib import Path

# Добавляем путь к Django проекту
sys.path.append(str(Path(__file__).parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nexus_backend.settings')
django.setup()

from core.ai_agents import agent_manager, AgentType

def test_agents_system():
    """Тестируем систему агентов"""
    print("🤖 Тестируем систему агентов...")
    
    # Тестовые сообщения для разных агентов
    test_messages = [
        "Привет! Помоги создать персонажа для детективной истории",
        "Нужно придумать сюжетную линию для нуар-игры",
        "Как создать интересный квест с моральными дилеммами?",
        "Опиши атмосферу мрачного города",
        "Какие механики нужны для системы навыков?"
    ]
    
    context = {
        'genre': 'noir',
        'setting': 'Современный город',
        'tone': 'dark-noir',
        'project_name': 'Тестовый проект'
    }
    
    for i, message in enumerate(test_messages, 1):
        print(f"\n📝 Тест {i}: {message}")
        
        try:
            response = agent_manager.get_response(message, context)
            
            print(f"🎭 Выбранный агент: {response['selected_agent']}")
            print(f"✅ Успех: {response['success']}")
            print(f"🤖 Модель: {response['model']}")
            print(f"💬 Ответ: {response['message'][:100]}...")
            
        except Exception as e:
            print(f"❌ Ошибка: {e}")
    
    print("\n🔍 Проверяем доступность API ключа...")
    from django.conf import settings
    api_key = getattr(settings, 'OPENROUTER_API_KEY', None)
    
    if api_key:
        print(f"✅ API ключ установлен: {api_key[:10]}...")
    else:
        print("❌ API ключ не установлен - используется fallback режим")
        print("💡 Для работы с реальным ИИ установите OPENROUTER_API_KEY")

if __name__ == "__main__":
    test_agents_system()
