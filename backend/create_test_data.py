#!/usr/bin/env python3
"""
Создание тестовых данных для демонстрации skill-check механики
"""

import os
import sys
import django

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nexus_backend.settings')
django.setup()

from core.models import Character, Dialogue, SkillCheck, GameProject

def create_test_data():
    print("Creating test data...")
    
    # Создаем игровой проект
    project, created = GameProject.objects.get_or_create(
        name="Disco Elysium Demo",
        defaults={
            'description': 'Демонстрация механики skill-check в стиле Disco Elysium'
        }
    )
    print(f"Project: {project.name} ({'created' if created else 'exists'})")
    
    # Создаем персонажа-детектива
    detective, created = Character.objects.get_or_create(
        name="Detective Harry Du Bois",
        defaults={
            'logic': 4,
            'encyclopedia': 3,
            'rhetoric': 5,
            'drama': 2,
            'conceptualization': 6,
            'visual_calculus': 3,
            'volition': 4,
            'inland_empire': 7,
            'empathy': 5,
            'authority': 3,
            'suggestion': 4,
            'espirit_de_corps': 2,
            'endurance': 3,
            'pain_threshold': 4,
            'physical_instrument': 2,
            'electrochemistry': 6,
            'shivers': 5,
            'half_light': 3,
            'hand_eye_coordination': 2,
            'perception': 4,
            'reaction_speed': 3,
            'savoir_faire': 4,
            'interfacing': 3,
            'composure': 5,
        }
    )
    print(f"Character: {detective.name} ({'created' if created else 'exists'})")
    
    # Создаем диалог
    dialogue, created = Dialogue.objects.get_or_create(
        title="Interrogation of the Suspect",
        defaults={
            'project': project
        }
    )
    dialogue.characters.add(detective)
    print(f"Dialogue: {dialogue.title} ({'created' if created else 'exists'})")
    
    # Создаем skill checks
    skill_checks_data = [
        {
            'skill': 'logic',
            'difficulty': 'medium',
            'description': 'Проанализировать логические несоответствия в показаниях',
            'success_text': 'Вы замечаете противоречие в его рассказе. Время смерти не совпадает с его алиби.',
            'failure_text': 'Его история звучит правдоподобно. Возможно, он действительно невиновен?',
            'critical_success_text': 'Блестящий анализ! Вы раскрыли ложь и теперь у вас есть неопровержимые улики.',
            'critical_failure_text': 'Вы полностью запутались в деталях. Подозреваемый выглядит более убедительно, чем вы.'
        },
        {
            'skill': 'empathy',
            'difficulty': 'easy',
            'description': 'Почувствовать эмоциональное состояние подозреваемого',
            'success_text': 'Вы чувствуете, что он испытывает страх, но не вину. Возможно, он что-то скрывает, но не убийство.',
            'failure_text': 'Его эмоции непроницаемы. Вы не можете понять, лжет он или говорит правду.',
            'critical_success_text': 'Вы проникаете в его душу. Он боится не наказания, а кого-то другого...',
            'critical_failure_text': 'Вы полностью неправильно интерпретируете его эмоции. Он кажется вам злобным убийцей.'
        },
        {
            'skill': 'authority',
            'difficulty': 'hard',
            'description': 'Запугать подозреваемого своим авторитетом',
            'success_text': 'Ваш авторитет заставляет его дрожать. Он начинает говорить больше.',
            'failure_text': 'Он не впечатлен вашим авторитетом. Возможно, он знает что-то о вас.',
            'critical_success_text': 'Ваше присутствие подавляет его. Он готов признаться во всем.',
            'critical_failure_text': 'Вы выглядите жалко. Он смеется над вашими попытками запугать его.'
        },
        {
            'skill': 'inland_empire',
            'difficulty': 'extreme',
            'description': 'Интуитивно почувствовать скрытую истину',
            'success_text': 'Ваша интуиция подсказывает: здесь замешана любовь, а не ненависть.',
            'failure_text': 'Интуиция молчит. Вы не чувствуете ничего особенного.',
            'critical_success_text': 'Внезапное озарение! Вы видите всю картину целиком - это было самоубийство, замаскированное под убийство!',
            'critical_failure_text': 'Ваша интуиция сбивает вас с толку. Вы начинаете сомневаться в собственной вменяемости.'
        }
    ]
    
    for sc_data in skill_checks_data:
        skill_check, created = SkillCheck.objects.get_or_create(
            dialogue=dialogue,
            skill=sc_data['skill'],
            defaults=sc_data
        )
        print(f"Skill Check: {skill_check.skill} ({'created' if created else 'exists'})")
    
    print("\nTest data created successfully!")
    print(f"Project: {project.name}")
    print(f"Character: {detective.name}")
    print(f"Dialogue: {dialogue.title}")
    print(f"Skill Checks: {SkillCheck.objects.filter(dialogue=dialogue).count()}")

if __name__ == "__main__":
    create_test_data()
