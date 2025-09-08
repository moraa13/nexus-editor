from rest_framework import serializers
from .models import (
    Project, UserProfile, GameProject, DialogueNode, DialogueLink, CharacterStat, 
    Character, NPC, Dialogue, Post, SkillCheck, DialogueOption, RollResult
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
    class Meta:
        model = Character
        fields = "__all__"


class NPCSerializer(serializers.ModelSerializer):
    class Meta:
        model = NPC
        fields = "__all__"


class DialogueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dialogue
        fields = "__all__"


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"


class SkillCheckSerializer(serializers.ModelSerializer):
    dc_value_display = serializers.SerializerMethodField()
    
    class Meta:
        model = SkillCheck
        fields = "__all__"
    
    def get_dc_value_display(self, obj):
        return obj.get_dc_value()


class DialogueOptionSerializer(serializers.ModelSerializer):
    skill_check_details = SkillCheckSerializer(source='skill_check', read_only=True)
    
    class Meta:
        model = DialogueOption
        fields = "__all__"


class RollResultSerializer(serializers.ModelSerializer):
    character_name = serializers.CharField(source='character.name', read_only=True)
    skill_check_details = SkillCheckSerializer(source='skill_check', read_only=True)
    
    class Meta:
        model = RollResult
        fields = "__all__"
