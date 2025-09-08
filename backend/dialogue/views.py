import random
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Project, Scene, Character, DialogueNode, DialogueEdge, SkillCheck
from .serializers import (
    ProjectSerializer, SceneSerializer, CharacterSerializer,
    DialogueNodeSerializer, DialogueEdgeSerializer, SkillCheckSerializer
)


class BaseVS(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    ordering = ["-created_at"] if hasattr(object, "created_at") else []


class ProjectViewSet(BaseVS):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class SceneViewSet(BaseVS):
    queryset = Scene.objects.all()
    serializer_class = SceneSerializer


class CharacterViewSet(BaseVS):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer


class DialogueNodeViewSet(BaseVS):
    queryset = DialogueNode.objects.all()
    serializer_class = DialogueNodeSerializer


class DialogueEdgeViewSet(BaseVS):
    queryset = DialogueEdge.objects.all()
    serializer_class = DialogueEdgeSerializer


class SkillCheckViewSet(BaseVS):
    queryset = SkillCheck.objects.all()
    serializer_class = SkillCheckSerializer


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def roll(request):
    """
    Input: { "attribute":"motorics", "skill":"perception", "dc":12, "attr_val":2, "skill_val":2 }
    If attr_val/skill_val omitted, treat as 0.
    Output: { "d1":X, "d2":Y, "sum":X+Y, "total": sum+attr+skill, "success": bool }
    """
    data = request.data or {}
    d1, d2 = random.randint(1,6), random.randint(1,6)
    base = d1 + d2
    attr = int(data.get("attr_val", 0))
    skill = int(data.get("skill_val", 0))
    dc = int(data.get("dc", 10))
    total = base + attr + skill
    return Response({"d1": d1, "d2": d2, "sum": base, "total": total, "success": total >= dc})


