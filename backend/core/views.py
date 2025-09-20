import random
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from .quest_generator import quest_generator
from .models import (
    Project, UserProfile, GameProject, DialogueNode, DialogueLink, CharacterStat,
    Character, NPC, Dialogue, Post, SkillCheck, DialogueOption, RollResult,
    Quest, QuestObjective, QuestCharacter, DialogueLog, ExportSession, ExportTemplate
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
    QuestSerializer,
    QuestObjectiveSerializer,
    QuestCharacterSerializer,
    DialogueLogSerializer,
    ExportSessionSerializer,
    ExportTemplateSerializer,
)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by("-created_at")
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]  # TODO: Change to IsAuthenticated for production
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


# Quest System Viewsets

class QuestViewSet(viewsets.ModelViewSet):
    queryset = Quest.objects.all().order_by("-created_at")
    serializer_class = QuestSerializer
    permission_classes = [permissions.AllowAny]  # TODO: Change to IsAuthenticated for production
    
    def get_serializer_context(self):
        """Добавляем персонажа в контекст для проверки доступности"""
        context = super().get_serializer_context()
        character_id = self.request.query_params.get('character_id')
        if character_id:
            try:
                character = Character.objects.get(id=character_id)
                context['character'] = character
            except Character.DoesNotExist:
                pass
        return context


class QuestObjectiveViewSet(viewsets.ModelViewSet):
    queryset = QuestObjective.objects.all().order_by("order", "created_at")
    serializer_class = QuestObjectiveSerializer
    permission_classes = [permissions.AllowAny]  # TODO: Change to IsAuthenticated for production


class QuestCharacterViewSet(viewsets.ModelViewSet):
    queryset = QuestCharacter.objects.all().order_by("-created_at")
    serializer_class = QuestCharacterSerializer
    permission_classes = [permissions.AllowAny]  # TODO: Change to IsAuthenticated for production


class DialogueLogViewSet(viewsets.ModelViewSet):
    queryset = DialogueLog.objects.all().order_by("-created_at")
    serializer_class = DialogueLogSerializer
    permission_classes = [permissions.AllowAny]


# Export System Viewsets

class ExportSessionViewSet(viewsets.ModelViewSet):
    queryset = ExportSession.objects.all().order_by("-created_at")
    serializer_class = ExportSessionSerializer
    permission_classes = [permissions.AllowAny]


