from rest_framework import serializers
from .models import Project, Scene, DialogueNode, DialogueEdge, SkillCheck
from core.models import Character


class ProjectSerializer(serializers.ModelSerializer):
    class Meta: model = Project; fields = "__all__"


class SceneSerializer(serializers.ModelSerializer):
    class Meta: model = Scene; fields = "__all__"


class CharacterSerializer(serializers.ModelSerializer):
    class Meta: model = Character; fields = "__all__"


class DialogueNodeSerializer(serializers.ModelSerializer):
    class Meta: model = DialogueNode; fields = "__all__"


class DialogueEdgeSerializer(serializers.ModelSerializer):
    class Meta: model = DialogueEdge; fields = "__all__"


class SkillCheckSerializer(serializers.ModelSerializer):
    class Meta: model = SkillCheck; fields = "__all__"


