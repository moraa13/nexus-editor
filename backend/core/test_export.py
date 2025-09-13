"""
Автотесты для системы экспорта проекта
"""
import json
import os
import tempfile
from django.test import TestCase, Client
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import (
    GameProject, Character, Dialogue, Post, SkillCheck, 
    DialogueOption, Quest, DialogueLog, ExportSession
)


class ExportSystemTestCase(TestCase):
    def setUp(self):
        """Настройка тестовых данных"""
        # Создаем тестовый проект
        self.project = GameProject.objects.create(
            name="Test Game Project",
            description="Тестовый проект для проверки экспорта"
        )
        
        # Создаем тестового персонажа
        self.character = Character.objects.create(
            name="Test Character",
            logic=5,
            empathy=4,
            authority=3,
            endurance=6
        )
        
        # Создаем тестовый диалог
        self.dialogue = Dialogue.objects.create(
            title="Test Dialogue",
            project=self.project
        )
        self.dialogue.characters.add(self.character)
        
        # Создаем тестовые посты диалога
        self.post1 = Post.objects.create(
            dialogue=self.dialogue,
            speaker="NPC",
            text="Привет! Как дела?",
            order=1
        )
        self.post2 = Post.objects.create(
            dialogue=self.dialogue,
            speaker="Player",
            text="Отлично, спасибо!",
            order=2
        )
        
        # Создаем тестовый skill check
        self.skill_check = SkillCheck.objects.create(
            dialogue=self.dialogue,
            skill="empathy",
            difficulty="medium",
            description="Проверка эмпатии",
            success_text="Вы понимаете эмоции собеседника",
            failure_text="Вы не понимаете эмоции"
        )
        
        # Создаем тестовую опцию диалога
        self.dialogue_option = DialogueOption.objects.create(
            dialogue=self.dialogue,
            text="Попробовать понять эмоции",
            skill_check=self.skill_check,
            order=1
        )
        
        # Создаем тестовый квест
        self.quest = Quest.objects.create(
            title="Test Quest",
            description="Тестовый квест",
            quest_type="dialogue",
            difficulty_level=3,
            project=self.project,
            dialogue=self.dialogue
        )
        
        # Создаем тестовый лог диалога
        self.dialogue_log = DialogueLog.objects.create(
            quest=self.quest,
            character=self.character,
            log_type="dialogue",
            author="Test NPC",
            content="Тестовое сообщение",
            result="success"
        )
        
        self.client = Client()

    def test_export_json_format(self):
        """Тест экспорта в JSON формате"""
        response = self.client.post('/api/export/project/', {
            'project_id': str(self.project.id),
            'format_type': 'json',
            'export_options': {}
        })
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Проверяем, что экспорт создался
        self.assertIn('export_session_id', data)
        self.assertEqual(data['status'], 'completed')
        self.assertIn('download_url', data)
        
        # Проверяем, что сессия экспорта создалась
        export_session = ExportSession.objects.get(id=data['export_session_id'])
        self.assertEqual(export_session.project, self.project)
        self.assertEqual(export_session.format_type, 'json')
        self.assertEqual(export_session.status, 'completed')
        
        # Проверяем, что файл создался
        self.assertTrue(os.path.exists(export_session.file_path))
        
        # Проверяем содержимое JSON файла
        with open(export_session.file_path, 'r', encoding='utf-8') as f:
            export_data = json.load(f)
        
        # Проверяем структуру экспортированных данных
        self.assertIn('project', export_data)
        self.assertIn('characters', export_data)
        self.assertIn('dialogues', export_data)
        self.assertIn('quests', export_data)
        self.assertIn('dialogue_logs', export_data)
        
        # Проверяем данные проекта
        self.assertEqual(export_data['project']['name'], 'Test Game Project')
        
        # Проверяем данные персонажа
        self.assertEqual(len(export_data['characters']), 1)
        self.assertEqual(export_data['characters'][0]['name'], 'Test Character')
        self.assertEqual(export_data['characters'][0]['skills']['logic'], 5)
        
        # Проверяем данные диалога
        self.assertEqual(len(export_data['dialogues']), 1)
        self.assertEqual(export_data['dialogues'][0]['title'], 'Test Dialogue')
        self.assertEqual(len(export_data['dialogues'][0]['posts']), 2)
        
        # Проверяем skill checks
        self.assertEqual(len(export_data['dialogues'][0]['skill_checks']), 1)
        self.assertEqual(export_data['dialogues'][0]['skill_checks'][0]['skill'], 'empathy')

    def test_export_yaml_format(self):
        """Тест экспорта в YAML формате"""
        response = self.client.post('/api/export/project/', {
            'project_id': str(self.project.id),
            'format_type': 'yaml',
            'export_options': {}
        })
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        export_session = ExportSession.objects.get(id=data['export_session_id'])
        self.assertEqual(export_session.format_type, 'yaml')
        
        # Проверяем, что файл создался и содержит YAML
        self.assertTrue(os.path.exists(export_session.file_path))
        with open(export_session.file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            self.assertIn('project:', content)
            self.assertIn('characters:', content)

    def test_export_csv_format(self):
        """Тест экспорта в CSV формате"""
        response = self.client.post('/api/export/project/', {
            'project_id': str(self.project.id),
            'format_type': 'csv',
            'export_options': {}
        })
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        export_session = ExportSession.objects.get(id=data['export_session_id'])
        self.assertEqual(export_session.format_type, 'csv')
        
        # Проверяем содержимое CSV файла
        with open(export_session.file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            self.assertIn('Character ID,Name,Logic,Empathy,Authority,Endurance', content)
            self.assertIn('Test Character', content)

    def test_export_unity_format(self):
        """Тест экспорта в Unity ScriptableObject формате"""
        response = self.client.post('/api/export/project/', {
            'project_id': str(self.project.id),
            'format_type': 'unity',
            'export_options': {}
        })
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        export_session = ExportSession.objects.get(id=data['export_session_id'])
        self.assertEqual(export_session.format_type, 'unity')
        
        # Проверяем содержимое Unity файла
        with open(export_session.file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            self.assertIn('using UnityEngine;', content)
            self.assertIn('ScriptableObject', content)
            self.assertIn('Test Game Project', content)

    def test_export_unreal_format(self):
        """Тест экспорта в Unreal Engine формате"""
        response = self.client.post('/api/export/project/', {
            'project_id': str(self.project.id),
            'format_type': 'unreal',
            'export_options': {}
        })
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        export_session = ExportSession.objects.get(id=data['export_session_id'])
        self.assertEqual(export_session.format_type, 'unreal')
        
        # Проверяем содержимое Unreal файла
        with open(export_session.file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            self.assertIn('Unreal Engine Data Table', content)
            self.assertIn('Characters Data Table', content)

    def test_download_export(self):
        """Тест скачивания экспортированного файла"""
        # Сначала создаем экспорт
        response = self.client.post('/api/export/project/', {
            'project_id': str(self.project.id),
            'format_type': 'json',
            'export_options': {}
        })
        
        export_session_id = response.json()['export_session_id']
        
        # Скачиваем файл
        download_response = self.client.get(f'/api/export/download/{export_session_id}/')
        
        self.assertEqual(download_response.status_code, 200)
        self.assertEqual(download_response['Content-Type'], 'application/json')
        self.assertIn('attachment', download_response['Content-Disposition'])

    def test_export_nonexistent_project(self):
        """Тест экспорта несуществующего проекта"""
        response = self.client.post('/api/export/project/', {
            'project_id': '00000000-0000-0000-0000-000000000000',
            'format_type': 'json',
            'export_options': {}
        })
        
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

    def test_export_session_status_tracking(self):
        """Тест отслеживания статуса экспорта"""
        response = self.client.post('/api/export/project/', {
            'project_id': str(self.project.id),
            'format_type': 'json',
            'export_options': {}
        })
        
        export_session_id = response.json()['export_session_id']
        export_session = ExportSession.objects.get(id=export_session_id)
        
        # Проверяем, что статус изменился на completed
        self.assertEqual(export_session.status, 'completed')
        self.assertIsNotNone(export_session.file_path)
        self.assertIsNotNone(export_session.file_size)

    def test_export_templates_endpoint(self):
        """Тест получения шаблонов экспорта"""
        response = self.client.get('/api/export/templates/')
        
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_export_sessions_list(self):
        """Тест получения списка сессий экспорта"""
        # Создаем несколько экспортов
        for format_type in ['json', 'yaml', 'csv']:
            self.client.post('/api/export/project/', {
                'project_id': str(self.project.id),
                'format_type': format_type,
                'export_options': {}
            })
        
        # Получаем список сессий
        response = self.client.get('/api/export-sessions/')
        
        self.assertEqual(response.status_code, 200)
        sessions = response.json()
        self.assertGreaterEqual(len(sessions), 3)
        
        # Проверяем, что все сессии имеют статус completed
        for session in sessions:
            self.assertEqual(session['status'], 'completed')

    def tearDown(self):
        """Очистка после тестов"""
        # Удаляем созданные файлы экспорта
        for export_session in ExportSession.objects.all():
            if export_session.file_path and os.path.exists(export_session.file_path):
                os.remove(export_session.file_path)


class ExportDataIntegrityTestCase(TestCase):
    """Тесты целостности данных при экспорте"""
    
    def setUp(self):
        self.project = GameProject.objects.create(
            name="Data Integrity Test",
            description="Тест целостности данных"
        )
        
        # Создаем персонажа с максимальными значениями характеристик
        self.character = Character.objects.create(
            name="Max Stats Character",
            logic=20,
            empathy=20,
            authority=20,
            endurance=20,
            # ... все остальные характеристики
        )
        
        self.client = Client()

    def test_character_skills_export_integrity(self):
        """Тест целостности экспорта характеристик персонажа"""
        response = self.client.post('/api/export/project/', {
            'project_id': str(self.project.id),
            'format_type': 'json',
            'export_options': {}
        })
        
        export_session = ExportSession.objects.get(id=response.json()['export_session_id'])
        
        with open(export_session.file_path, 'r', encoding='utf-8') as f:
            export_data = json.load(f)
        
        character_data = export_data['characters'][0]
        
        # Проверяем, что все характеристики экспортированы
        expected_skills = [
            'logic', 'encyclopedia', 'rhetoric', 'drama', 'conceptualization', 'visual_calculus',
            'volition', 'inland_empire', 'empathy', 'authority', 'suggestion', 'espirit_de_corps',
            'endurance', 'pain_threshold', 'physical_instrument', 'electrochemistry', 'shivers', 'half_light',
            'hand_eye_coordination', 'perception', 'reaction_speed', 'savoir_faire', 'interfacing', 'composure'
        ]
        
        for skill in expected_skills:
            self.assertIn(skill, character_data['skills'])
            self.assertIsInstance(character_data['skills'][skill], int)

    def test_unicode_support(self):
        """Тест поддержки Unicode в экспорте"""
        # Создаем диалог с Unicode символами
        dialogue = Dialogue.objects.create(
            title="Тест с русскими символами 🎮",
            project=self.project
        )
        
        Post.objects.create(
            dialogue=dialogue,
            speaker="NPC",
            text="Привет! Это тест с эмодзи 🎯 и русскими символами",
            order=1
        )
        
        response = self.client.post('/api/export/project/', {
            'project_id': str(self.project.id),
            'format_type': 'json',
            'export_options': {}
        })
        
        export_session = ExportSession.objects.get(id=response.json()['export_session_id'])
        
        with open(export_session.file_path, 'r', encoding='utf-8') as f:
            export_data = json.load(f)
        
        # Проверяем, что Unicode символы сохранились
        dialogue_data = export_data['dialogues'][0]
        self.assertIn('🎮', dialogue_data['title'])
        self.assertIn('🎯', dialogue_data['posts'][0]['text'])
        self.assertIn('русскими', dialogue_data['posts'][0]['text'])


if __name__ == '__main__':
    import django
    from django.conf import settings
    from django.test.utils import get_runner
    
    django.setup()
    TestRunner = get_runner(settings)
    test_runner = TestRunner()
    failures = test_runner.run_tests(["core.test_export"])
