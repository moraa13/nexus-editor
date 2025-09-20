"""
URLs for AI app
"""
from django.urls import path
from .simple_views import SimpleAIChatView, SimpleAIStatusView

urlpatterns = [
    path('chat/', SimpleAIChatView.as_view(), name='ai-chat'),
    path('status/', SimpleAIStatusView.as_view(), name='ai-status'),
]
