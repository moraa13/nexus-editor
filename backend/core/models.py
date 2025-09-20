import uuid
from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class UUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    class Meta:
        abstract = True

class BaseModel(UUIDModel, TimeStampedModel):
    class Meta:
        abstract = True

class UserProfile(BaseModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=150, blank=True)
    bio = models.TextField(blank=True)
    def __str__(self): 
        return self.display_name or self.user.get_username()

class Project(BaseModel):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name="projects",
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    def __str__(self):
        return self.title


# New models for narrative system


class GameProject(BaseModel):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="owned_game_projects",
    )

    def __str__(self) -> str:
        return self.name


class DialogueNode(BaseModel):
    NODE_TYPES = (
        ("statement", "statement"),
        ("question", "question"),
        ("option", "option"),
    )
    project = models.ForeignKey(GameProject, on_delete=models.CASCADE, related_name="dialogue_nodes")
    character = models.CharField(max_length=200)
    text = models.TextField()
    node_type = models.CharField(max_length=20, choices=NODE_TYPES, default="statement")
    order = models.IntegerField(default=0)

    def __str__(self) -> str:
        return f"{self.character}: {self.text[:40]}"


class DialogueLink(BaseModel):
    from_node = models.ForeignKey(DialogueNode, on_delete=models.CASCADE, related_name="out_links")
    to_node = models.ForeignKey(DialogueNode, on_delete=models.CASCADE, related_name="in_links")
    condition = models.CharField(max_length=200, blank=True)
    action = models.CharField(max_length=200, blank=True)


class CharacterStat(BaseModel):
    project = models.ForeignKey(GameProject, on_delete=models.CASCADE, related_name="character_stats")
    name = models.CharField(max_length=200)
    value = models.IntegerField(default=0)
    description = models.TextField(blank=True)

    def __str__(self) -> str:
        return f"{self.name}={self.value}"


# AI Narrative Editor models


class Character(BaseModel):
    """
    Unified Character model combining both core and dialogue character models.
    Includes all fields from both models with proper validation.
    """
    name = models.CharField(max_length=200)
    portrait = models.URLField(blank=True)
    
    # Project relationship (from dialogue model)
    project = models.ForeignKey(
        GameProject, 
        on_delete=models.CASCADE, 
        related_name="characters",
        null=True, 
        blank=True,
        help_text="Project this character belongs to"
    )
    
    # 4 main attributes (from dialogue model)
    intellect = models.IntegerField(
        default=2, 
        validators=[MinValueValidator(1), MaxValueValidator(20)],
        help_text="Intellect attribute (1-20)"
    )
    psyche = models.IntegerField(
        default=2, 
        validators=[MinValueValidator(1), MaxValueValidator(20)],
        help_text="Psyche attribute (1-20)"
    )
    physique = models.IntegerField(
        default=2, 
        validators=[MinValueValidator(1), MaxValueValidator(20)],
        help_text="Physique attribute (1-20)"
    )
    motorics = models.IntegerField(
        default=2, 
        validators=[MinValueValidator(1), MaxValueValidator(20)],
        help_text="Motorics attribute (1-20)"
    )
    
    # 24 skills (integers) with validation
    # Intellect skills
    logic = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    encyclopedia = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    rhetoric = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    drama = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    conceptualization = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    visual_calculus = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])

    # Psyche skills
    volition = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    inland_empire = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    empathy = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    authority = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    suggestion = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    espirit_de_corps = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])

    # Physique skills
    endurance = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    pain_threshold = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    physical_instrument = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    electrochemistry = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    shivers = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    half_light = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])

    # Motorics skills
    hand_eye_coordination = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    perception = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    reaction_speed = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    savoir_faire = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    interfacing = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])
    composure = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(20)])

    class Meta:
        verbose_name = "Character"
        verbose_name_plural = "Characters"
        ordering = ['name']

    def __str__(self) -> str:
        return self.name
    
    def get_intellect_skills(self):
        """Returns all intellect skills as a dictionary"""
        return {
            'logic': self.logic,
            'encyclopedia': self.encyclopedia,
            'rhetoric': self.rhetoric,
            'drama': self.drama,
            'conceptualization': self.conceptualization,
            'visual_calculus': self.visual_calculus,
        }
    
    def get_psyche_skills(self):
        """Returns all psyche skills as a dictionary"""
        return {
            'volition': self.volition,
            'inland_empire': self.inland_empire,
            'empathy': self.empathy,
            'authority': self.authority,
            'suggestion': self.suggestion,
            'espirit_de_corps': self.espirit_de_corps,
        }
    
    def get_physique_skills(self):
        """Returns all physique skills as a dictionary"""
        return {
            'endurance': self.endurance,
            'pain_threshold': self.pain_threshold,
            'physical_instrument': self.physical_instrument,
            'electrochemistry': self.electrochemistry,
            'shivers': self.shivers,
            'half_light': self.half_light,
        }
    
    def get_motorics_skills(self):
        """Returns all motorics skills as a dictionary"""
        return {
            'hand_eye_coordination': self.hand_eye_coordination,
            'perception': self.perception,
            'reaction_speed': self.reaction_speed,
            'savoir_faire': self.savoir_faire,
            'interfacing': self.interfacing,
            'composure': self.composure,
        }
    
    def get_all_skills(self):
        """Returns all skills organized by category"""
        return {
            'intellect': self.get_intellect_skills(),
            'psyche': self.get_psyche_skills(),
            'physique': self.get_physique_skills(),
            'motorics': self.get_motorics_skills(),
        }
    
    def get_skill_value(self, skill_name):
        """Gets the value of a specific skill"""
        return getattr(self, skill_name, 0)
    
    def get_attribute_total(self, attribute):
        """Gets total points for an attribute including all its skills"""
        if attribute == 'intellect':
            return self.intellect + sum(self.get_intellect_skills().values())
        elif attribute == 'psyche':
            return self.psyche + sum(self.get_psyche_skills().values())
        elif attribute == 'physique':
            return self.physique + sum(self.get_physique_skills().values())
        elif attribute == 'motorics':
            return self.motorics + sum(self.get_motorics_skills().values())
        return 0


