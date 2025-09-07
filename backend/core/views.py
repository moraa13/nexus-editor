from rest_framework import viewsets, permissions
from .models import Project, UserProfile
from .serializers import ProjectSerializer, UserProfileSerializer

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
