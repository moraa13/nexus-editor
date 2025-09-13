# Nexus Backend

## Установка и настройка

### 1. Установка зависимостей
```bash
pip install -r requirements.txt
```

### 2. Настройка переменных окружения
Скопируйте файл `env.example` в `.env` и настройте переменные:

```bash
cp env.example .env
```

Обязательно измените `DJANGO_SECRET_KEY` на случайную строку:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 3. Миграции базы данных
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Создание суперпользователя
```bash
python manage.py createsuperuser
```

### 5. Запуск сервера
```bash
python manage.py runserver
```

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `DJANGO_SECRET_KEY` | Секретный ключ Django | **Обязательно** |
| `DJANGO_DEBUG` | Режим отладки | `False` |
| `DJANGO_ALLOWED_HOSTS` | Разрешенные хосты | `localhost,127.0.0.1` |
| `DB_ENGINE` | Движок БД | `django.db.backends.sqlite3` |
| `DB_NAME` | Имя БД | `db.sqlite3` |
| `CORS_ALLOW_ALL_ORIGINS` | Разрешить все CORS | `False` |

## API Endpoints

### Основные модели
- `/api/projects/` - Проекты
- `/api/characters/` - Персонажи
- `/api/dialogues/` - Диалоги
- `/api/quests/` - Квесты
- `/api/skill-checks/` - Проверки навыков

### Специальные endpoints
- `/api/generate_replicas/` - Генерация реплик
- `/api/roll_skill_check/` - Бросок кубика
- `/api/export/project/` - Экспорт проекта

## Безопасность

⚠️ **Важно для продакшена:**
1. Установите `DJANGO_DEBUG=False`
2. Используйте сильный `DJANGO_SECRET_KEY`
3. Настройте `DJANGO_ALLOWED_HOSTS` для вашего домена
4. Настройте `CORS_ALLOWED_ORIGINS` для вашего фронтенда
5. Используйте HTTPS
6. Настройте аутентификацию (сейчас отключена для разработки)