class NPC(BaseModel):
    name = models.CharField(max_length=200)
    behavior = models.JSONField(default=dict, blank=True)

    def __str__(self) -> str:
        return self.name


class Dialogue(BaseModel):
    title = models.CharField(max_length=200)
    project = models.ForeignKey(GameProject, on_delete=models.SET_NULL, null=True, blank=True, related_name="dialogues")
    characters = models.ManyToManyField(Character, related_name="dialogues", blank=True)

    def __str__(self) -> str:
        return self.title


class Post(BaseModel):
    dialogue = models.ForeignKey(Dialogue, on_delete=models.CASCADE, related_name="posts")
    speaker = models.CharField(max_length=200, blank=True)
    text = models.TextField()
    is_generated = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    # Ветвление
    has_options = models.BooleanField(default=False, help_text="Есть ли у этого поста опции ответа")
    is_branching_point = models.BooleanField(default=False, help_text="Является ли точкой ветвления")
    
    # Визуальные настройки
    post_type = models.CharField(
        max_length=20, 
        choices=[
            ('statement', 'Утверждение'),
            ('question', 'Вопрос'),
            ('action', 'Действие'),
            ('narration', 'Повествование'),
        ],
        default='statement'
    )
    color = models.CharField(max_length=7, default="#6B7280", help_text="Цвет поста")
    icon = models.CharField(max_length=50, default="💬", help_text="Иконка поста")

    class Meta:
        ordering = ["order", "created_at"]

    def __str__(self) -> str:
        return f"{self.speaker or '—'}: {self.text[:40]}"
    
    def get_available_options(self, character=None):
        """Получает доступные опции для этого поста"""
        if not self.has_options:
            return []
        
        options = DialogueOption.objects.filter(
            dialogue=self.dialogue,
            order__gte=self.order
        ).order_by('order')
        
        if character:
            return [opt for opt in options if opt.is_accessible(character)]
        
        return options


# Skill Check System Models

