#!/usr/bin/env python3
"""
Создание тестовых данных для системы квестов и диалогов
"""

import os
import sys
import django

# Настройка Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nexus_backend.settings')
django.setup()

from core.models import Character, Quest, Dialogue, SkillCheck, GameProject

def create_test_data():
    print("Creating test data for quest system...")
    
    # Создаем игровой проект
    project, created = GameProject.objects.get_or_create(
        name="Disco Elysium Test Project",
        defaults={
            "description": "Тестовый проект для демонстрации системы квестов"
        }
    )
    print(f"Project: {'Created' if created else 'Exists'} - {project.name}")
    
    # Создаем персонажей
    characters_data = [
        {
            "name": "Detective Harry Du Bois",
            "logic": 4, "empathy": 3, "authority": 2, "endurance": 3,
            "rhetoric": 3, "drama": 2, "conceptualization": 4,
            "inland_empire": 5, "volition": 2, "suggestion": 1,
            "espirit_de_corps": 2, "pain_threshold": 3, "physical_instrument": 1,
            "electrochemistry": 4, "shivers": 3, "half_light": 2,
            "hand_eye_coordination": 2, "perception": 3, "reaction_speed": 2,
            "savoir_faire": 1, "interfacing": 2, "composure": 1,
            "encyclopedia": 3, "visual_calculus": 2
        },
        {
            "name": "Kim Kitsuragi",
            "logic": 5, "empathy": 4, "authority": 4, "endurance": 4,
            "rhetoric": 4, "drama": 2, "conceptualization": 3,
            "inland_empire": 2, "volition": 5, "suggestion": 3,
            "espirit_de_corps": 4, "pain_threshold": 4, "physical_instrument": 3,
            "electrochemistry": 1, "shivers": 2, "half_light": 1,
            "hand_eye_coordination": 4, "perception": 4, "reaction_speed": 4,
            "savoir_faire": 3, "interfacing": 4, "composure": 5,
            "encyclopedia": 4, "visual_calculus": 4
        },
        {
            "name": "Cuno",
            "logic": 1, "empathy": 1, "authority": 1, "endurance": 3,
            "rhetoric": 1, "drama": 3, "conceptualization": 1,
            "inland_empire": 2, "volition": 2, "suggestion": 1,
            "espirit_de_corps": 1, "pain_threshold": 4, "physical_instrument": 2,
            "electrochemistry": 3, "shivers": 2, "half_light": 3,
            "hand_eye_coordination": 2, "perception": 2, "reaction_speed": 3,
            "savoir_faire": 1, "interfacing": 1, "composure": 1,
            "encyclopedia": 1, "visual_calculus": 1
        }
    ]
    
    characters = []
    for char_data in characters_data:
        character, created = Character.objects.get_or_create(
            name=char_data["name"],
            defaults=char_data
        )
        characters.append(character)
        print(f"Character: {'Created' if created else 'Exists'} - {character.name}")
    
    # Создаем диалоги
    dialogues_data = [
        {
            "title": "Investigation of the Hanged Man",
            "project": project
        },
        {
            "title": "Interrogation of Cuno",
            "project": project
        },
        {
            "title": "Meeting with the Union",
            "project": project
        }
    ]
    
    dialogues = []
    for dialogue_data in dialogues_data:
        dialogue, created = Dialogue.objects.get_or_create(
            title=dialogue_data["title"],
            defaults=dialogue_data
        )
        dialogues.append(dialogue)
        print(f"Dialogue: {'Created' if created else 'Exists'} - {dialogue.title}")
    
    # Создаем квесты
    quests_data = [
        {
            "title": "Find the Murderer",
            "description": "Investigate the mysterious death of the hanged man in the harbor",
            "quest_type": "skill_check",
            "difficulty_level": 15,
            "assigned_character": characters[0],  # Harry
            "status": "active",
            "project": project,
            "dialogue": dialogues[0]
        },
        {
            "title": "Get Information from Cuno",
            "description": "Extract useful information from the local drug dealer",
            "quest_type": "dialogue",
            "difficulty_level": 12,
            "assigned_character": characters[0],  # Harry
            "status": "available",
            "project": project,
            "dialogue": dialogues[1]
        },
        {
            "title": "Negotiate with Union",
            "description": "Convince the union to cooperate with the investigation",
            "quest_type": "social",
            "difficulty_level": 18,
            "assigned_character": characters[1],  # Kim
            "status": "locked",
            "project": project,
            "dialogue": dialogues[2]
        }
    ]
    
    quests = []
    for quest_data in quests_data:
        quest, created = Quest.objects.get_or_create(
            title=quest_data["title"],
            defaults=quest_data
        )
        quests.append(quest)
        print(f"Quest: {'Created' if created else 'Exists'} - {quest.title}")
    
    # Создаем skill checks для диалогов
    skill_checks_data = [
        {
            "dialogue": dialogues[0],
            "skill": "logic",
            "difficulty": "hard",
            "dc_value": 20,
            "description": "Analyze the crime scene for clues",
            "success_text": "You notice subtle details that others missed. The rope shows signs of being cut, not broken.",
            "failure_text": "The scene is too chaotic. You can't make sense of what happened here.",
            "critical_success_text": "Your analytical mind pieces together the entire sequence of events!",
            "critical_failure_text": "You become overwhelmed by the horror and miss obvious clues."
        },
        {
            "dialogue": dialogues[0],
            "skill": "empathy",
            "difficulty": "medium",
            "dc_value": 15,
            "description": "Understand the emotional state of witnesses",
            "success_text": "You sense genuine fear and confusion in their stories.",
            "failure_text": "Everyone seems to be lying, but you can't tell why.",
            "critical_success_text": "You connect with their pain and they open up completely.",
            "critical_failure_text": "Your questions only make them more defensive."
        },
        {
            "dialogue": dialogues[1],
            "skill": "authority",
            "difficulty": "easy",
            "dc_value": 10,
            "description": "Intimidate Cuno into talking",
            "success_text": "Cuno backs down and starts providing information.",
            "failure_text": "Cuno laughs in your face and becomes more defiant.",
            "critical_success_text": "Cuno is genuinely scared and tells you everything he knows.",
            "critical_failure_text": "Cuno becomes violent and threatens you."
        },
        {
            "dialogue": dialogues[1],
            "skill": "suggestion",
            "difficulty": "medium",
            "dc_value": 15,
            "description": "Convince Cuno to cooperate willingly",
            "success_text": "Cuno sees the benefit of helping you and becomes more cooperative.",
            "failure_text": "Cuno doesn't trust you and remains hostile.",
            "critical_success_text": "Cuno becomes your ally and offers to help more.",
            "critical_failure_text": "Cuno sees through your manipulation and becomes even more suspicious."
        },
        {
            "dialogue": dialogues[2],
            "skill": "rhetoric",
            "difficulty": "extreme",
            "dc_value": 25,
            "description": "Present a compelling argument to the union leaders",
            "success_text": "The union leaders are impressed by your reasoning.",
            "failure_text": "Your argument falls flat and they dismiss you.",
            "critical_success_text": "You deliver a speech that moves the entire union to action!",
            "critical_failure_text": "Your words backfire and they become more hostile."
        }
    ]
    
    for skill_check_data in skill_checks_data:
        skill_check, created = SkillCheck.objects.get_or_create(
            dialogue=skill_check_data["dialogue"],
            skill=skill_check_data["skill"],
            defaults=skill_check_data
        )
        print(f"Skill Check: {'Created' if created else 'Exists'} - {skill_check.skill} in {skill_check.dialogue.title}")
    
    print("\n✅ Test data creation completed!")
    print(f"Created {len(characters)} characters, {len(dialogues)} dialogues, {len(quests)} quests, and {len(skill_checks_data)} skill checks")

if __name__ == "__main__":
    create_test_data()
