#!/usr/bin/env python3
"""
Простой тест OpenRouter API
"""
import os
import requests

# API ключ из README
API_KEY = "sk-or-v1-a3f448f216885f8beb62cb510f0708300b2591205644d20996b57bb23b03781"
BASE_URL = "https://openrouter.ai/api/v1"
MODEL = "anthropic/claude-3.5-sonnet"

def test_openrouter():
    """Тестируем OpenRouter API напрямую"""
    print("🔍 Тестируем OpenRouter API...")
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json',
    }
    
    data = {
        'model': MODEL,
        'messages': [
            {
                'role': 'user',
                'content': 'Привет! Это тест подключения к OpenRouter. Ответь коротко.'
            }
        ],
        'max_tokens': 100,
        'temperature': 0.7,
    }
    
    try:
        print(f"🔍 Отправляем запрос к: {BASE_URL}/chat/completions")
        print(f"🔍 Модель: {MODEL}")
        
        response = requests.post(f"{BASE_URL}/chat/completions", headers=headers, json=data, timeout=30)
        
        print(f"🔍 Статус ответа: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            print(f"✅ Успех! Ответ: {content}")
            return True
        else:
            print(f"❌ Ошибка: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return False

if __name__ == "__main__":
    success = test_openrouter()
    if success:
        print("\n🎉 OpenRouter API работает!")
    else:
        print("\n💥 Проблема с OpenRouter API")