class SkillCheck(BaseModel):
    """Модель для диалоговых проверок характеристик"""
    SKILL_CHOICES = [
        ('logic', 'Logic'),
        ('encyclopedia', 'Encyclopedia'),
        ('rhetoric', 'Rhetoric'),
        ('drama', 'Drama'),
        ('conceptualization', 'Conceptualization'),
        ('visual_calculus', 'Visual Calculus'),
        ('volition', 'Volition'),
        ('inland_empire', 'Inland Empire'),
        ('empathy', 'Empathy'),
        ('authority', 'Authority'),
        ('suggestion', 'Suggestion'),
        ('espirit_de_corps', 'Espirit de Corps'),
        ('endurance', 'Endurance'),
        ('pain_threshold', 'Pain Threshold'),
        ('physical_instrument', 'Physical Instrument'),
        ('electrochemistry', 'Electrochemistry'),
        ('shivers', 'Shivers'),
        ('half_light', 'Half Light'),
        ('hand_eye_coordination', 'Hand/Eye Coordination'),
        ('perception', 'Perception'),
        ('reaction_speed', 'Reaction Speed'),
        ('savoir_faire', 'Savoir Faire'),
        ('interfacing', 'Interfacing'),
        ('composure', 'Composure'),
    ]
    
    DIFFICULTY_CHOICES = [
        ('trivial', 'Trivial (5)'),
        ('easy', 'Easy (10)'),
        ('medium', 'Medium (15)'),
        ('hard', 'Hard (20)'),
        ('extreme', 'Extreme (25)'),
        ('impossible', 'Impossible (30)'),
    ]
    
    dialogue = models.ForeignKey(Dialogue, on_delete=models.CASCADE, related_name="skill_checks")
    skill = models.CharField(max_length=30, choices=SKILL_CHOICES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='medium')
    dc_value = models.IntegerField(default=15)  # Difficulty Class value
    description = models.TextField(blank=True)
    success_text = models.TextField(blank=True)
    failure_text = models.TextField(blank=True)
    critical_success_text = models.TextField(blank=True)
    critical_failure_text = models.TextField(blank=True)
    
    def get_dc_value(self):
        """Возвращает числовое значение DC на основе выбранной сложности"""
        dc_map = {
            'trivial': 5,
            'easy': 10,
            'medium': 15,
            'hard': 20,
            'extreme': 25,
            'impossible': 30,
        }
        return dc_map.get(self.difficulty, self.dc_value)
    
    def __str__(self) -> str:
        return f"{self.skill.title()} check (DC {self.get_dc_value()}) in {self.dialogue.title}"


