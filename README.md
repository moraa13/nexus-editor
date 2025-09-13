# Nexus - Game Narrative Editor

Система для создания и управления игровыми диалогами с механикой проверок навыков в стиле Disco Elysium.

## 🚀 Быстрый старт

### Backend (Django)

1. **Установка зависимостей:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Настройка окружения:**
```bash
cp env.example .env
# Сгенерируйте SECRET_KEY:
python generate_secret_key.py
# Добавьте полученный ключ в .env файл
```

3. **Миграции:**
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Создание суперпользователя:**
```bash
python manage.py createsuperuser
```

5. **Запуск сервера:**
```bash
python manage.py runserver
```

### Frontend (React + Vite)

1. **Установка зависимостей:**
```bash
cd frontend
npm install
```

2. **Запуск в режиме разработки:**
```bash
npm run dev
```

## 📁 Структура проекта

```
nexus/
├── backend/                 # Django API
│   ├── core/               # Основные модели и views
│   ├── dialogue/           # Модуль диалогов
│   ├── nexus_backend/      # Настройки Django
│   ├── requirements.txt    # Python зависимости
│   ├── env.example         # Пример переменных окружения
│   └── README.md          # Документация backend
├── frontend/               # React приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── api/           # API клиенты
│   │   ├── types.ts       # TypeScript типы
│   │   └── lib/           # Утилиты
│   ├── package.json       # Node.js зависимости
│   └── README.md          # Документация frontend
└── README.md              # Этот файл
```

## 🔧 Основные функции

### Backend API
- **Аутентификация:** Token-based auth с регистрацией/логином
- **Персонажи:** 24 характеристики в стиле Disco Elysium
- **Диалоги:** Система диалогов с постами и опциями
- **Skill Checks:** Проверки навыков с бросками d20
- **Квесты:** Система квестов с различными типами
- **Экспорт:** Экспорт в JSON, YAML, Unity, Unreal и др.

### Frontend
- **Редактор:** Визуальный редактор диалогов
- **Canvas:** Drag & drop интерфейс
- **Dice Roller:** Бросок кубиков для skill checks
- **Character Editor:** Редактор персонажей
- **Quest Editor:** Управление квестами
- **Export Panel:** Экспорт проектов

## 🔒 Безопасность

### ✅ Исправлено:
- Убран хардкод SECRET_KEY
- Настроены безопасные CORS настройки
- Добавлена валидация данных
- Улучшена обработка ошибок
- Добавлена аутентификация

### ⚠️ Для продакшена:
1. Установите `DJANGO_DEBUG=False`
2. Используйте сильный `DJANGO_SECRET_KEY`
3. Настройте `DJANGO_ALLOWED_HOSTS`
4. Включите аутентификацию в views
5. Используйте HTTPS
6. Настройте PostgreSQL вместо SQLite

## 🎮 Игровая механика

### Характеристики персонажей (24 шт.):
- **Intellect:** Logic, Encyclopedia, Rhetoric, Drama, Conceptualization, Visual Calculus
- **Psyche:** Volition, Inland Empire, Empathy, Authority, Suggestion, Espirit de Corps  
- **Physique:** Endurance, Pain Threshold, Physical Instrument, Electrochemistry, Shivers, Half Light
- **Motorics:** Hand/Eye Coordination, Perception, Reaction Speed, Savoir Faire, Interfacing, Composure

### Skill Checks:
- Бросок d20 + характеристика против DC
- Критические успехи (20) и провалы (1)
- Различные уровни сложности (Trivial → Impossible)

## 📚 API Endpoints

### Аутентификация
- `POST /api/auth/login/` - Вход
- `POST /api/auth/register/` - Регистрация
- `POST /api/auth/logout/` - Выход
- `GET /api/auth/profile/` - Профиль

### Основные ресурсы
- `GET/POST /api/characters/` - Персонажи
- `GET/POST /api/dialogues/` - Диалоги
- `GET/POST /api/quests/` - Квесты
- `GET/POST /api/skill-checks/` - Проверки навыков

### Игровые функции
- `POST /api/roll_skill_check/` - Бросок кубика
- `POST /api/generate_replicas/` - Генерация реплик
- `POST /api/export/project/` - Экспорт проекта

## 🛠️ Разработка

### Добавление новых характеристик:
1. Обновите модель `Character` в `backend/core/models.py`
2. Добавьте валидацию (1-20)
3. Обновите типы в `frontend/src/types.ts`
4. Создайте миграцию: `python manage.py makemigrations`

### Добавление новых форматов экспорта:
1. Добавьте формат в `ExportSession.EXPORT_FORMATS`
2. Реализуйте логику в `_generate_export_data()`
3. Обновите frontend для поддержки нового формата

## 📝 Лицензия

MIT License

## 🤝 Вклад в проект

1. Fork репозиторий
2. Создайте feature branch
3. Commit изменения
4. Push в branch
5. Создайте Pull Request

## 📞 Поддержка

Если у вас есть вопросы или проблемы, создайте issue в репозитории.
