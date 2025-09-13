#!/usr/bin/env python
"""
Скрипт для создания тестовых данных для проверки системы экспорта
"""
import os
import sys
import django

# Настройка Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nexus_backend.settings')
django.setup()

from core.models import (
    GameProject, Character, Dialogue, Post, SkillCheck, 
    DialogueOption, Quest, DialogueLog, ExportTemplate
)


def create_test_project():
    """Создает тестовый проект с полным набором данных"""
    
    print("🎮 Создание тестового проекта для экспорта...")
    
    # Создаем основной проект
    project = GameProject.objects.create(
        name="Torange Plaza Demo",
        description="Демонстрационный проект для тестирования системы экспорта"
    )
    
    # Создаем персонажей
    characters = [
        {
            "name": "Detective Harry",
            "logic": 8,
            "empathy": 6,
            "authority": 7,
            "endurance": 5,
            "rhetoric": 9,
            "drama": 4,
            "conceptualization": 7,
            "visual_calculus": 6,
            "volition": 8,
            "inland_empire": 9,
            "suggestion": 5,
            "espirit_de_corps": 6,
            "pain_threshold": 4,
            "physical_instrument": 3,
            "electrochemistry": 7,
            "shivers": 8,
            "half_light": 5,
            "hand_eye_coordination": 6,
            "perception": 7,
            "reaction_speed": 5,
            "savoir_faire": 4,
            "interfacing": 3,
            "composure": 6,
        },
        {
            "name": "Kim Kitsuragi",
            "logic": 9,
            "empathy": 8,
            "authority": 6,
            "endurance": 7,
            "rhetoric": 7,
            "drama": 5,
            "conceptualization": 8,
            "visual_calculus": 9,
            "volition": 9,
            "inland_empire": 4,
            "suggestion": 6,
            "espirit_de_corps": 8,
            "pain_threshold": 6,
            "physical_instrument": 7,
            "electrochemistry": 3,
            "shivers": 5,
            "half_light": 4,
            "hand_eye_coordination": 8,
            "perception": 9,
            "reaction_speed": 7,
            "savoir_faire": 8,
            "interfacing": 7,
            "composure": 9,
        },
        {
            "name": "Joyce Messier",
            "logic": 6,
            "empathy": 9,
            "authority": 4,
            "endurance": 5,
            "rhetoric": 8,
            "drama": 7,
            "conceptualization": 6,
            "visual_calculus": 5,
            "volition": 7,
            "inland_empire": 8,
            "suggestion": 9,
            "espirit_de_corps": 5,
            "pain_threshold": 3,
            "physical_instrument": 2,
            "electrochemistry": 6,
            "shivers": 7,
            "half_light": 6,
            "hand_eye_coordination": 4,
            "perception": 6,
            "reaction_speed": 4,
            "savoir_faire": 7,
            "interfacing": 5,
            "composure": 8,
        }
    ]
    
    created_characters = []
    for char_data in characters:
        character = Character.objects.create(**char_data)
        created_characters.append(character)
        print(f"  ✅ Создан персонаж: {character.name}")
    
    # Создаем диалоги
    dialogues_data = [
        {
            "title": "Первая встреча с Кимом",
            "posts": [
                {"speaker": "Kim Kitsuragi", "text": "Добро пожаловать в Ревашоль, детектив. Я лейтенант Ким Кицураги.", "order": 1},
                {"speaker": "Detective Harry", "text": "Привет... Я... кто я?", "order": 2},
                {"speaker": "Kim Kitsuragi", "text": "Вы детектив полиции. Мы работаем над делом об убийстве.", "order": 3},
                {"speaker": "Detective Harry", "text": "Убийство? Я не помню...", "order": 4},
            ],
            "skill_checks": [
                {
                    "skill": "empathy",
                    "difficulty": "medium",
                    "description": "Попытаться понять эмоции Кима",
                    "success_text": "Вы чувствуете, что Ким искренне хочет помочь",
                    "failure_text": "Ким кажется отстраненным и холодным"
                },
                {
                    "skill": "logic",
                    "difficulty": "hard",
                    "description": "Восстановить воспоминания о деле",
                    "success_text": "Воспоминания начинают возвращаться",
                    "failure_text": "Голова болит, ничего не вспоминается"
                }
            ]
        },
        {
            "title": "Разговор с Джойс",
            "posts": [
                {"speaker": "Joyce Messier", "text": "О, детектив! Как дела с расследованием?", "order": 1},
                {"speaker": "Detective Harry", "text": "Джойс... ты знаешь, что происходит?", "order": 2},
                {"speaker": "Joyce Messier", "text": "Конечно! Все говорят об этом деле. Это же сенсация!", "order": 3},
                {"speaker": "Detective Harry", "text": "А что именно говорят?", "order": 4},
            ],
            "skill_checks": [
                {
                    "skill": "rhetoric",
                    "difficulty": "easy",
                    "description": "Убедить Джойс рассказать больше",
                    "success_text": "Джойс с радостью делится слухами",
                    "failure_text": "Джойс не хочет говорить на эту тему"
                }
            ]
        }
    ]
    
    created_dialogues = []
    for dialogue_data in dialogues_data:
        dialogue = Dialogue.objects.create(
            title=dialogue_data["title"],
            project=project
        )
        dialogue.characters.add(*created_characters)
        
        # Создаем посты диалога
        for post_data in dialogue_data["posts"]:
            Post.objects.create(
                dialogue=dialogue,
                speaker=post_data["speaker"],
                text=post_data["text"],
                order=post_data["order"]
            )
        
        # Создаем skill checks
        for skill_data in dialogue_data["skill_checks"]:
            skill_check = SkillCheck.objects.create(
                dialogue=dialogue,
                skill=skill_data["skill"],
                difficulty=skill_data["difficulty"],
                description=skill_data["description"],
                success_text=skill_data["success_text"],
                failure_text=skill_data["failure_text"]
            )
            
            # Создаем опции диалога для skill checks
            DialogueOption.objects.create(
                dialogue=dialogue,
                text=f"Попробовать {skill_data['description'].lower()}",
                skill_check=skill_check,
                order=len(dialogue_data["skill_checks"])
            )
        
        created_dialogues.append(dialogue)
        print(f"  ✅ Создан диалог: {dialogue.title}")
    
    # Создаем квесты
    quests_data = [
        {
            "title": "Расследование убийства",
            "description": "Найти убийцу и восстановить справедливость",
            "quest_type": "dialogue",
            "difficulty_level": 5,
            "dialogue": created_dialogues[0]
        },
        {
            "title": "Собрать информацию",
            "description": "Узнать больше о жертве и подозреваемых",
            "quest_type": "social",
            "difficulty_level": 3,
            "dialogue": created_dialogues[1]
        }
    ]
    
    created_quests = []
    for quest_data in quests_data:
        quest = Quest.objects.create(
            title=quest_data["title"],
            description=quest_data["description"],
            quest_type=quest_data["quest_type"],
            difficulty_level=quest_data["difficulty_level"],
            project=project,
            dialogue=quest_data["dialogue"],
            assigned_character=created_characters[0]
        )
        created_quests.append(quest)
        print(f"  ✅ Создан квест: {quest.title}")
    
    # Создаем логи диалогов
    logs_data = [
        {
            "quest": created_quests[0],
            "character": created_characters[0],
            "log_type": "dialogue",
            "author": "Detective Harry",
            "content": "Начал расследование убийства",
            "result": "success"
        },
        {
            "quest": created_quests[0],
            "character": created_characters[1],
            "log_type": "dice_roll",
            "author": "Kim Kitsuragi",
            "content": "Бросок на логику: 15 + 9 = 24 (успех)",
            "result": "success",
            "metadata": {"dice_roll": 15, "skill_value": 9, "total": 24}
        },
        {
            "quest": created_quests[1],
            "character": created_characters[2],
            "log_type": "dialogue",
            "author": "Joyce Messier",
            "content": "Поделилась слухами о деле",
            "result": "success"
        }
    ]
    
    for log_data in logs_data:
        DialogueLog.objects.create(**log_data)
    
    print(f"  ✅ Создано {len(logs_data)} записей в логе диалогов")
    
    # Создаем шаблоны экспорта
    export_templates = [
        {
            "name": "Unity Game Data",
            "description": "Шаблон для экспорта в Unity ScriptableObject",
            "format_type": "unity",
            "template_content": """using UnityEngine;

[CreateAssetMenu(fileName = "{{ project.name }}", menuName = "Game Data/{{ project.name }}")]
public class {{ project.name|replace(' ', '') }}Data : ScriptableObject
{
    [Header("Project Info")]
    public string projectName = "{{ project.name }}";
    public string description = "{{ project.description }}";
    
    [Header("Characters")]
    public CharacterData[] characters;
    
    [Header("Dialogues")]
    public DialogueData[] dialogues;
}""",
            "is_default": True
        },
        {
            "name": "Unreal Engine Data Table",
            "description": "Шаблон для экспорта в Unreal Engine",
            "format_type": "unreal",
            "template_content": """# Unreal Engine Data Table for {{ project.name }}

# Characters Data Table
--- Characters ---
CharacterID,CharacterName,Logic,Empathy,Authority,Endurance
{% for character in characters %}
{{ character.id }},{{ character.name }},{{ character.skills.logic }},{{ character.skills.empathy }},{{ character.skills.authority }},{{ character.skills.endurance }}
{% endfor %}""",
            "is_default": False
        }
    ]
    
    for template_data in export_templates:
        ExportTemplate.objects.create(**template_data)
        print(f"  ✅ Создан шаблон экспорта: {template_data['name']}")
    
    print(f"\n🎉 Тестовый проект '{project.name}' успешно создан!")
    print(f"📊 Статистика:")
    print(f"  - Персонажи: {len(created_characters)}")
    print(f"  - Диалоги: {len(created_dialogues)}")
    print(f"  - Квесты: {len(created_quests)}")
    print(f"  - Шаблоны экспорта: {len(export_templates)}")
    print(f"\n🔗 ID проекта для тестирования: {project.id}")
    
    return project


def main():
    """Основная функция"""
    print("🚀 Создание тестовых данных для системы экспорта Torange Plaza")
    print("=" * 60)
    
    try:
        project = create_test_project()
        
        print("\n" + "=" * 60)
        print("✅ Тестовые данные успешно созданы!")
        print("\n📝 Для тестирования экспорта используйте:")
        print(f"   - ID проекта: {project.id}")
        print("   - Форматы: json, yaml, csv, unity, unreal")
        print("   - API endpoint: POST /api/export/project/")
        
    except Exception as e:
        print(f"❌ Ошибка при создании тестовых данных: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
