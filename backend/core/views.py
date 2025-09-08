import random
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import (
    Project, UserProfile, GameProject, DialogueNode, DialogueLink, CharacterStat, 
    Character, NPC, Dialogue, Post, SkillCheck, DialogueOption, RollResult
)
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
    SkillCheckSerializer,
    DialogueOptionSerializer,
    RollResultSerializer,
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


class SkillCheckViewSet(viewsets.ModelViewSet):
    queryset = SkillCheck.objects.all().order_by("-created_at")
    serializer_class = SkillCheckSerializer
    permission_classes = [permissions.AllowAny]


class DialogueOptionViewSet(viewsets.ModelViewSet):
    queryset = DialogueOption.objects.all().order_by("order", "created_at")
    serializer_class = DialogueOptionSerializer
    permission_classes = [permissions.AllowAny]


class RollResultViewSet(viewsets.ModelViewSet):
    queryset = RollResult.objects.all().order_by("-created_at")
    serializer_class = RollResultSerializer
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


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def roll_skill_check(request):
    """Выполняет бросок кубика для skill check.
    Input JSON: { character_id, skill_check_id }
    Output: { roll_result, success, critical_success, critical_failure, result_text }
    """
    data = request.data or {}
    character_id = data.get("character_id")
    skill_check_id = data.get("skill_check_id")
    
    try:
        character = Character.objects.get(id=character_id)
        skill_check = SkillCheck.objects.get(id=skill_check_id)
    except (Character.DoesNotExist, SkillCheck.DoesNotExist) as e:
        return Response({"error": f"Character or SkillCheck not found: {str(e)}"}, status=404)
    
    # Получаем значение характеристики персонажа
    skill_value = getattr(character, skill_check.skill, 0)
    
    # Бросаем d20
    dice_roll = random.randint(1, 20)
    total = dice_roll + skill_value
    
    # Определяем результат
    dc_value = skill_check.get_dc_value()
    is_success = total >= dc_value
    is_critical_success = dice_roll == 20
    is_critical_failure = dice_roll == 1
    
    # Выбираем текст результата
    if is_critical_success:
        result_text = skill_check.critical_success_text or f"Critical Success! {skill_check.success_text}"
    elif is_critical_failure:
        result_text = skill_check.critical_failure_text or f"Critical Failure! {skill_check.failure_text}"
    elif is_success:
        result_text = skill_check.success_text or f"Success! You rolled {total} against DC {dc_value}"
    else:
        result_text = skill_check.failure_text or f"Failure! You rolled {total} against DC {dc_value}"
    
    # Сохраняем результат в базу данных
    roll_result = RollResult.objects.create(
        skill_check=skill_check,
        character=character,
        dice_roll=dice_roll,
        skill_value=skill_value,
        total=total,
        is_success=is_success,
        is_critical_success=is_critical_success,
        is_critical_failure=is_critical_failure,
        result_text=result_text
    )
    
    return Response({
        "roll_result_id": str(roll_result.id),
        "character_name": character.name,
        "skill": skill_check.skill,
        "dice_roll": dice_roll,
        "skill_value": skill_value,
        "total": total,
        "dc_value": dc_value,
        "is_success": is_success,
        "is_critical_success": is_critical_success,
        "is_critical_failure": is_critical_failure,
        "result_text": result_text
    })


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def get_character_skills(request, character_id):
    """Возвращает все характеристики персонажа.
    Output: { skill_name: value, ... }
    """
    try:
        character = Character.objects.get(id=character_id)
    except Character.DoesNotExist:
        return Response({"error": "Character not found"}, status=404)
    
    skills = {}
    skill_fields = [
        "logic", "encyclopedia", "rhetoric", "drama", "conceptualization", "visual_calculus",
        "volition", "inland_empire", "empathy", "authority", "suggestion", "espirit_de_corps",
        "endurance", "pain_threshold", "physical_instrument", "electrochemistry", "shivers", "half_light",
        "hand_eye_coordination", "perception", "reaction_speed", "savoir_faire", "interfacing", "composure",
    ]
    
    for field in skill_fields:
        skills[field] = getattr(character, field, 0)
    
    return Response({
        "character_name": character.name,
        "skills": skills
    })
