from rest_framework import serializers
from .models import Project, UserProfile, GameProject, DialogueNode, DialogueLink, CharacterStat, Character, NPC, Dialogue, Post

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
