#!/usr/bin/env python3
"""
Скрипт для генерации SECRET_KEY для Django
"""
import os
import sys
import django
from django.core.management.utils import get_random_secret_key

def main():
    secret_key = get_random_secret_key()
    print("Generated SECRET_KEY:")
    print(secret_key)
    print("\nAdd this to your .env file:")
    print(f"DJANGO_SECRET_KEY={secret_key}")

if __name__ == "__main__":
    main()
