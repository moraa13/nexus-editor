from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, UserProfileViewSet

router = DefaultRouter()
router.register("projects", ProjectViewSet, basename="project")
router.register("profiles", UserProfileViewSet, basename="profile")
urlpatterns = router.urls


