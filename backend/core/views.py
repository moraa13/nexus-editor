from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Project, UserProfile, GameProject, DialogueNode, DialogueLink, CharacterStat, Character, NPC, Dialogue, Post
from .serializers import (
    ProjectSerializer,
    UserProfileSerializer,
    GameProjectSerializer,
    DialogueNodeSerializer,
    DialogueLinkSerializer,
    CharacterStatSerializer,
    CharacterSerializer,
    NPCSerializer,
    DialogueSerializer,
    PostSerializer,
)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by("-created_at")
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]  # dev
    def perform_create(self, serializer):
        u = getattr(self.request, "user", None)
        serializer.save(owner=u if (u and u.is_authenticated) else None)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]  # dev


class GameProjectViewSet(viewsets.ModelViewSet):
    queryset = GameProject.objects.all().order_by("-created_at")
    serializer_class = GameProjectSerializer
    permission_classes = [permissions.AllowAny]


class DialogueNodeViewSet(viewsets.ModelViewSet):
    queryset = DialogueNode.objects.all().order_by("order", "-created_at")
    serializer_class = DialogueNodeSerializer
    permission_classes = [permissions.AllowAny]


class DialogueLinkViewSet(viewsets.ModelViewSet):
    queryset = DialogueLink.objects.all().order_by("-created_at")
    serializer_class = DialogueLinkSerializer
    permission_classes = [permissions.AllowAny]


class CharacterStatViewSet(viewsets.ModelViewSet):
    queryset = CharacterStat.objects.all().order_by("-created_at")
    serializer_class = CharacterStatSerializer
    permission_classes = [permissions.AllowAny]


class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all().order_by("-created_at")
    serializer_class = CharacterSerializer
    permission_classes = [permissions.AllowAny]


class NPCViewSet(viewsets.ModelViewSet):
    queryset = NPC.objects.all().order_by("-created_at")
    serializer_class = NPCSerializer
    permission_classes = [permissions.AllowAny]


class DialogueViewSet(viewsets.ModelViewSet):
    queryset = Dialogue.objects.all().order_by("-created_at")
    serializer_class = DialogueSerializer
    permission_classes = [permissions.AllowAny]


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by("order", "created_at")
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def generate_replicas(request):
    """Return 4 replicas for a character/dialogue.
    Input JSON: { character_id, dialogue_id }
    Output: { top: string, random: [string, string, string] }
    """
    data = request.data or {}
    character_id = data.get("character_id")
    dialogue_id = data.get("dialogue_id")
    # Fetch character and compute top stat name
    try:
        character = Character.objects.get(id=character_id)
    except Character.DoesNotExist:
        return Response({"error": "character not found"}, status=404)
    # Pick highest stat field
    stat_fields = [
        "logic","encyclopedia","rhetoric","drama","conceptualization","visual_calculus",
        "volition","inland_empire","empathy","authority","suggestion","espirit_de_corps",
        "endurance","pain_threshold","physical_instrument","electrochemistry","shivers","half_light",
        "hand_eye_coordination","perception","reaction_speed","savoir_faire","interfacing","composure",
    ]
    top_field = max(stat_fields, key=lambda f: getattr(character, f, 0))
    # Stub generation (SGR agent expected at http://localhost:8010/ later)
    top = f"[{top_field.replace('_',' ').title()}] Contextual reply for dialogue {dialogue_id}"
    random = [
        f"Variant {i+1} for dialogue {dialogue_id} by {character.name}"
        for i in range(3)
    ]
    return Response({"top": top, "random": random})
