from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    ProjectViewSet, SceneViewSet, CharacterViewSet,
    DialogueNodeViewSet, DialogueEdgeViewSet, SkillCheckViewSet, roll
)

router = DefaultRouter()
router.register("d/projects", ProjectViewSet)
router.register("d/scenes", SceneViewSet)
router.register("d/characters", CharacterViewSet)
router.register("d/nodes", DialogueNodeViewSet)
router.register("d/edges", DialogueEdgeViewSet)
router.register("d/checks", SkillCheckViewSet)

urlpatterns = [
    path("d/roll/", roll),
]
urlpatterns += router.urls


