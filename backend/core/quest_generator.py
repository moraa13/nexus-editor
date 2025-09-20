import os
import json
import random
from typing import Dict, List, Optional, Any
from django.conf import settings
import requests


class QuestGenerator:
    """AI Quest Generation Service for Django Backend"""
    
    def __init__(self):
        self.api_key = getattr(settings, 'OPENROUTER_API_KEY', None)
        self.base_url = getattr(settings, 'OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1')
        self.model = getattr(settings, 'OPENROUTER_MODEL', 'anthropic/claude-3.5-sonnet')
    
    def generate_quest_step(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a single quest step using AI or fallback"""
        if not self.api_key:
            return self._get_fallback_step(context.get('current_step', 0))
        
        try:
            prompt = self._build_prompt(context)
            response = self._call_openai(prompt)
            return self._parse_response(response, context.get('current_step', 0))
        except Exception as e:
            print(f"AI generation failed: {e}")
            return self._get_fallback_step(context.get('current_step', 0))
    
    def generate_full_quest(self, context: Dict[str, Any], step_count: int = 5) -> List[Dict[str, Any]]:
        """Generate a full quest with multiple steps"""
        steps = []
        current_context = context.copy()
        
        for i in range(step_count):
            current_context['current_step'] = i
            step = self.generate_quest_step(current_context)
            steps.append(step)
            
            # Update context for next step
            if 'previous_choices' not in current_context:
                current_context['previous_choices'] = []
            current_context['previous_choices'].append(f"Step {i}: {step.get('title', '')}")
        
        return steps
    
    def generate_chat_response(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate AI chat response"""
        user_message = context.get('user_message', '')
        
        # Добавляем отладочную информацию
        print(f"🔍 OpenRouter API Key: {'✅ Установлен' if self.api_key else '❌ Не установлен'}")
        print(f"🔍 Base URL: {self.base_url}")
        print(f"🔍 Model: {self.model}")
        
        if not self.api_key:
            print("⚠️ API ключ не установлен, используем fallback")
            return self._get_fallback_chat_response(user_message)
        
        try:
            prompt = self._build_chat_prompt(context)
            print(f"🔍 Отправляем запрос к OpenRouter...")
            response = self._call_chat_api(prompt)
            print(f"✅ Ответ получен от OpenRouter")
            return self._parse_chat_response(response)
        except Exception as e:
            print(f"❌ Chat AI generation failed: {e}")
            return self._get_fallback_chat_response(user_message)
    
    def _build_chat_prompt(self, context: Dict[str, Any]) -> str:
        """Build AI chat prompt from context"""
        user_message = context.get('user_message', '')
        genre = context.get('genre', 'noir')
        tone = context.get('tone', 'dark-noir')
        project_name = context.get('project_name', '')
        setting = context.get('setting', '')
        
        # Определяем стиль ответа на основе тональности
        style_prompts = {
            'dark-noir': 'Отвечай в стиле темного нуара: мрачно, иронично, с философскими размышлениями о природе человека.',
            'philosophical': 'Отвечай как философ-нарратор: глубоко, размышляя о смысле и сути вещей.',
            'satirical': 'Отвечай с сарказмом и остроумием: критично, но конструктивно.',
            'melancholic': 'Отвечай меланхолично: грустно, но красиво, с ностальгией.',
            'energetic': 'Отвечай энергично: динамично, с энтузиазмом и драйвом.'
        }
        
        style_instruction = style_prompts.get(tone, style_prompts['dark-noir'])
        
        prompt = f"""Ты - нарративный архитектор, создающий миры для интерактивных новелл в стиле Disco Elysium.

КОНТЕКСТ ПРОЕКТА:
- Название: {project_name}
- Жанр: {genre}
- Сеттинг: {setting}
- Тональность: {tone}

СТИЛЬ ОТВЕТА:
{style_instruction}

ТВОЯ РОЛЬ:
Ты не просто помощник - ты соавтор, который:
- Вдохновляет и направляет творческий процесс
- Задает провокационные вопросы
- Предлагает неожиданные повороты сюжета
- Помогает создать глубоких персонажей
- Развивает мир через детали и атмосферу

СООБЩЕНИЕ ПОЛЬЗОВАТЕЛЯ: "{user_message}"

ОТВЕТЬ:
1. Понял ли ты намерения пользователя?
2. Какие идеи/вопросы у тебя есть?
3. Что можно развить дальше?
4. Какие конкретные шаги предложить?

Будь живым, интересным собеседником. Не просто отвечай - веди диалог."""
        
        return prompt
    
    def _parse_chat_response(self, response: str) -> Dict[str, Any]:
        """Parse AI chat response"""
        return {
            'message': response.strip()
        }
    
    def _get_fallback_chat_response(self, user_message: str) -> Dict[str, Any]:
        """Get fallback chat response when AI is unavailable"""
        fallback_responses = [
            f'*Задумчиво почесывает виртуальную бороду*\n\nИнтересно... "{user_message}" - это звучит как начало чего-то большего. В мире, где каждый выбор имеет последствия, такие идеи могут стать основой для целой философии персонажа.\n\nЧто если мы разовьем это дальше? Какие эмоции это должно вызывать у игрока?',
            f'*Прищуривается с ироничной улыбкой*\n\nАх, "{user_message}"... Классика. Но знаешь что? В Disco Elysium даже самые банальные вещи могут стать источником глубоких размышлений.\n\nДавай подумаем: как это может отразиться на внутреннем мире персонажа? Какие внутренние голоса могут комментировать эту ситуацию?',
            f'*Наклоняется вперед с заинтересованным видом*\n\n"{user_message}" - отличная отправная точка! Но помни: мы создаем не просто историю, а целую вселенную чувств и мыслей.\n\nКакие моральные дилеммы здесь могут возникнуть? Как это повлияет на отношения персонажа с миром?',
            f'*Задумчиво смотрит вдаль*\n\nХм... "{user_message}". В мире, где реальность и восприятие переплетаются, такие концепции могут стать основой для целой системы убеждений персонажа.\n\nА что если мы добавим сюда немного экзистенциального ужаса? Или, наоборот, надежды?'
        ]
        
        import random
        return {
            'message': random.choice(fallback_responses)
        }
    
    def _build_prompt(self, context: Dict[str, Any]) -> str:
        """Build AI prompt from context"""
        character = context.get('character', {})
        character_name = character.get('name', 'Герой')
        
        # Build character stats string
        stats = character.get('stats', {})
        stats_str = ', '.join([f"{stat.get('name', key)}: {stat.get('value', 0)}" 
                              for key, stat in stats.items()])
        
        # Build character skills string (first 6)
        skills = character.get('skills', {})
        skills_str = ', '.join([f"{skill.get('name', key)}: {skill.get('value', 0)}" 
                               for key, skill in list(skills.items())[:6]])
        
        quest_theme = context.get('quest_theme', 'Детективное расследование в стиле Disco Elysium')
        difficulty = context.get('difficulty', 'medium')
        current_step = context.get('current_step', 0)
        previous_choices = context.get('previous_choices', [])
        
        return f"""
Создай шаг квеста в стиле Disco Elysium для персонажа "{character_name}".

Характеристики персонажа: {stats_str}
Навыки: {skills_str}
Тема квеста: {quest_theme}
Сложность: {difficulty}
Шаг: {current_step + 1}

Предыдущие выборы: {', '.join(previous_choices)}

Создай один шаг квеста в формате JSON:
{{
  "title": "Название шага",
  "description": "Подробное описание ситуации в стиле Disco Elysium",
  "choices": [
    {{
      "text": "Вариант выбора",
      "result": "Результат выбора",
      "statModifier": {{"stat": "название_стата", "value": число}}
    }}
  ]
}}

Варианты статов: logic, empathy, volition, endurance, perception, composure
Значения модификаторов: от -2 до +2
Создай 3-4 варианта выбора с разными требованиями к характеристикам.
        """.strip()
    
    def _call_openai(self, prompt: str) -> str:
        """Call OpenRouter API"""
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}',
        }
        
        data = {
            'model': self.model,
            'messages': [
                {
                    'role': 'system',
                    'content': 'Ты создаешь квесты в стиле Disco Elysium. Отвечай только валидным JSON.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'max_tokens': 1000,
            'temperature': 0.8,
        }
        
        print(f"🔍 Отправляем запрос к: {self.base_url}/chat/completions")
        print(f"🔍 Модель: {self.model}")
        print(f"🔍 Промпт: {prompt[:100]}...")
        
        response = requests.post(f"{self.base_url}/chat/completions", headers=headers, json=data, timeout=30)
        
        print(f"🔍 Статус ответа: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            print(f"✅ Получен ответ: {content[:100]}...")
            return content
        else:
            error_msg = f"API request failed: {response.status_code} - {response.text}"
            print(f"❌ {error_msg}")
            raise Exception(error_msg)
    
    def _call_chat_api(self, prompt: str) -> str:
        """Call OpenRouter API for chat responses"""
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}',
        }
        
        data = {
            'model': self.model,
            'messages': [
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'max_tokens': 1000,
            'temperature': 0.7,
        }
        
        print(f"🔍 Отправляем чат-запрос к: {self.base_url}/chat/completions")
        print(f"🔍 Модель: {self.model}")
        print(f"🔍 Промпт: {prompt[:100]}...")
        
        response = requests.post(f"{self.base_url}/chat/completions", headers=headers, json=data, timeout=30)
        
        print(f"🔍 Статус ответа: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            print(f"✅ Получен чат-ответ: {content[:100]}...")
            return content
        else:
            error_msg = f"Chat API request failed: {response.status_code} - {response.text}"
            print(f"❌ {error_msg}")
            raise Exception(error_msg)
    
    def _parse_response(self, response: str, step_index: int) -> Dict[str, Any]:
        """Parse AI response into quest step"""
        try:
            parsed = json.loads(response)
            return {
                'id': f'ai_step_{step_index}',
                'title': parsed.get('title', f'Шаг {step_index + 1}'),
                'description': parsed.get('description', 'Описание шага'),
                'choices': [
                    {
                        'id': f'choice_{step_index}_{i}',
                        'text': choice.get('text', 'Выбор'),
                        'result': choice.get('result', 'Результат'),
                        'statModifier': choice.get('statModifier')
                    }
                    for i, choice in enumerate(parsed.get('choices', []))
                ],
            }
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Failed to parse AI response: {e}")
            return self._get_fallback_step(step_index)
    
    def _get_fallback_step(self, step_index: int) -> Dict[str, Any]:
        """Get fallback quest step when AI is unavailable"""
        fallback_steps = [
            {
                'id': 'fallback_start',
                'title': 'Начало приключения',
                'description': 'Вы просыпаетесь в темной комнате. Голова болит, и вы не помните, как сюда попали. В углу комнаты стоит загадочная фигура.',
                'choices': [
                    {
                        'id': 'approach',
                        'text': 'Подойти к фигуре',
                        'result': 'Вы решаете подойти ближе...',
                        'statModifier': {'stat': 'logic', 'value': 1}
                    },
                    {
                        'id': 'observe',
                        'text': 'Внимательно осмотреться',
                        'result': 'Вы начинаете изучать комнату...',
                        'statModifier': {'stat': 'perception', 'value': 1}
                    },
                    {
                        'id': 'shout',
                        'text': 'Крикнуть: "Кто здесь?!"',
                        'result': 'Ваш голос эхом отдается по комнате...',
                        'statModifier': {'stat': 'volition', 'value': 1}
                    }
                ]
            },
            {
                'id': 'fallback_second',
                'title': 'Встреча с незнакомцем',
                'description': 'Фигура поворачивается к вам. Это человек в длинном плаще, лицо скрыто в тени. Он протягивает руку с каким-то предметом.',
                'choices': [
                    {
                        'id': 'take_item',
                        'text': 'Взять предмет',
                        'result': 'Вы берете предмет...',
                        'statModifier': {'stat': 'endurance', 'value': 1}
                    },
                    {
                        'id': 'ask_questions',
                        'text': 'Задать вопросы',
                        'result': 'Вы начинаете расспрашивать...',
                        'statModifier': {'stat': 'empathy', 'value': 1}
                    },
                    {
                        'id': 'refuse',
                        'text': 'Отказаться',
                        'result': 'Вы отказываетесь...',
                        'statModifier': {'stat': 'composure', 'value': 1}
                    }
                ]
            },
            {
                'id': 'fallback_third',
                'title': 'Откровение',
                'description': 'Незнакомец объясняет: "Ты в мире, где твои мысли становятся реальностью. Твои характеристики определяют, как ты воспринимаешь этот мир."',
                'choices': [
                    {
                        'id': 'accept',
                        'text': 'Принять это как данность',
                        'result': 'Вы понимаете, что это новый мир возможностей.',
                        'statModifier': {'stat': 'logic', 'value': 2}
                    },
                    {
                        'id': 'question',
                        'text': 'Задать больше вопросов',
                        'result': 'Вы начинаете расспрашивать о деталях...',
                        'statModifier': {'stat': 'empathy', 'value': 1}
                    },
                    {
                        'id': 'resist',
                        'text': 'Сопротивляться этому',
                        'result': 'Вы пытаетесь найти логическое объяснение...',
                        'statModifier': {'stat': 'volition', 'value': 2}
                    }
                ]
            }
        ]
        
        return fallback_steps[step_index % len(fallback_steps)]


# Global instance
quest_generator = QuestGenerator()
