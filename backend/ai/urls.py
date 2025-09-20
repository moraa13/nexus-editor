"""
URLs for AI app
"""
from django.urls import path
from .views import AIChatView, AIContentGenerationView, AIStatusView

urlpatterns = [
    path('chat/', AIChatView.as_view(), name='ai-chat'),
    path('generate-content/', AIContentGenerationView.as_view(), name='ai-generate-content'),
    path('status/', AIStatusView.as_view(), name='ai-status'),
]