class DialogueOption(BaseModel):
    """Опции диалога с привязкой к skill check и ветвлением"""
    OPTION_TYPES = [
        ('response', 'Ответ игрока'),
        ('choice', 'Выбор действия'),
        ('skill_check', 'Проверка навыка'),
        ('condition', 'Условный переход'),
    ]
    
    # Основные поля
    dialogue = models.ForeignKey(Dialogue, on_delete=models.CASCADE, related_name="options")
    text = models.TextField(help_text="Текст опции")
    option_type = models.CharField(max_length=20, choices=OPTION_TYPES, default='response')
    order = models.IntegerField(default=0, help_text="Порядок отображения")
    is_available = models.BooleanField(default=True, help_text="Доступна ли опция")
    
    # Ветвление
    next_dialogue = models.ForeignKey(
        Dialogue, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="previous_options",
        help_text="Следующий диалог при выборе этой опции"
    )
    next_post = models.ForeignKey(
        'Post',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="previous_options",
        help_text="Следующий пост при выборе этой опции"
    )
    
    # Условия и проверки
    skill_check = models.ForeignKey(SkillCheck, on_delete=models.SET_NULL, null=True, blank=True, related_name="options")
    required_skill = models.CharField(max_length=30, blank=True, help_text="Требуемый навык")
    required_skill_value = models.IntegerField(null=True, blank=True, help_text="Минимальное значение навыка")
    
    # Дополнительные условия
    condition_text = models.TextField(blank=True, help_text="Условие доступности опции")
    condition_met = models.BooleanField(default=True, help_text="Выполнено ли условие")
    
    # Визуальные настройки
    color = models.CharField(max_length=7, default="#3B82F6", help_text="Цвет опции в hex формате")
    icon = models.CharField(max_length=50, default="💬", help_text="Иконка опции")
    
    # Интеграция с квестами
    quest_trigger = models.ForeignKey('Quest', on_delete=models.SET_NULL, null=True, blank=True, related_name="trigger_options")
    quest_completion = models.ForeignKey('Quest', on_delete=models.SET_NULL, null=True, blank=True, related_name="completion_options")
    quest_objective_trigger = models.ForeignKey('QuestObjective', on_delete=models.SET_NULL, null=True, blank=True, related_name="trigger_options")
    quest_objective_completion = models.ForeignKey('QuestObjective', on_delete=models.SET_NULL, null=True, blank=True, related_name="completion_options")
    
    # Метаданные
    metadata = models.JSONField(default=dict, blank=True, help_text="Дополнительные данные")
    
    class Meta:
        ordering = ["order", "created_at"]
        unique_together = ['dialogue', 'order']
    
    def __str__(self) -> str:
        return f"Option: {self.text[:30]} ({self.option_type})"
    
    def is_accessible(self, character=None):
        """Проверяет, доступна ли опция для персонажа"""
        if not self.is_available:
            return False
        
        if not self.condition_met:
            return False
        
        if self.required_skill and character:
            skill_value = getattr(character, self.required_skill, 0)
            if self.required_skill_value and skill_value < self.required_skill_value:
                return False
        
        return True
    
    def execute_quest_actions(self, character=None):
        """Выполняет действия, связанные с квестами"""
        actions = []
        
        # Запуск квеста
        if self.quest_trigger and character:
            if self.quest_trigger.can_start(character):
                if self.quest_trigger.start_quest(character):
                    actions.append({
                        'type': 'quest_started',
                        'quest_id': str(self.quest_trigger.id),
                        'quest_title': self.quest_trigger.title
                    })
        
        # Завершение квеста
        if self.quest_completion and character:
            if self.quest_completion.status == 'active' and self.quest_completion.assigned_character == character:
                self.quest_completion.complete_quest()
                actions.append({
                    'type': 'quest_completed',
                    'quest_id': str(self.quest_completion.id),
                    'quest_title': self.quest_completion.title
                })
        
        # Запуск цели квеста
        if self.quest_objective_trigger and character:
            if not self.quest_objective_trigger.is_completed:
                self.quest_objective_trigger.update_progress(1)
                actions.append({
                    'type': 'objective_started',
                    'objective_id': str(self.quest_objective_trigger.id),
                    'objective_title': self.quest_objective_trigger.title
                })
        
        # Завершение цели квеста
        if self.quest_objective_completion and character:
            if not self.quest_objective_completion.is_completed:
                self.quest_objective_completion.complete_objective()
                actions.append({
                    'type': 'objective_completed',
                    'objective_id': str(self.quest_objective_completion.id),
                    'objective_title': self.quest_objective_completion.title
                })
        
        return actions


class RollResult(BaseModel):
    """Результат броска кубика для skill check"""
    skill_check = models.ForeignKey(SkillCheck, on_delete=models.CASCADE, related_name="roll_results")
    character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name="roll_results")
    dice_roll = models.IntegerField()  # Результат d20
    skill_value = models.IntegerField()  # Значение характеристики персонажа
    total = models.IntegerField()  # dice_roll + skill_value
    is_success = models.BooleanField()
    is_critical_success = models.BooleanField(default=False)
    is_critical_failure = models.BooleanField(default=False)
    result_text = models.TextField(blank=True)
    
    def __str__(self) -> str:
        return f"{self.character.name}: {self.dice_roll}+{self.skill_value}={self.total} ({'Success' if self.is_success else 'Failure'})"


# Quest System Models

