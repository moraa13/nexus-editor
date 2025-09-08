from django.db import models
from django.conf import settings
import uuid

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


class Character(TimeStamped):
    id = UUID(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey("dialogue.Project", on_delete=models.CASCADE, related_name="characters")
    name = models.CharField(max_length=120)
    portrait = models.URLField(blank=True)

    # 4 ATTRS (base 1..6 typical)
    intellect = models.IntegerField(default=2)
    psyche = models.IntegerField(default=2)
    physique = models.IntegerField(default=2)
    motorics = models.IntegerField(default=2)

    # 24 skills (defaults 2)
    logic = models.IntegerField(default=2)
    encyclopedia = models.IntegerField(default=2)
    rhetoric = models.IntegerField(default=2)
    drama = models.IntegerField(default=2)
    conceptualization = models.IntegerField(default=2)
    visual_calculus = models.IntegerField(default=2)

    volition = models.IntegerField(default=2)
    inland_empire = models.IntegerField(default=2)
    empathy = models.IntegerField(default=2)
    authority = models.IntegerField(default=2)
    suggestion = models.IntegerField(default=2)
    espirit_de_corps = models.IntegerField(default=2)

    endurance = models.IntegerField(default=2)
    pain_threshold = models.IntegerField(default=2)
    physical_instrument = models.IntegerField(default=2)
    electrochemistry = models.IntegerField(default=2)
    shivers = models.IntegerField(default=2)
    half_light = models.IntegerField(default=2)

    hand_eye_coordination = models.IntegerField(default=2)
    perception = models.IntegerField(default=2)
    reaction_speed = models.IntegerField(default=2)
    savoir_faire = models.IntegerField(default=2)
    interfacing = models.IntegerField(default=2)
    composure = models.IntegerField(default=2)

    def __str__(self): return self.name


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


