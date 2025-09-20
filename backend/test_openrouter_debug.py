#!/usr/bin/env python3
"""
Тест OpenRouter API для отладки
"""
import os
import sys
import django
import requests

# Настройка Django
sys.path.append('/home/kuoma/projects/nexus/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nexus_backend.settings')
django.setup()

from django.conf import settings

def test_openrouter():
    """Тест OpenRouter API"""
    print("=== Тест OpenRouter API ===")
    
    # Проверяем настройки
    print(f"OPENROUTER_API_KEY present: {hasattr(settings, 'OPENROUTER_API_KEY')}")
    if hasattr(settings, 'OPENROUTER_API_KEY'):
        print(f"API Key length: {len(settings.OPENROUTER_API_KEY)}")
        print(f"API Key starts with: {settings.OPENROUTER_API_KEY[:10]}...")
    
    print(f"OPENROUTER_BASE_URL: {getattr(settings, 'OPENROUTER_BASE_URL', 'Not set')}")
    print(f"OPENROUTER_MODEL: {getattr(settings, 'OPENROUTER_MODEL', 'Not set')}")
    
    # Тестируем API
    headers = {
        'Authorization': f'Bearer {settings.OPENROUTER_API_KEY}',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:8000',
        'X-Title': 'Nexus Game Creator'
    }
    
    data = {
        'model': settings.OPENROUTER_MODEL,
        'messages': [
            {"role": "system", "content": "Ты помощник."},
            {"role": "user", "content": "Привет!"}
        ],
        'temperature': 0.7,
        'max_tokens': 100
    }
    
    print(f"\nОтправляем запрос к: {settings.OPENROUTER_BASE_URL}/chat/completions")
    print(f"Модель: {settings.OPENROUTER_MODEL}")
    
    try:
        response = requests.post(
            f"{settings.OPENROUTER_BASE_URL}/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Успешно!")
            print(f"Ответ: {result['choices'][0]['message']['content']}")
        else:
            print("❌ Ошибка!")
            print(f"Response Text: {response.text}")
            
    except Exception as e:
        print(f"❌ Исключение: {e}")

if __name__ == "__main__":
    test_openrouter()