class Quest(BaseModel):
    """Модель для квестов с интеграцией диалогов"""
    QUEST_TYPES = [
        ('dialogue', 'Диалог'),
        ('combat', 'Бой'),
        ('skill_check', 'Проверка навыка'),
        ('exploration', 'Исследование'),
        ('puzzle', 'Головоломка'),
        ('social', 'Социальное взаимодействие'),
        ('fetch', 'Доставка'),
        ('elimination', 'Устранение'),
        ('escort', 'Эскорт'),
        ('investigation', 'Расследование'),
    ]
    
    QUEST_STATUS = [
        ('available', 'Доступен'),
        ('active', 'Активен'),
        ('completed', 'Завершен'),
        ('failed', 'Провален'),
        ('locked', 'Заблокирован'),
        ('paused', 'Приостановлен'),
    ]
    
    QUEST_PRIORITY = [
        ('low', 'Низкий'),
        ('normal', 'Обычный'),
        ('high', 'Высокий'),
        ('critical', 'Критический'),
    ]
    
    # Основная информация
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    quest_type = models.CharField(max_length=20, choices=QUEST_TYPES, default='dialogue')
    priority = models.CharField(max_length=10, choices=QUEST_PRIORITY, default='normal')
    difficulty_level = models.IntegerField(
        default=1, 
        help_text="Уровень сложности от 1 до 20",
        validators=[MinValueValidator(1), MaxValueValidator(20)]
    )
    
    # Статус и прогресс
    status = models.CharField(max_length=20, choices=QUEST_STATUS, default='available')
    progress = models.IntegerField(default=0, help_text="Прогресс выполнения от 0 до 100")
    max_progress = models.IntegerField(default=100, help_text="Максимальный прогресс")
    
    # Связи
    project = models.ForeignKey(GameProject, on_delete=models.CASCADE, related_name="quests", null=True, blank=True)
    assigned_character = models.ForeignKey(Character, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_quests")
    quest_giver = models.ForeignKey(NPC, on_delete=models.SET_NULL, null=True, blank=True, related_name="given_quests")
    
    # Диалоги
    start_dialogue = models.ForeignKey(Dialogue, on_delete=models.SET_NULL, null=True, blank=True, related_name="quest_starts")
    completion_dialogue = models.ForeignKey(Dialogue, on_delete=models.SET_NULL, null=True, blank=True, related_name="quest_completions")
    failure_dialogue = models.ForeignKey(Dialogue, on_delete=models.SET_NULL, null=True, blank=True, related_name="quest_failures")
    
    # Условия
    prerequisites = models.ManyToManyField('self', blank=True, symmetrical=False, related_name="unlocks")
    required_skills = models.JSONField(default=dict, blank=True, help_text="Требуемые навыки: {'skill_name': min_value}")
    required_items = models.JSONField(default=list, blank=True, help_text="Требуемые предметы")
    
    # Награды
    experience_reward = models.IntegerField(default=0)
    skill_rewards = models.JSONField(default=dict, blank=True, help_text="Награды навыков: {'skill_name': bonus}")
    item_rewards = models.JSONField(default=list, blank=True, help_text="Награды предметов")
    
    # Временные ограничения
    time_limit = models.DurationField(null=True, blank=True, help_text="Временное ограничение")
    deadline = models.DateTimeField(null=True, blank=True, help_text="Дедлайн квеста")
    
    # Метаданные
    tags = models.JSONField(default=list, blank=True, help_text="Теги квеста")
    metadata = models.JSONField(default=dict, blank=True, help_text="Дополнительные данные")
    
    # Визуальные настройки
    color = models.CharField(max_length=7, default="#10B981", help_text="Цвет квеста")
    icon = models.CharField(max_length=50, default="📋", help_text="Иконка квеста")
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self) -> str:
        return f"{self.title} ({self.get_status_display()})"
    
    def is_available_for_character(self, character):
        """Проверяет доступность квеста для персонажа"""
        if self.status != 'available':
            return False
        
        # Проверяем предварительные условия
        for prereq in self.prerequisites.all():
            if prereq.status != 'completed':
                return False
        
        # Проверяем навыки
        for skill, min_value in self.required_skills.items():
            if hasattr(character, skill):
                if getattr(character, skill) < min_value:
                    return False
        
        return True
    
    def can_start(self, character):
        """Проверяет возможность начала квеста"""
        return self.is_available_for_character(character) and self.status == 'available'
    
    def start_quest(self, character):
        """Запускает квест"""
        if self.can_start(character):
            self.status = 'active'
            self.assigned_character = character
            self.progress = 0
            self.save()
            return True
        return False
    
    def update_progress(self, amount):
        """Обновляет прогресс квеста"""
        self.progress = min(self.progress + amount, self.max_progress)
        self.save()
        
        if self.progress >= self.max_progress:
            self.complete_quest()
    
    def complete_quest(self):
        """Завершает квест"""
        self.status = 'completed'
        self.progress = self.max_progress
        self.save()
        
        # Разблокируем зависимые квесты
        for quest in self.unlocks.all():
            if quest.status == 'locked':
                quest.status = 'available'
                quest.save()
    
    def fail_quest(self):
        """Проваливает квест"""
        self.status = 'failed'
        self.save()
    
    def get_available_dialogues(self):
        """Возвращает доступные диалоги для квеста"""
        dialogues = []
        if self.start_dialogue and self.status == 'available':
            dialogues.append(self.start_dialogue)
        if self.completion_dialogue and self.status == 'active' and self.progress >= self.max_progress:
            dialogues.append(self.completion_dialogue)
        if self.failure_dialogue and self.status == 'failed':
            dialogues.append(self.failure_dialogue)
        return dialogues


