from django.contrib import admin
from .models import Project, Scene, Character, DialogueNode, DialogueEdge, SkillCheck

admin.site.register(Project)
admin.site.register(Scene)
admin.site.register(Character)
admin.site.register(DialogueNode)
admin.site.register(DialogueEdge)
admin.site.register(SkillCheck)


