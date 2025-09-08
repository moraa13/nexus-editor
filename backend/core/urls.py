from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    ProjectViewSet, UserProfileViewSet,
    GameProjectViewSet, DialogueNodeViewSet, DialogueLinkViewSet, CharacterStatViewSet,
    CharacterViewSet, NPCViewSet, DialogueViewSet, PostViewSet, generate_replicas,
)

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
urlpatterns = [
    path("generate_replicas/", generate_replicas),
]
urlpatterns += router.urls


