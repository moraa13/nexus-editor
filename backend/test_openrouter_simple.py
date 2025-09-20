#!/usr/bin/env python3
"""
Простой тест OpenRouter API
"""
import requests

# Замените "твой_ключ" на ваш реальный API ключ OpenRouter
API_KEY = "твой_ключ"  # ВАЖНО: замените на реальный ключ!

headers = {
    "Authorization": f"Bearer {API_KEY}",
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
print(f"🔑 Используем ключ: {API_KEY[:10]}...")

try:
    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
    print(f"📊 Статус ответа: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Успешный ответ!")
        print(f"📝 Ответ ИИ: {result['choices'][0]['message']['content']}")
    else:
        print(f"❌ Ошибка API: {response.status_code}")
        print(f"📄 Текст ответа: {response.text}")
        
except Exception as e:
    print(f"❌ Ошибка запроса: {e}")