class QuestObjective(BaseModel):
    """Цели квеста"""
    OBJECTIVE_TYPES = [
        ('dialogue', 'Диалог'),
        ('kill', 'Убить'),
        ('collect', 'Собрать'),
        ('deliver', 'Доставить'),
        ('reach', 'Достичь'),
        ('interact', 'Взаимодействовать'),
        ('skill_check', 'Проверка навыка'),
        ('time_limit', 'Временное ограничение'),
    ]
    
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, related_name="objectives")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    objective_type = models.CharField(max_length=20, choices=OBJECTIVE_TYPES, default='dialogue')
    is_completed = models.BooleanField(default=False)
    is_optional = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    # Связи с диалогами
    trigger_dialogue = models.ForeignKey(Dialogue, on_delete=models.SET_NULL, null=True, blank=True, related_name="objective_triggers")
    completion_dialogue = models.ForeignKey(Dialogue, on_delete=models.SET_NULL, null=True, blank=True, related_name="objective_completions")
    
    # Условия выполнения
    required_count = models.IntegerField(default=1, help_text="Требуемое количество")
    current_count = models.IntegerField(default=0, help_text="Текущее количество")
    
    # Метаданные
    metadata = models.JSONField(default=dict, blank=True, help_text="Дополнительные данные цели")
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self) -> str:
        return f"{self.quest.title}: {self.title}"
    
    def update_progress(self, amount=1):
        """Обновляет прогресс цели"""
        self.current_count = min(self.current_count + amount, self.required_count)
        self.save()
        
        if self.current_count >= self.required_count and not self.is_completed:
            self.complete_objective()
    
    def complete_objective(self):
        """Завершает цель"""
        self.is_completed = True
        self.current_count = self.required_count
        self.save()
        
        # Проверяем, завершен ли весь квест
        self.quest.update_progress(1)


class QuestCharacter(BaseModel):
    """Связь между квестом и персонажами (многие ко многим)"""
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, related_name="quest_characters")
    character = models.ForeignKey(Character, on_delete=models.CASCADE, related_name="character_quests")
    is_primary = models.BooleanField(default=False, help_text="Основной персонаж квеста")
    
    class Meta:
        unique_together = ['quest', 'character']
    
    def __str__(self) -> str:
        return f"{self.quest.title} - {self.character.name}"


class DialogueLog(BaseModel):
    """Лог диалогов и действий"""
    LOG_TYPES = [
        ('dialogue', 'Диалог'),
        ('dice_roll', 'Бросок кубика'),
        ('skill_check', 'Проверка навыка'),
        ('quest_action', 'Действие квеста'),
        ('character_action', 'Действие персонажа'),
    ]
    
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE, related_name="dialogue_logs", null=True, blank=True)
    character = models.ForeignKey(Character, on_delete=models.SET_NULL, null=True, blank=True, related_name="dialogue_logs")
    log_type = models.CharField(max_length=20, choices=LOG_TYPES)
    author = models.CharField(max_length=200, help_text="NPC или Player")
    content = models.TextField()
    result = models.CharField(max_length=50, blank=True, help_text="успех/провал/нейтрально")
    metadata = models.JSONField(default=dict, blank=True, help_text="Дополнительные данные (результат броска, модификаторы и т.д.)")
    
    def __str__(self) -> str:
        return f"{self.author}: {self.content[:50]}"