class ExportTemplateViewSet(viewsets.ModelViewSet):
    queryset = ExportTemplate.objects.all().order_by("-created_at")
    serializer_class = ExportTemplateSerializer
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
    
    # Validate required fields
    if not character_id:
        return Response({"error": "character_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    if not dialogue_id:
        return Response({"error": "dialogue_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Fetch character and compute top stat name
    try:
        character = Character.objects.get(id=character_id)
    except Character.DoesNotExist:
        return Response({"error": "character not found"}, status=status.HTTP_404_NOT_FOUND)
    except ValidationError:
        return Response({"error": "invalid character_id format"}, status=status.HTTP_400_BAD_REQUEST)
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
    
    # Validate required fields
    if not character_id:
        return Response({"error": "character_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    if not skill_check_id:
        return Response({"error": "skill_check_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        character = Character.objects.get(id=character_id)
        skill_check = SkillCheck.objects.get(id=skill_check_id)
    except Character.DoesNotExist:
        return Response({"error": "Character not found"}, status=status.HTTP_404_NOT_FOUND)
    except SkillCheck.DoesNotExist:
        return Response({"error": "SkillCheck not found"}, status=status.HTTP_404_NOT_FOUND)
    except ValidationError:
        return Response({"error": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)
    
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


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def get_dialogue_tree(request, dialogue_id):
    """Получает дерево диалога с ветвлением"""
    try:
        dialogue = Dialogue.objects.get(id=dialogue_id)
    except Dialogue.DoesNotExist:
        return Response({"error": "Dialogue not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Получаем персонажа из контекста
    character_id = request.query_params.get('character_id')
    character = None
    if character_id:
        try:
            character = Character.objects.get(id=character_id)
        except Character.DoesNotExist:
            pass
    
    # Создаем контекст для сериализатора
    context = {'character': character}
    
    # Сериализуем диалог с опциями
    serializer = DialogueSerializer(dialogue, context=context)
    
    return Response({
        "dialogue": serializer.data,
        "tree_structure": _build_dialogue_tree(dialogue, character)
    })


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def create_dialogue_branch(request):
    """Создает новую ветку диалога"""
    data = request.data or {}
    
    # Валидация
    parent_dialogue_id = data.get("parent_dialogue_id")
    option_id = data.get("option_id")
    new_dialogue_title = data.get("title")
    
    if not all([parent_dialogue_id, option_id, new_dialogue_title]):
        return Response(
            {"error": "parent_dialogue_id, option_id, and title are required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        parent_dialogue = Dialogue.objects.get(id=parent_dialogue_id)
        option = DialogueOption.objects.get(id=option_id)
    except (Dialogue.DoesNotExist, DialogueOption.DoesNotExist):
        return Response({"error": "Parent dialogue or option not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Создаем новый диалог
    new_dialogue = Dialogue.objects.create(
        title=new_dialogue_title,
        project=parent_dialogue.project
    )
    
    # Обновляем опцию для связи с новым диалогом
    option.next_dialogue = new_dialogue
    option.save()
    
    return Response({
        "new_dialogue_id": str(new_dialogue.id),
        "message": "Branch created successfully"
    }, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def start_quest(request):
    """Запускает квест для персонажа"""
    data = request.data or {}
    
    quest_id = data.get("quest_id")
    character_id = data.get("character_id")
    
    if not all([quest_id, character_id]):
        return Response(
            {"error": "quest_id and character_id are required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        quest = Quest.objects.get(id=quest_id)
        character = Character.objects.get(id=character_id)
    except (Quest.DoesNotExist, Character.DoesNotExist):
        return Response({"error": "Quest or Character not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if quest.start_quest(character):
        serializer = QuestSerializer(quest, context={'character': character})
        return Response({
            "quest": serializer.data,
            "message": "Quest started successfully"
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            "error": "Quest cannot be started",
            "reasons": {
                "available": quest.is_available_for_character(character),
                "can_start": quest.can_start(character)
            }
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def complete_quest(request):
    """Завершает квест"""
    data = request.data or {}
    
    quest_id = data.get("quest_id")
    
    if not quest_id:
        return Response(
            {"error": "quest_id is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        quest = Quest.objects.get(id=quest_id)
    except Quest.DoesNotExist:
        return Response({"error": "Quest not found"}, status=status.HTTP_404_NOT_FOUND)
    
    quest.complete_quest()
    serializer = QuestSerializer(quest)
    return Response({
        "quest": serializer.data,
        "message": "Quest completed successfully"
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def fail_quest(request):
    """Проваливает квест"""
    data = request.data or {}
    
    quest_id = data.get("quest_id")
    
    if not quest_id:
        return Response(
            {"error": "quest_id is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        quest = Quest.objects.get(id=quest_id)
    except Quest.DoesNotExist:
        return Response({"error": "Quest not found"}, status=status.HTTP_404_NOT_FOUND)
    
    quest.fail_quest()
    serializer = QuestSerializer(quest)
    return Response({
        "quest": serializer.data,
        "message": "Quest failed"
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def update_quest_progress(request):
    """Обновляет прогресс квеста"""
    data = request.data or {}
    
    quest_id = data.get("quest_id")
    progress_amount = data.get("progress_amount", 1)
    
    if not quest_id:
        return Response(
            {"error": "quest_id is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        quest = Quest.objects.get(id=quest_id)
    except Quest.DoesNotExist:
        return Response({"error": "Quest not found"}, status=status.HTTP_404_NOT_FOUND)
    
    quest.update_progress(progress_amount)
    serializer = QuestSerializer(quest)
    return Response({
        "quest": serializer.data,
        "message": f"Quest progress updated by {progress_amount}"
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def get_character_quests(request, character_id):
    """Получает квесты персонажа"""
    try:
        character = Character.objects.get(id=character_id)
    except Character.DoesNotExist:
        return Response({"error": "Character not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Получаем все квесты, связанные с персонажем
    available_quests = Quest.objects.filter(
        status='available',
        project=character.project
    )
    
    active_quests = Quest.objects.filter(
        status='active',
        assigned_character=character
    )
    
    completed_quests = Quest.objects.filter(
        status='completed',
        assigned_character=character
    )
    
    context = {'character': character}
    
    return Response({
        "available": QuestSerializer(available_quests, many=True, context=context).data,
        "active": QuestSerializer(active_quests, many=True, context=context).data,
        "completed": QuestSerializer(completed_quests, many=True, context=context).data,
    })


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def execute_dialogue_option(request):
    """Выполняет опцию диалога с квестовыми действиями"""
    data = request.data or {}
    
    option_id = data.get("option_id")
    character_id = data.get("character_id")
    
    if not all([option_id, character_id]):
        return Response(
            {"error": "option_id and character_id are required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        option = DialogueOption.objects.get(id=option_id)
        character = Character.objects.get(id=character_id)
    except (DialogueOption.DoesNotExist, Character.DoesNotExist):
        return Response({"error": "Option or Character not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Выполняем квестовые действия
    quest_actions = option.execute_quest_actions(character)
    
    # Логируем действие
    DialogueLog.objects.create(
        character=character,
        log_type='dialogue',
        author='Player',
        content=f"Selected option: {option.text}",
        result='success',
        metadata={'option_id': str(option.id), 'quest_actions': quest_actions}
    )
    
    return Response({
        "option": DialogueOptionSerializer(option).data,
        "quest_actions": quest_actions,
        "message": "Option executed successfully"
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def create_dialogue_option(request):
    """Создает новую опцию диалога"""
    data = request.data or {}
    
    # Валидация
    dialogue_id = data.get("dialogue_id")
    text = data.get("text")
    option_type = data.get("option_type", "response")
    
    if not all([dialogue_id, text]):
        return Response(
            {"error": "dialogue_id and text are required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        dialogue = Dialogue.objects.get(id=dialogue_id)
    except Dialogue.DoesNotExist:
        return Response({"error": "Dialogue not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Определяем порядок
    last_option = DialogueOption.objects.filter(dialogue=dialogue).order_by('-order').first()
    order = (last_option.order + 1) if last_option else 0
    
    # Создаем опцию
    option = DialogueOption.objects.create(
        dialogue=dialogue,
        text=text,
        option_type=option_type,
        order=order
    )
    
    # Обновляем пост, если указан
    post_id = data.get("post_id")
    if post_id:
        try:
            post = Post.objects.get(id=post_id)
            post.has_options = True
            post.is_branching_point = True
            post.save()
        except Post.DoesNotExist:
            pass
    
    serializer = DialogueOptionSerializer(option)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def generate_dialogue_result(request):
    """Генерирует результат диалога на основе броска d20 и характера персонажа.
    Input JSON: { dice_result, character_trait, quest_context, character_id }
    Output: { success, npc_response, player_options }
    """
    data = request.data or {}
    dice_result = data.get("dice_result", 10)
    character_trait = data.get("character_trait", "neutral")
    quest_context = data.get("quest_context", "")
    character_id = data.get("character_id")
    
    # Определяем успех (результат > 13)
    is_success = dice_result > 13
    
    # Получаем персонажа для контекста
    character = None
    if character_id:
        try:
            character = Character.objects.get(id=character_id)
        except Character.DoesNotExist:
            pass
    
    # Генерируем ответ NPC на основе результата и черт характера
    if is_success:
        if character_trait == "манипулятивный":
            npc_response = f"*Улыбается хитро* Отлично! Я вижу, что вы понимаете ситуацию. {quest_context}"
        elif character_trait == "наивный":
            npc_response = f"*Глаза загораются* О, как здорово! Вы действительно хотите помочь! {quest_context}"
        elif character_trait == "циничный":
            npc_response = f"*Пожимает плечами* Ну что ж, раз уж так получилось... {quest_context}"
        else:
            npc_response = f"*Кивает одобрительно* Хорошо, я вижу, что вы серьезно настроены. {quest_context}"
    else:
        if character_trait == "манипулятивный":
            npc_response = f"*Нахмуривается* Хм, я ожидал большего от вас. {quest_context}"
        elif character_trait == "наивный":
            npc_response = f"*Выглядит разочарованно* Ой, а я думал, что все будет проще... {quest_context}"
        elif character_trait == "циничный":
            npc_response = f"*Саркастично усмехается* Ну конечно, как и ожидалось. {quest_context}"
        else:
            npc_response = f"*Качает головой* Это не то, что я ожидал. {quest_context}"
    
    # Генерируем варианты ответов игрока
    player_options = []
    if is_success:
        player_options = [
            "Продолжайте, я слушаю внимательно.",
            "Это интересно, расскажите больше.",
            "Я готов помочь в этом деле.",
            "Давайте обсудим детали."
        ]
    else:
        player_options = [
            "Извините, я попробую еще раз.",
            "Может быть, есть другой способ?",
            "Я не совсем понял, объясните еще раз.",
            "Дайте мне время подумать."
        ]
    
    return Response({
        "success": is_success,
        "dice_result": dice_result,
        "npc_response": npc_response,
        "player_options": player_options,
        "character_trait": character_trait
    })


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def generate_player_responses(request):
    """Генерирует варианты ответов игрока на основе контекста.
    Input JSON: { character_id, quest_id, npc_response, character_traits }
    Output: { responses: [{ text, requires_roll, skill_type }] }
    """
    data = request.data or {}
    character_id = data.get("character_id")
    quest_id = data.get("quest_id")
    npc_response = data.get("npc_response", "")
    character_traits = data.get("character_traits", [])
    
    # Получаем персонажа
    character = None
    if character_id:
        try:
            character = Character.objects.get(id=character_id)
        except Character.DoesNotExist:
            pass
    
    # Генерируем ответы на основе черт характера
    responses = []
    
    if "манипулятивный" in character_traits:
        responses.append({
            "text": "Я вижу, что вы пытаетесь меня обмануть. Давайте говорить честно.",
            "requires_roll": True,
            "skill_type": "empathy"
        })
    
    if "наивный" in character_traits:
        responses.append({
            "text": "О, конечно! Я верю каждому вашему слову!",
            "requires_roll": False,
            "skill_type": None
        })
    
    if "агрессивный" in character_traits:
        responses.append({
            "text": "Хватит болтать! Скажите прямо, что вам нужно!",
            "requires_roll": True,
            "skill_type": "authority"
        })
    
    if "миролюбивый" in character_traits:
        responses.append({
            "text": "Давайте решим это мирно, без конфликтов.",
            "requires_roll": False,
            "skill_type": None
        })
    
    # Добавляем универсальные ответы
    responses.extend([
        {
            "text": "Интересно. Расскажите подробнее.",
            "requires_roll": True,
            "skill_type": "logic"
        },
        {
            "text": "Я понимаю вашу позицию.",
            "requires_roll": False,
            "skill_type": None
        }
    ])
    
    return Response({
        "responses": responses[:4],  # Максимум 4 варианта
        "character_name": character.name if character else "Unknown"
    })


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def log_dialogue_event(request):
    """Добавляет событие в лог диалога.
    Input JSON: { quest_id, character_id, log_type, author, content, result, metadata }
    """
    data = request.data or {}
    
    quest = None
    if data.get("quest_id"):
        try:
            quest = Quest.objects.get(id=data["quest_id"])
        except Quest.DoesNotExist:
            pass
    
    character = None
    if data.get("character_id"):
        try:
            character = Character.objects.get(id=data["character_id"])
        except Character.DoesNotExist:
            pass
    
    log_entry = DialogueLog.objects.create(
        quest=quest,
        character=character,
        log_type=data.get("log_type", "dialogue"),
        author=data.get("author", "Unknown"),
        content=data.get("content", ""),
        result=data.get("result", ""),
        metadata=data.get("metadata", {})
    )
    
    return Response({
        "log_id": str(log_entry.id),
        "created_at": log_entry.created_at,
        "message": "Event logged successfully"
    })


# Export System API Views

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def export_project(request):
    """Экспортирует проект в выбранном формате.
    Input JSON: { project_id, format_type, export_options }
    Output: { export_session_id, download_url }
    """
    import json
    import yaml
    import csv
    import io
    import os
    from django.http import HttpResponse
    from django.conf import settings
    
    data = request.data or {}
    project_id = data.get("project_id")
    format_type = data.get("format_type", "json")
    export_options = data.get("export_options", {})
    
    try:
        project = GameProject.objects.get(id=project_id)
    except GameProject.DoesNotExist:
        return Response({"error": "Project not found"}, status=404)
    
    # Создаем сессию экспорта
    export_session = ExportSession.objects.create(
        project=project,
        format_type=format_type,
        export_options=export_options,
        status="processing"
    )
    
    try:
        # Генерируем данные для экспорта
        export_data = _generate_export_data(project, format_type, export_options)
        
        # Сохраняем файл
        file_path = _save_export_file(export_data, project, format_type, export_session.id)
        
        # Обновляем сессию
        export_session.status = "completed"
        export_session.file_path = file_path
        export_session.file_size = len(export_data.encode('utf-8'))
        export_session.save()
        
        return Response({
            "export_session_id": str(export_session.id),
            "download_url": f"/api/export/download/{export_session.id}/",
            "status": "completed",
            "file_size": export_session.file_size
        })
        
    except Exception as e:
        export_session.status = "failed"
        export_session.error_message = str(e)
        export_session.save()
        
        return Response({
            "error": f"Export failed: {str(e)}",
            "export_session_id": str(export_session.id)
        }, status=500)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def download_export(request, export_session_id):
    """Скачивает экспортированный файл."""
    try:
        export_session = ExportSession.objects.get(id=export_session_id)
    except ExportSession.DoesNotExist:
        return Response({"error": "Export session not found"}, status=404)
    
    if export_session.status != "completed":
        return Response({"error": "Export not ready"}, status=400)
    
    try:
        with open(export_session.file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Определяем MIME тип
        mime_types = {
            'json': 'application/json',
            'yaml': 'application/x-yaml',
            'xml': 'application/xml',
            'csv': 'text/csv',
            'unity': 'text/plain',
            'unreal': 'text/plain',
            'godot': 'text/plain',
            'renpy': 'text/plain',
            'twine': 'application/xml',
        }
        
        mime_type = mime_types.get(export_session.format_type, 'text/plain')
        filename = f"{export_session.project.name}_export.{export_session.format_type}"
        
        response = HttpResponse(content, content_type=mime_type)
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
        
    except Exception as e:
        return Response({"error": f"Download failed: {str(e)}"}, status=500)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def get_export_templates(request):
    """Возвращает доступные шаблоны экспорта."""
    templates = ExportTemplate.objects.all()
    serializer = ExportTemplateSerializer(templates, many=True)
    return Response(serializer.data)


def _generate_export_data(project, format_type, export_options):
    """Генерирует данные для экспорта в выбранном формате."""
    
    # Собираем все данные проекта
    project_data = {
        "project": {
            "id": str(project.id),
            "name": project.name,
            "description": project.description,
            "created_at": project.created_at.isoformat(),
            "updated_at": project.updated_at.isoformat(),
        },
        "characters": [],
        "dialogues": [],
        "quests": [],
        "skill_checks": [],
        "dialogue_logs": [],
    }
    
    # Персонажи
    characters = Character.objects.all()
    for char in characters:
        char_data = {
            "id": str(char.id),
            "name": char.name,
            "portrait": char.portrait,
            "skills": {
                "logic": char.logic,
                "encyclopedia": char.encyclopedia,
                "rhetoric": char.rhetoric,
                "drama": char.drama,
                "conceptualization": char.conceptualization,
                "visual_calculus": char.visual_calculus,
                "volition": char.volition,
                "inland_empire": char.inland_empire,
                "empathy": char.empathy,
                "authority": char.authority,
                "suggestion": char.suggestion,
                "espirit_de_corps": char.espirit_de_corps,
                "endurance": char.endurance,
                "pain_threshold": char.pain_threshold,
                "physical_instrument": char.physical_instrument,
                "electrochemistry": char.electrochemistry,
                "shivers": char.shivers,
                "half_light": char.half_light,
                "hand_eye_coordination": char.hand_eye_coordination,
                "perception": char.perception,
                "reaction_speed": char.reaction_speed,
                "savoir_faire": char.savoir_faire,
                "interfacing": char.interfacing,
                "composure": char.composure,
            }
        }
        project_data["characters"].append(char_data)
    
    # Диалоги
    dialogues = Dialogue.objects.filter(project=project)
    for dialogue in dialogues:
        dialogue_data = {
            "id": str(dialogue.id),
            "title": dialogue.title,
            "posts": [],
            "skill_checks": [],
            "options": [],
        }
        
        # Посты диалога
        posts = Post.objects.filter(dialogue=dialogue).order_by('order')
        for post in posts:
            post_data = {
                "id": str(post.id),
                "speaker": post.speaker,
                "text": post.text,
                "is_generated": post.is_generated,
                "order": post.order,
            }
            dialogue_data["posts"].append(post_data)
        
        # Skill checks для диалога
        skill_checks = SkillCheck.objects.filter(dialogue=dialogue)
        for skill_check in skill_checks:
            skill_data = {
                "id": str(skill_check.id),
                "skill": skill_check.skill,
                "difficulty": skill_check.difficulty,
                "dc_value": skill_check.get_dc_value(),
                "description": skill_check.description,
                "success_text": skill_check.success_text,
                "failure_text": skill_check.failure_text,
                "critical_success_text": skill_check.critical_success_text,
                "critical_failure_text": skill_check.critical_failure_text,
            }
            dialogue_data["skill_checks"].append(skill_data)
        
        # Опции диалога
        options = DialogueOption.objects.filter(dialogue=dialogue).order_by('order')
        for option in options:
            option_data = {
                "id": str(option.id),
                "text": option.text,
                "order": option.order,
                "is_available": option.is_available,
                "skill_check_id": str(option.skill_check.id) if option.skill_check else None,
            }
            dialogue_data["options"].append(option_data)
        
        project_data["dialogues"].append(dialogue_data)
    
    # Квесты
    quests = Quest.objects.filter(project=project)
    for quest in quests:
        quest_data = {
            "id": str(quest.id),
            "title": quest.title,
            "description": quest.description,
            "quest_type": quest.quest_type,
            "difficulty_level": quest.difficulty_level,
            "status": quest.status,
            "assigned_character_id": str(quest.assigned_character.id) if quest.assigned_character else None,
            "dialogue_id": str(quest.dialogue.id) if quest.dialogue else None,
        }
        project_data["quests"].append(quest_data)
    
    # Логи диалогов
    logs = DialogueLog.objects.filter(quest__project=project)
    for log in logs:
        log_data = {
            "id": str(log.id),
            "log_type": log.log_type,
            "author": log.author,
            "content": log.content,
            "result": log.result,
            "metadata": log.metadata,
            "created_at": log.created_at.isoformat(),
        }
        project_data["dialogue_logs"].append(log_data)
    
    # Форматируем данные в зависимости от типа экспорта
    if format_type == "json":
        return json.dumps(project_data, indent=2, ensure_ascii=False)
    
    elif format_type == "yaml":
        return yaml.dump(project_data, default_flow_style=False, allow_unicode=True)
    
    elif format_type == "csv":
        # Создаем CSV для персонажей
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Заголовки для персонажей
        writer.writerow(["Character ID", "Name", "Logic", "Empathy", "Authority", "Endurance"])
        for char in project_data["characters"]:
            writer.writerow([
                char["id"],
                char["name"],
                char["skills"]["logic"],
                char["skills"]["empathy"],
                char["skills"]["authority"],
                char["skills"]["endurance"]
            ])
        
        return output.getvalue()
    
    elif format_type == "unity":
        # Unity ScriptableObject формат
        unity_data = f"""using UnityEngine;

[CreateAssetMenu(fileName = "{project.name}", menuName = "Game Data/{project.name}")]
public class {project.name.replace(' ', '')}Data : ScriptableObject
{{
    [Header("Project Info")]
    public string projectName = "{project.name}";
    public string description = "{project.description}";
    
    [Header("Characters")]
    public CharacterData[] characters;
    
    [Header("Dialogues")]
    public DialogueData[] dialogues;
    
    [Header("Quests")]
    public QuestData[] quests;
}}

[System.Serializable]
public class CharacterData
{{
    public string id;
    public string name;
    public string portrait;
    public int logic;
    public int empathy;
    public int authority;
    public int endurance;
}}

[System.Serializable]
public class DialogueData
{{
    public string id;
    public string title;
    public DialoguePost[] posts;
}}

[System.Serializable]
public class DialoguePost
{{
    public string speaker;
    public string text;
    public bool isGenerated;
}}

[System.Serializable]
public class QuestData
{{
    public string id;
    public string title;
    public string description;
    public string questType;
    public int difficultyLevel;
}}"""
        return unity_data
    
    elif format_type == "unreal":
        # Unreal Engine Data Table формат
        unreal_data = f"""# Unreal Engine Data Table for {project.name}

# Characters Data Table
--- Characters ---
CharacterID,CharacterName,Logic,Empathy,Authority,Endurance
"""
        for char in project_data["characters"]:
            unreal_data += f"{char['id']},{char['name']},{char['skills']['logic']},{char['skills']['empathy']},{char['skills']['authority']},{char['skills']['endurance']}\n"
        
        unreal_data += "\n# Dialogues Data Table\n"
        unreal_data += "DialogueID,DialogueTitle,PostCount\n"
        for dialogue in project_data["dialogues"]:
            unreal_data += f"{dialogue['id']},{dialogue['title']},{len(dialogue['posts'])}\n"
        
        return unreal_data
    
    else:
        # По умолчанию возвращаем JSON
        return json.dumps(project_data, indent=2, ensure_ascii=False)


def _build_dialogue_tree(dialogue, character=None):
    """Строит дерево диалога для визуализации"""
    tree = {
        "id": str(dialogue.id),
        "title": dialogue.title,
        "posts": [],
        "branches": []
    }
    
    # Добавляем посты
    for post in dialogue.posts.all():
        post_data = {
            "id": str(post.id),
            "speaker": post.speaker,
            "text": post.text,
            "post_type": post.post_type,
            "has_options": post.has_options,
            "is_branching_point": post.is_branching_point,
            "color": post.color,
            "icon": post.icon,
            "options": []
        }
        
        # Добавляем опции для поста
        if post.has_options:
            for option in post.get_available_options(character):
                option_data = {
                    "id": str(option.id),
                    "text": option.text,
                    "option_type": option.option_type,
                    "color": option.color,
                    "icon": option.icon,
                    "is_accessible": option.is_accessible(character),
                    "next_dialogue_id": str(option.next_dialogue.id) if option.next_dialogue else None,
                    "next_post_id": str(option.next_post.id) if option.next_post else None,
                }
                post_data["options"].append(option_data)
        
        tree["posts"].append(post_data)
    
    return tree


def _save_export_file(export_data, project, format_type, export_session_id):
    """Сохраняет экспортированные данные в файл."""
    import os
    from django.conf import settings
    
    # Создаем директорию для экспорта если её нет
    export_dir = os.path.join(settings.BASE_DIR, 'exports')
    os.makedirs(export_dir, exist_ok=True)
    
    # Генерируем имя файла
    filename = f"{project.name.replace(' ', '_')}_export_{export_session_id}.{format_type}"
    file_path = os.path.join(export_dir, filename)
    
    # Сохраняем файл
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(export_data)
    
    return file_path


# CORS Test endpoint
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def cors_test(request):
    """
    Simple endpoint to test CORS configuration
    """
    return Response({
        'success': True,
        'message': 'CORS is working!',
        'origin': request.META.get('HTTP_ORIGIN', 'Unknown'),
        'method': request.method
    })


# Quest Generation API
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def generate_quest(request):
    """
    Generate AI-powered quest steps
    """
    try:
        data = request.data
        
        # Validate required fields
        character = data.get('character', {})
        if not character:
            return Response(
                {'error': 'Character data is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Build context for quest generation
        context = {
            'character': character,
            'current_step': data.get('current_step', 0),
            'previous_choices': data.get('previous_choices', []),
            'quest_theme': data.get('quest_theme', 'Детективное расследование в стиле Disco Elysium'),
            'difficulty': data.get('difficulty', 'medium')
        }
        
        # Generate quest steps
        step_count = data.get('step_count', 2)  # Default 2 steps for demo
        quest_steps = quest_generator.generate_full_quest(context, step_count)
        
        return Response({
            'success': True,
            'quest_steps': quest_steps,
            'context': context
        })
        
    except Exception as e:
        return Response(
            {'error': f'Quest generation failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def generate_quest_step(request):
    """
    Generate a single quest step
    """
    try:
        data = request.data
        
        # Validate required fields
        character = data.get('character', {})
        if not character:
            return Response(
                {'error': 'Character data is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Build context for quest generation
        context = {
            'character': character,
            'current_step': data.get('current_step', 0),
            'previous_choices': data.get('previous_choices', []),
            'quest_theme': data.get('quest_theme', 'Детективное расследование в стиле Disco Elysium'),
            'difficulty': data.get('difficulty', 'medium')
        }
        
        # Generate single quest step
        quest_step = quest_generator.generate_quest_step(context)
        
        return Response({
            'success': True,
            'quest_step': quest_step,
            'context': context
        })
        
    except Exception as e:
        return Response(
            {'error': f'Quest step generation failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# AI Agents Chat endpoint
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def ai_chat(request):
    """
    AI Agents chat endpoint
    POST /api/ai/chat/
    """
    try:
        message = request.data.get('message', '')
        context = request.data.get('context', {})
        agent_type = request.data.get('agent_type')  # Опциональный выбор агента
        
        if not message:
            return Response({'error': 'Message is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Используем систему агентов
        from .ai_agents import agent_manager, AgentType
        
        # Если указан конкретный агент
        selected_agent = None
        if agent_type:
            try:
                selected_agent = AgentType(agent_type)
            except ValueError:
                return Response({'error': f'Invalid agent type: {agent_type}'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Получаем ответ от агента
        response = agent_manager.get_response(message, context, selected_agent)

        return Response({
            'reply': response['message'],
            'agent_type': response['selected_agent'],
            'success': response['success'],
            'model': response['model']
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Project State Management API
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def create_project(request):
    """Создать новый проект"""
    try:
        from .project_db_manager import project_db_manager
        
        data = request.data
        name = data.get('name', 'Новый проект')
        genre = data.get('genre', '')
        setting = data.get('setting', '')
        
        project = project_db_manager.create_project(name, genre, setting)
        
        return Response({
            'project': project_db_manager.get_project_summary(),
            'message': 'Проект создан успешно'
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_project_state(request):
    """Получить состояние текущего проекта"""
    try:
        from .project_db_manager import project_db_manager
        
        project_summary = project_db_manager.get_project_summary()
        
        if not project_summary:
            return Response({
                'project': None,
                'message': 'Проект не создан'
            })
        
        return Response({
            'project': project_summary,
            'message': 'Состояние проекта получено'
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def update_project_phase(request):
    """Обновить этап разработки проекта"""
    try:
        from .project_db_manager import project_db_manager
        
        data = request.data
        phase = data.get('phase')
        
        if not phase:
            return Response({'error': 'Phase is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        valid_phases = ['idea', 'world', 'character', 'scene', 'dialogue', 'branch', 'testplay']
        if phase not in valid_phases:
            return Response({'error': f'Invalid phase: {phase}'}, status=status.HTTP_400_BAD_REQUEST)
        
        success = project_db_manager.update_session(phase=phase)
        
        if success:
            return Response({
                'phase': phase,
                'message': f'Этап обновлен на {phase}'
            })
        else:
            return Response({'error': 'Проект не найден'}, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def set_current_project(request):
    """Установить текущий проект"""
    try:
        from .project_db_manager import project_db_manager
        
        data = request.data
        session_id = data.get('session_id')
        
        if not session_id:
            return Response({'error': 'session_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        success = project_db_manager.set_current_session(session_id)
        
        if success:
            return Response({
                'session_id': session_id,
                'project': project_db_manager.get_project_summary(),
                'message': 'Проект установлен как текущий'
            })
        else:
            return Response({'error': 'Проект не найден'}, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def list_projects(request):
    """Получить список всех проектов"""
    try:
        from .project_db_manager import project_db_manager
        
        projects = project_db_manager.list_sessions()
        
        return Response({
            'projects': projects,
            'message': f'Найдено {len(projects)} проектов'
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
