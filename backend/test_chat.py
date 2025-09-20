#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append('/home/kuoma/projects/nexus/backend')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nexus_backend.settings')
django.setup()

from core.quest_generator import quest_generator

# Тестируем генерацию ответа
context = {
    'user_message': 'персонажа зовут аслан он идет в авиапарк за своей добычей - кроссовками на осень',
    'genre': 'noir',
    'tone': 'dark-noir',
    'project_name': 'Тестовый проект',
    'setting': 'Современный город'
}

print('=== Тест генерации ответа ===')
print(f'API Key: {"SET" if quest_generator.api_key else "NOT SET"}')
print(f'Base URL: {quest_generator.base_url}')
print(f'Model: {quest_generator.model}')
print()

response = quest_generator.generate_chat_response(context)
print('Ответ:', response)
