import uuid
from django.conf import settings
from django.db import models

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
    name = models.CharField(max_length=200)
    portrait = models.URLField(blank=True)
    # 24 characteristics (integers)
    logic = models.IntegerField(default=2)
    encyclopedia = models.IntegerField(default=2)
    rhetoric = models.IntegerField(default=2)
    drama = models.IntegerField(default=2)
    conceptualization = models.IntegerField(default=2)
    visual_calculus = models.IntegerField(default=2)

    volition = models.IntegerField(default=2)
    inland_empire = models.IntegerField(default=2)
    empathy = models.IntegerField(default=2)
    authority = models.IntegerField(default=2)
    suggestion = models.IntegerField(default=2)
    espirit_de_corps = models.IntegerField(default=2)

    endurance = models.IntegerField(default=2)
    pain_threshold = models.IntegerField(default=2)
    physical_instrument = models.IntegerField(default=2)
    electrochemistry = models.IntegerField(default=2)
    shivers = models.IntegerField(default=2)
    half_light = models.IntegerField(default=2)

    hand_eye_coordination = models.IntegerField(default=2)
    perception = models.IntegerField(default=2)
    reaction_speed = models.IntegerField(default=2)
    savoir_faire = models.IntegerField(default=2)
    interfacing = models.IntegerField(default=2)
    composure = models.IntegerField(default=2)

    def __str__(self) -> str:
        return self.name


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

    class Meta:
        ordering = ["order", "created_at"]

    def __str__(self) -> str:
        return f"{self.speaker or '—'}: {self.text[:40]}"


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
    """Опции диалога с привязкой к skill check"""
    dialogue = models.ForeignKey(Dialogue, on_delete=models.CASCADE, related_name="options")
    text = models.TextField()
    skill_check = models.ForeignKey(SkillCheck, on_delete=models.SET_NULL, null=True, blank=True, related_name="options")
    order = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
    
    class Meta:
        ordering = ["order", "created_at"]
    
    def __str__(self) -> str:
        return f"Option: {self.text[:30]}"


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
