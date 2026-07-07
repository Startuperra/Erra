import os
import django
import sys

# Django sozlamalarini yuklash
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Standart admin ma'lumotlari
ADMIN_USERNAME = 'admin'
ADMIN_EMAIL = 'admin@example.com'
ADMIN_PASSWORD = 'admin123QWE' # Juda kuchli parol emas, lekin test uchun yetarli

try:
    if not User.objects.filter(username=ADMIN_USERNAME).exists():
        User.objects.create_superuser(username=ADMIN_USERNAME, email=ADMIN_EMAIL, password=ADMIN_PASSWORD)
        print(f"Muvaffaqiyatli: '{ADMIN_USERNAME}' nomli superuser yaratildi.")
    else:
        print(f"Ma'lumot: '{ADMIN_USERNAME}' nomli superuser allaqachon mavjud.")
except Exception as e:
    print(f"Superuser yaratishda xatolik: {e}")
