from django.contrib import admin
from .models import (
    Project, UserProfile, GameProject, DialogueNode, DialogueLink, CharacterStat,
    Character, NPC, Dialogue, Post, SkillCheck, DialogueOption, RollResult,
    Quest, QuestCharacter, DialogueLog
)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'created_at']
    list_filter = ['created_at']
    search_fields = ['title', 'description']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'user', 'created_at']
    search_fields = ['display_name', 'user__username']

@admin.register(GameProject)
class GameProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']

@admin.register(Character)
class CharacterAdmin(admin.ModelAdmin):
    list_display = ['name', 'logic', 'empathy', 'authority', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name']
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'portrait')
        }),
        ('Intellect', {
            'fields': ('logic', 'encyclopedia', 'rhetoric', 'drama', 'conceptualization', 'visual_calculus')
        }),
        ('Psyche', {
            'fields': ('volition', 'inland_empire', 'empathy', 'authority', 'suggestion', 'espirit_de_corps')
        }),
        ('Physique', {
            'fields': ('endurance', 'pain_threshold', 'physical_instrument', 'electrochemistry', 'shivers', 'half_light')
        }),
        ('Motorics', {
            'fields': ('hand_eye_coordination', 'perception', 'reaction_speed', 'savoir_faire', 'interfacing', 'composure')
        }),
    )

@admin.register(NPC)
class NPCAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

@admin.register(Dialogue)
class DialogueAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'created_at']
    list_filter = ['created_at', 'project']
    search_fields = ['title']
    filter_horizontal = ['characters']

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['speaker', 'dialogue', 'order', 'is_generated', 'created_at']
    list_filter = ['is_generated', 'created_at', 'dialogue']
    search_fields = ['speaker', 'text']
    ordering = ['dialogue', 'order']

@admin.register(SkillCheck)
class SkillCheckAdmin(admin.ModelAdmin):
    list_display = ['skill', 'difficulty', 'dc_value', 'dialogue', 'created_at']
    list_filter = ['skill', 'difficulty', 'created_at', 'dialogue']
    search_fields = ['description', 'success_text', 'failure_text']

@admin.register(DialogueOption)
class DialogueOptionAdmin(admin.ModelAdmin):
    list_display = ['text', 'dialogue', 'skill_check', 'order', 'is_available', 'created_at']
    list_filter = ['is_available', 'created_at', 'dialogue']
    search_fields = ['text']

@admin.register(RollResult)
class RollResultAdmin(admin.ModelAdmin):
    list_display = ['character', 'skill_check', 'dice_roll', 'skill_value', 'total', 'is_success', 'created_at']
    list_filter = ['is_success', 'is_critical_success', 'is_critical_failure', 'created_at']
    search_fields = ['character__name', 'result_text']
    readonly_fields = ['dice_roll', 'skill_value', 'total', 'is_success', 'is_critical_success', 'is_critical_failure']

@admin.register(DialogueNode)
class DialogueNodeAdmin(admin.ModelAdmin):
    list_display = ['character', 'node_type', 'order', 'project', 'created_at']
    list_filter = ['node_type', 'created_at', 'project']
    search_fields = ['character', 'text']

@admin.register(DialogueLink)
class DialogueLinkAdmin(admin.ModelAdmin):
    list_display = ['from_node', 'to_node', 'condition', 'created_at']
    search_fields = ['condition', 'action']

@admin.register(CharacterStat)
class CharacterStatAdmin(admin.ModelAdmin):
    list_display = ['name', 'value', 'project', 'created_at']
    list_filter = ['created_at', 'project']
    search_fields = ['name', 'description']


# Quest System Admin

@admin.register(Quest)
class QuestAdmin(admin.ModelAdmin):
    list_display = ['title', 'quest_type', 'difficulty_level', 'assigned_character', 'status', 'created_at']
    list_filter = ['quest_type', 'status', 'difficulty_level', 'created_at']
    search_fields = ['title', 'description']


@admin.register(QuestCharacter)
class QuestCharacterAdmin(admin.ModelAdmin):
    list_display = ['quest', 'character', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['quest__title', 'character__name']


@admin.register(DialogueLog)
class DialogueLogAdmin(admin.ModelAdmin):
    list_display = ['author', 'log_type', 'quest', 'character', 'result', 'created_at']
    list_filter = ['log_type', 'result', 'created_at']
    search_fields = ['author', 'content', 'quest__title', 'character__name']
    readonly_fields = ['created_at', 'updated_at']
