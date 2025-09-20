from rest_framework import serializers
from .models import (
    Project, UserProfile, GameProject, DialogueNode, DialogueLink, CharacterStat, 
    Character, NPC, Dialogue, Post, SkillCheck, DialogueOption, RollResult,
    Quest, QuestObjective, QuestCharacter, DialogueLog, ExportSession, ExportTemplate,
    ChatSession, ChatMessage, AIConfig
)

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "title", "description", "created_at", "updated_at"]

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id", "user", "display_name", "bio", "created_at", "updated_at"]
        read_only_fields = ["user"]


class GameProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameProject
        fields = "__all__"


class DialogueNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DialogueNode
        fields = "__all__"


class DialogueLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = DialogueLink
        fields = "__all__"


class CharacterStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharacterStat
        fields = "__all__"


class CharacterSerializer(serializers.ModelSerializer):
    # Computed fields for skill totals
    intellect_total = serializers.SerializerMethodField()
    psyche_total = serializers.SerializerMethodField()
    physique_total = serializers.SerializerMethodField()
    motorics_total = serializers.SerializerMethodField()
    
    class Meta:
        model = Character
        fields = [
            "id", "name", "portrait", "project",
            # Main attributes
            "intellect", "psyche", "physique", "motorics",
            # Intellect skills
            "logic", "encyclopedia", "rhetoric", "drama", "conceptualization", "visual_calculus",
            # Psyche skills
            "volition", "inland_empire", "empathy", "authority", "suggestion", "espirit_de_corps",
            # Physique skills
            "endurance", "pain_threshold", "physical_instrument", "electrochemistry", "shivers", "half_light",
            # Motorics skills
            "hand_eye_coordination", "perception", "reaction_speed", "savoir_faire", "interfacing", "composure",
            # Computed totals
            "intellect_total", "psyche_total", "physique_total", "motorics_total",
            "created_at", "updated_at"
        ]
    
    def get_intellect_total(self, obj):
        return obj.get_attribute_total('intellect')
    
    def get_psyche_total(self, obj):
        return obj.get_attribute_total('psyche')
    
    def get_physique_total(self, obj):
        return obj.get_attribute_total('physique')
    
    def get_motorics_total(self, obj):
        return obj.get_attribute_total('motorics')


class NPCSerializer(serializers.ModelSerializer):
    class Meta:
        model = NPC
        fields = "__all__"


class PostSerializer(serializers.ModelSerializer):
    available_options = serializers.SerializerMethodField()
    options_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = "__all__"
    
    def get_available_options(self, obj):
        """Возвращает доступные опции для поста"""
        character = self.context.get('character')
        options = obj.get_available_options(character)
        return DialogueOptionSerializer(options, many=True, context=self.context).data
    
    def get_options_count(self, obj):
        """Возвращает количество опций"""
        return obj.get_available_options().count()


class SkillCheckSerializer(serializers.ModelSerializer):
    dc_value_display = serializers.SerializerMethodField()
    
    class Meta:
        model = SkillCheck
        fields = "__all__"
    
    def get_dc_value_display(self, obj):
        return obj.get_dc_value()


class DialogueOptionSerializer(serializers.ModelSerializer):
    skill_check_details = SkillCheckSerializer(source='skill_check', read_only=True)
    next_dialogue_title = serializers.CharField(source='next_dialogue.title', read_only=True)
    next_post_text = serializers.CharField(source='next_post.text', read_only=True)
    is_accessible = serializers.SerializerMethodField()
    option_type_display = serializers.CharField(source='get_option_type_display', read_only=True)
    
    class Meta:
        model = DialogueOption
        fields = "__all__"
    
    def get_is_accessible(self, obj):
        """Проверяет доступность опции для персонажа"""
        character = self.context.get('character')
        return obj.is_accessible(character)


class DialogueSerializer(serializers.ModelSerializer):
    posts = PostSerializer(many=True, read_only=True)
    options = DialogueOptionSerializer(many=True, read_only=True)
    posts_count = serializers.SerializerMethodField()
    options_count = serializers.SerializerMethodField()
    branching_points_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Dialogue
        fields = "__all__"
    
    def get_posts_count(self, obj):
        return obj.posts.count()
    
    def get_options_count(self, obj):
        return obj.options.count()
    
    def get_branching_points_count(self, obj):
        return obj.posts.filter(is_branching_point=True).count()


class RollResultSerializer(serializers.ModelSerializer):
    character_name = serializers.CharField(source='character.name', read_only=True)
    skill_check_details = SkillCheckSerializer(source='skill_check', read_only=True)
    
    class Meta:
        model = RollResult
        fields = "__all__"


class QuestObjectiveSerializer(serializers.ModelSerializer):
    quest_title = serializers.CharField(source='quest.title', read_only=True)
    objective_type_display = serializers.CharField(source='get_objective_type_display', read_only=True)
    progress_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = QuestObjective
        fields = "__all__"
    
    def get_progress_percentage(self, obj):
        """Возвращает процент выполнения цели"""
        if obj.required_count == 0:
            return 100
        return int((obj.current_count / obj.required_count) * 100)


