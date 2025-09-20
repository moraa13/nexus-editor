#!/usr/bin/env python3
"""
Тест с API ключом
"""
import requests

# Ваш API ключ
API_KEY = "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"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "HTTP-Referer": "http://localhost:5181",
    "Content-Type": "application/json"
}

data = {
    "model": "openai/gpt-3.5-turbo",
    "messages": [
        {"role": "system", "content": "Ты профессиональный сценарист мрачной интерактивной новеллы. Твоя задача — продумать основную сюжетную линию, конфликты, темы, и моральные дилеммы в духе Disco Elysium. Говори на русском языке."},
        {"role": "user", "content": "Привет! Помоги создать персонажа для детективной истории"}
    ]
}

print("🚀 Отправляем запрос к OpenRouter...")
print(f"🔑 Используем ключ: {API_KEY[:20]}...")

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
