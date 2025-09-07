from rest_framework import serializers
from .models import Project, UserProfile

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "title", "description", "created_at", "updated_at"]

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id", "user", "display_name", "bio", "created_at", "updated_at"]
        read_only_fields = ["user"]
