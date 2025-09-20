from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    ProjectViewSet, UserProfileViewSet,
    GameProjectViewSet, DialogueNodeViewSet, DialogueLinkViewSet, CharacterStatViewSet,
    CharacterViewSet, NPCViewSet, DialogueViewSet, PostViewSet, 
    SkillCheckViewSet, DialogueOptionViewSet, RollResultViewSet,
    QuestViewSet, QuestObjectiveViewSet, QuestCharacterViewSet, DialogueLogViewSet,
    ExportSessionViewSet, ExportTemplateViewSet,
    generate_replicas, roll_skill_check, get_character_skills,
    generate_dialogue_result, generate_player_responses, log_dialogue_event,
    export_project, download_export, get_export_templates,
    get_dialogue_tree, create_dialogue_branch, create_dialogue_option,
    start_quest, complete_quest, fail_quest, update_quest_progress,
    get_character_quests, execute_dialogue_option,
    generate_quest, generate_quest_step, cors_test,
)
from .auth_views import login, register, logout, user_profile
from .chat_views import generate_chat_response

router = DefaultRouter()
router.register("projects", ProjectViewSet, basename="project")
router.register("profiles", UserProfileViewSet, basename="profile")
router.register("game-projects", GameProjectViewSet, basename="gameproject")
router.register("dialogue-nodes", DialogueNodeViewSet, basename="dialoguenode")
router.register("dialogue-links", DialogueLinkViewSet, basename="dialoguelink")
router.register("character-stats", CharacterStatViewSet, basename="characterstat")
router.register("characters", CharacterViewSet, basename="character")
router.register("npcs", NPCViewSet, basename="npc")
router.register("dialogues", DialogueViewSet, basename="dialogue")
router.register("posts", PostViewSet, basename="post")
router.register("skill-checks", SkillCheckViewSet, basename="skillcheck")
router.register("dialogue-options", DialogueOptionViewSet, basename="dialogueoption")
router.register("roll-results", RollResultViewSet, basename="rollresult")
router.register("quests", QuestViewSet, basename="quest")
router.register("quest-objectives", QuestObjectiveViewSet, basename="quest-objective")
router.register("quest-characters", QuestCharacterViewSet, basename="questcharacter")
router.register("dialogue-logs", DialogueLogViewSet, basename="dialoguelog")
router.register("export-sessions", ExportSessionViewSet, basename="exportsession")
router.register("export-templates", ExportTemplateViewSet, basename="exporttemplate")

urlpatterns = [
    # Authentication endpoints
    path("auth/login/", login),
    path("auth/register/", register),
    path("auth/logout/", logout),
    path("auth/profile/", user_profile),
    
    # Game endpoints
    path("generate_replicas/", generate_replicas),
    path("roll_skill_check/", roll_skill_check),
    path("characters/<uuid:character_id>/skills/", get_character_skills),
    path("generate_dialogue_result/", generate_dialogue_result),
    path("generate_player_responses/", generate_player_responses),
    path("log_dialogue_event/", log_dialogue_event),
    
    # Dialogue branching endpoints
    path("dialogues/<uuid:dialogue_id>/tree/", get_dialogue_tree),
    path("dialogues/branch/", create_dialogue_branch),
    path("dialogues/option/", create_dialogue_option),
    path("dialogues/option/execute/", execute_dialogue_option),
    
    # Quest management endpoints
    path("quests/start/", start_quest),
    path("quests/complete/", complete_quest),
    path("quests/fail/", fail_quest),
    path("quests/progress/", update_quest_progress),
    path("characters/<uuid:character_id>/quests/", get_character_quests),
    
    # Export endpoints
    path("export/project/", export_project),
    path("export/download/<uuid:export_session_id>/", download_export),
    path("export/templates/", get_export_templates),
    
    # Quest generation endpoints
    path("quests/generate/", generate_quest),
    path("quests/generate-step/", generate_quest_step),
    
    # CORS test endpoint
    path("cors-test/", cors_test),
    path("chat/generate/", generate_chat_response),
]
urlpatterns += router.urls


