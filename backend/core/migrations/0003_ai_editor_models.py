# Generated migration for AI editor models
import uuid
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0002_game_dialogue_models"),
    ]

    operations = [
        migrations.CreateModel(
            name="Character",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("id", models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)),
                ("name", models.CharField(max_length=200)),
                ("portrait", models.URLField(blank=True)),
                ("logic", models.IntegerField(default=2)),
                ("encyclopedia", models.IntegerField(default=2)),
                ("rhetoric", models.IntegerField(default=2)),
                ("drama", models.IntegerField(default=2)),
                ("conceptualization", models.IntegerField(default=2)),
                ("visual_calculus", models.IntegerField(default=2)),
                ("volition", models.IntegerField(default=2)),
                ("inland_empire", models.IntegerField(default=2)),
                ("empathy", models.IntegerField(default=2)),
                ("authority", models.IntegerField(default=2)),
                ("suggestion", models.IntegerField(default=2)),
                ("espirit_de_corps", models.IntegerField(default=2)),
                ("endurance", models.IntegerField(default=2)),
                ("pain_threshold", models.IntegerField(default=2)),
                ("physical_instrument", models.IntegerField(default=2)),
                ("electrochemistry", models.IntegerField(default=2)),
                ("shivers", models.IntegerField(default=2)),
                ("half_light", models.IntegerField(default=2)),
                ("hand_eye_coordination", models.IntegerField(default=2)),
                ("perception", models.IntegerField(default=2)),
                ("reaction_speed", models.IntegerField(default=2)),
                ("savoir_faire", models.IntegerField(default=2)),
                ("interfacing", models.IntegerField(default=2)),
                ("composure", models.IntegerField(default=2)),
            ],
            options={"abstract": False},
        ),
        migrations.CreateModel(
            name="NPC",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("id", models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)),
                ("name", models.CharField(max_length=200)),
                ("behavior", models.JSONField(blank=True, default=dict)),
            ],
            options={"abstract": False},
        ),
        migrations.CreateModel(
            name="Dialogue",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("id", models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)),
                ("title", models.CharField(max_length=200)),
                (
                    "project",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="dialogues", to="core.gameproject"),
                ),
            ],
            options={"abstract": False},
        ),
        migrations.CreateModel(
            name="Post",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("id", models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)),
                ("speaker", models.CharField(blank=True, max_length=200)),
                ("text", models.TextField()),
                ("is_generated", models.BooleanField(default=False)),
                ("order", models.IntegerField(default=0)),
                ("dialogue", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="posts", to="core.dialogue")),
            ],
            options={"ordering": ["order", "created_at"], "abstract": False},
        ),
        migrations.AddField(
            model_name="dialogue",
            name="characters",
            field=models.ManyToManyField(blank=True, related_name="dialogues", to="core.character"),
        ),
    ]