# Export System Models

class ExportSession(BaseModel):
    """Сессия экспорта проекта"""
    EXPORT_FORMATS = [
        ('json', 'JSON'),
        ('yaml', 'YAML'),
        ('xml', 'XML'),
        ('csv', 'CSV'),
        ('unity', 'Unity ScriptableObject'),
        ('unreal', 'Unreal Engine Data Table'),
        ('godot', 'Godot Resource'),
        ('renpy', 'Ren\'Py Script'),
        ('twine', 'Twine Story Format'),
    ]
    
    EXPORT_STATUS = [
        ('pending', 'Ожидает'),
        ('processing', 'Обрабатывается'),
        ('completed', 'Завершен'),
        ('failed', 'Ошибка'),
    ]
    
    project = models.ForeignKey(GameProject, on_delete=models.CASCADE, related_name="export_sessions")
    format_type = models.CharField(max_length=20, choices=EXPORT_FORMATS, default='json')
    status = models.CharField(max_length=20, choices=EXPORT_STATUS, default='pending')
    file_path = models.CharField(max_length=500, blank=True)
    file_size = models.BigIntegerField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    export_options = models.JSONField(default=dict, blank=True)
    
    def __str__(self) -> str:
        return f"Export {self.project.name} ({self.format_type}) - {self.status}"


class ExportTemplate(BaseModel):
    """Шаблоны экспорта для разных форматов"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    format_type = models.CharField(max_length=20, choices=ExportSession.EXPORT_FORMATS)
    template_content = models.TextField(help_text="Шаблон в формате Jinja2")
    is_default = models.BooleanField(default=False)
    
    def __str__(self) -> str:
        return f"{self.name} ({self.format_type})"


# AI Chat System Models

class ChatSession(BaseModel):
    """Сессия чата с ИИ"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name="chat_sessions"
    )
    project = models.ForeignKey(
        GameProject,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name="chat_sessions"
    )
    session_name = models.CharField(max_length=200, blank=True)
    context = models.JSONField(default=dict, blank=True, help_text="Контекст проекта (жанр, тональность, персонажи)")
    is_active = models.BooleanField(default=True)
    
    def __str__(self) -> str:
        return f"Chat Session {self.id} - {self.session_name or 'Unnamed'}"
    
    @property
    def message_count(self) -> int:
        return self.messages.count()
    
    def get_recent_messages(self, limit: int = 10) -> list:
        """Получить последние сообщения для контекста"""
        return list(self.messages.order_by('-created_at')[:limit].values('role', 'content', 'created_at'))


class ChatMessage(BaseModel):
    """Сообщение в чате с ИИ"""
    ROLE_CHOICES = [
        ('user', 'Пользователь'),
        ('assistant', 'ИИ-помощник'),
        ('system', 'Система'),
    ]
    
    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    metadata = models.JSONField(default=dict, blank=True, help_text="Метаданные (модель, токены, время ответа)")
    is_ai_generated = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self) -> str:
        return f"{self.role}: {self.content[:50]}"


class AIConfig(BaseModel):
    """Конфигурация ИИ для проектов"""
    project = models.OneToOneField(
        GameProject,
        on_delete=models.CASCADE,
        related_name="ai_config"
    )
    model = models.CharField(max_length=100, default='anthropic/claude-3.5-sonnet')
    temperature = models.FloatField(default=0.7, validators=[MinValueValidator(0.0), MaxValueValidator(2.0)])
    max_tokens = models.IntegerField(default=1000, validators=[MinValueValidator(1), MaxValueValidator(4000)])
    system_prompt = models.TextField(blank=True, help_text="Кастомный системный промпт")
    is_enabled = models.BooleanField(default=True)
    
    def __str__(self) -> str:
        return f"AI Config for {self.project.name}"
