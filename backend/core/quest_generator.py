import os
import json
import random
from typing import Dict, List, Optional, Any
from django.conf import settings
import requests


class QuestGenerator:
    """AI Quest Generation Service for Django Backend"""
    
    def __init__(self):
        self.api_key = getattr(settings, 'OPENAI_API_KEY', None)
        self.base_url = 'https://api.openai.com/v1/chat/completions'
    
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
        """Call OpenAI API"""
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}',
        }
        
        data = {
            'model': 'gpt-3.5-turbo',
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
        
        response = requests.post(self.base_url, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        return result['choices'][0]['message']['content']
    
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