class QuestSerializer(serializers.ModelSerializer):
    # Связанные объекты
    objectives = QuestObjectiveSerializer(many=True, read_only=True)
    assigned_character_name = serializers.CharField(source='assigned_character.name', read_only=True)
    quest_giver_name = serializers.CharField(source='quest_giver.name', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    
    # Диалоги
    start_dialogue_title = serializers.CharField(source='start_dialogue.title', read_only=True)
    completion_dialogue_title = serializers.CharField(source='completion_dialogue.title', read_only=True)
    failure_dialogue_title = serializers.CharField(source='failure_dialogue.title', read_only=True)
    
    # Статистика
    objectives_count = serializers.SerializerMethodField()
    completed_objectives_count = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    quest_type_display = serializers.CharField(source='get_quest_type_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    
    # Доступность
    is_available_for_character = serializers.SerializerMethodField()
    can_start = serializers.SerializerMethodField()
    
    class Meta:
        model = Quest
        fields = "__all__"
    
    def get_objectives_count(self, obj):
        return obj.objectives.count()
    
    def get_completed_objectives_count(self, obj):
        return obj.objectives.filter(is_completed=True).count()
    
    def get_progress_percentage(self, obj):
        """Возвращает процент выполнения квеста"""
        if obj.max_progress == 0:
            return 100
        return int((obj.progress / obj.max_progress) * 100)
    
    def get_is_available_for_character(self, obj):
        """Проверяет доступность квеста для персонажа"""
        character = self.context.get('character')
        if character:
            return obj.is_available_for_character(character)
        return False
    
    def get_can_start(self, obj):
        """Проверяет возможность начала квеста"""
        character = self.context.get('character')
        if character:
            return obj.can_start(character)
        return False


class QuestCharacterSerializer(serializers.ModelSerializer):
    quest_title = serializers.CharField(source='quest.title', read_only=True)
    character_name = serializers.CharField(source='character.name', read_only=True)
    
    class Meta:
        model = QuestCharacter
        fields = "__all__"


# Quest System Serializers


class DialogueLogSerializer(serializers.ModelSerializer):
    character_name = serializers.CharField(source='character.name', read_only=True)
    quest_title = serializers.CharField(source='quest.title', read_only=True)
    log_type_display = serializers.CharField(source='get_log_type_display', read_only=True)
    
    class Meta:
        model = DialogueLog
        fields = "__all__"


# Export System Serializers

class ExportSessionSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    format_type_display = serializers.CharField(source='get_format_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = ExportSession
        fields = "__all__"


class ExportTemplateSerializer(serializers.ModelSerializer):
    format_type_display = serializers.CharField(source='get_format_type_display', read_only=True)
    
    class Meta:
        model = ExportTemplate
        fields = "__all__"


# AI Chat System Serializers

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'metadata', 'is_ai_generated', 'created_at']
        read_only_fields = ['id', 'created_at']


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    message_count = serializers.ReadOnlyField()
    
    class Meta:
        model = ChatSession
        fields = ['id', 'session_name', 'context', 'is_active', 'message_count', 'messages', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ChatSessionListSerializer(serializers.ModelSerializer):
    message_count = serializers.ReadOnlyField()
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatSession
        fields = ['id', 'session_name', 'context', 'is_active', 'message_count', 'last_message', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                'content': last_msg.content[:100] + '...' if len(last_msg.content) > 100 else last_msg.content,
                'role': last_msg.role,
                'created_at': last_msg.created_at
            }
        return None


class AIConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIConfig
        fields = ['id', 'model', 'temperature', 'max_tokens', 'system_prompt', 'is_enabled', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ChatRequestSerializer(serializers.Serializer):
    """Сериализатор для запросов к AI чату"""
    message = serializers.CharField(max_length=2000, help_text="Сообщение пользователя")
    session_id = serializers.UUIDField(required=False, help_text="ID сессии чата")
    project_id = serializers.UUIDField(required=False, help_text="ID проекта")
    context = serializers.JSONField(required=False, default=dict, help_text="Контекст проекта")
    save_to_history = serializers.BooleanField(default=True, help_text="Сохранять ли в историю")


class ChatResponseSerializer(serializers.Serializer):
    """Сериализатор для ответов AI чата"""
    message = serializers.CharField(help_text="Ответ ИИ")
    session_id = serializers.UUIDField(help_text="ID сессии чата")
    message_id = serializers.UUIDField(help_text="ID сообщения")
    success = serializers.BooleanField(help_text="Успешность запроса")
    model = serializers.CharField(help_text="Использованная модель")
    tokens_used = serializers.IntegerField(help_text="Количество использованных токенов")
    fallback = serializers.BooleanField(default=False, help_text="Использован ли fallback ответ")
    created_at = serializers.DateTimeField(help_text="Время создания ответа")


class ContentGenerationRequestSerializer(serializers.Serializer):
    """Сериализатор для генерации контента"""
    content_type = serializers.ChoiceField(
        choices=['dialogue', 'character', 'quest', 'scene'],
        help_text="Тип генерируемого контента"
    )
    prompt = serializers.CharField(max_length=1000, help_text="Промпт для генерации")
    project_id = serializers.UUIDField(required=False, help_text="ID проекта")
    context = serializers.JSONField(required=False, default=dict, help_text="Контекст проекта")


class ContentGenerationResponseSerializer(serializers.Serializer):
    """Сериализатор для ответов генерации контента"""
    content = serializers.JSONField(help_text="Сгенерированный контент")
    content_type = serializers.CharField(help_text="Тип контента")
    success = serializers.BooleanField(help_text="Успешность генерации")
    model = serializers.CharField(help_text="Использованная модель")
    tokens_used = serializers.IntegerField(help_text="Количество использованных токенов")
    fallback = serializers.BooleanField(default=False, help_text="Использован ли fallback ответ")
