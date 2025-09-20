#!/usr/bin/env python3
"""
Прямой тест OpenRouter API
"""
import requests
import os

def test_openrouter_api():
    """Тестируем OpenRouter API напрямую"""
    
    # Получаем API ключ из переменных окружения
    api_key = os.getenv('OPENROUTER_API_KEY')
    
    if not api_key:
        print("❌ OPENROUTER_API_KEY не установлен в переменных окружения")
        print("Установите ключ: export OPENROUTER_API_KEY='your-key-here'")
        return False
    
    print(f"✅ API ключ найден: {api_key[:10]}...")
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "http://localhost:5181",
        "Content-Type": "application/json"
    }

    data = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Привет, расскажи что ты умеешь"}
        ]
    }

    print("🚀 Отправляем запрос к OpenRouter...")
    
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions", 
            headers=headers, 
            json=data,
            timeout=30
        )
        
        print(f"📊 Статус ответа: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Успешный ответ!")
            print(f"📝 Ответ ИИ: {result['choices'][0]['message']['content']}")
            return True
        else:
            print(f"❌ Ошибка API: {response.status_code}")
            print(f"📄 Текст ответа: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка запроса: {e}")
        return False

if __name__ == "__main__":
    success = test_openrouter_api()
    if success:
        print("\n🎉 OpenRouter API работает!")
    else:
        print("\n💥 Проблема с OpenRouter API")
