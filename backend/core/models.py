import uuid
from django.conf import settings
from django.db import models

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class UUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    class Meta:
        abstract = True

class BaseModel(UUIDModel, TimeStampedModel):
    class Meta:
        abstract = True

class UserProfile(BaseModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=150, blank=True)
    bio = models.TextField(blank=True)
    def __str__(self): 
        return self.display_name or self.user.get_username()

class Project(BaseModel):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name="projects",
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    def __str__(self):
        return self.title
