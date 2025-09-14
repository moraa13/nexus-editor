from django.db import models
from django.conf import settings
import uuid

# Import the unified Character model from core
from core.models import Character

UUID = models.UUIDField

ATTRS = (
    ("intellect","Intellect"),
    ("psyche","Psyche"),
    ("physique","Physique"),
    ("motorics","Motorics"),
)

SKILLS = tuple(
    (s, s.replace("_"," ").title()) for s in [
        # Intellect
        "logic","encyclopedia","rhetoric","drama","conceptualization","visual_calculus",
        # Psyche
        "volition","inland_empire","empathy","authority","suggestion","espirit_de_corps",
        # Physique
        "endurance","pain_threshold","physical_instrument","electrochemistry","shivers","half_light",
        # Motorics
        "hand_eye_coordination","perception","reaction_speed","savoir_faire","interfacing","composure",
    ]
)

CHECK_TYPES = (("white","white"),("red","red"))


class TimeStamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True


class Project(models.Model):
    """
    Soft reference to core.Project to avoid hard import; use owner/title only if core absent.
    If core.Project exists, you can swap this model later, but for now keep a local minimal Project for linking.
    """
    id = UUID(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)

    def __str__(self): return self.title


class Scene(TimeStamped):
    id = UUID(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey("dialogue.Project", on_delete=models.CASCADE, related_name="scenes")
    name = models.CharField(max_length=200)
    meta = models.JSONField(default=dict, blank=True)  # tile layers, bg, etc.

    def __str__(self): return self.name


# Character model moved to core.models.Character
# Import it with: from core.models import Character


class DialogueNode(TimeStamped):
    id = UUID(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey("dialogue.Project", on_delete=models.CASCADE, related_name="nodes")
    scene = models.ForeignKey(Scene, on_delete=models.SET_NULL, null=True, blank=True, related_name="nodes")
    speaker = models.CharField(max_length=120, blank=True)  # e.g. "player" or "npc:kim"
    text = models.TextField()
    data = models.JSONField(default=dict, blank=True)  # choices, flags, etc.

    def __str__(self): return f"{self.speaker or '—'}: {self.text[:40]}"


class DialogueEdge(TimeStamped):
    id = UUID(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey("dialogue.Project", on_delete=models.CASCADE, related_name="edges")
    from_node = models.ForeignKey(DialogueNode, on_delete=models.CASCADE, related_name="out")
    to_node = models.ForeignKey(DialogueNode, on_delete=models.CASCADE, related_name="inc")
    conditions = models.JSONField(default=list, blank=True)  # e.g. ["flag:met_kim"]


class SkillCheck(TimeStamped):
    id = UUID(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey("dialogue.Project", on_delete=models.CASCADE, related_name="checks")
    node = models.ForeignKey(DialogueNode, on_delete=models.CASCADE, related_name="checks")
    kind = models.CharField(max_length=5, choices=CHECK_TYPES, default="white")
    attribute = models.CharField(max_length=12, choices=ATTRS)
    skill = models.CharField(max_length=32, choices=SKILLS)
    dc = models.IntegerField(default=10)


