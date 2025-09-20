#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append('/home/kuoma/projects/nexus/backend')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nexus_backend.settings')
django.setup()

from django.conf import settings

print("=== API Key Test ===")
print(f"OPENROUTER_API_KEY: {'SET' if getattr(settings, 'OPENROUTER_API_KEY', None) else 'NOT SET'}")
print(f"OPENROUTER_BASE_URL: {getattr(settings, 'OPENROUTER_BASE_URL', 'NOT SET')}")
print(f"OPENROUTER_MODEL: {getattr(settings, 'OPENROUTER_MODEL', 'NOT SET')}")

# Test environment variables
print("\n=== Environment Variables ===")
print(f"OPENROUTER_API_KEY env: {'SET' if os.getenv('OPENROUTER_API_KEY') else 'NOT SET'}")
print(f"OPENROUTER_BASE_URL env: {os.getenv('OPENROUTER_BASE_URL', 'NOT SET')}")
print(f"OPENROUTER_MODEL env: {os.getenv('OPENROUTER_MODEL', 'NOT SET')}")
