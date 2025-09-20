# AI Agent Setup Guide

## 🚀 Production-Ready AI Chat System

Ваш Django-бэкенд теперь включает полноценную систему AI-чата с поддержкой OpenRouter API.

## 📁 Структура

### Новые файлы:
- `core/ai_service.py` - Основной AI сервис
- `core/ai_views.py` - API endpoints для чата
- `core/models.py` - Модели для чата (ChatSession, ChatMessage, AIConfig)
- `core/serializers.py` - Сериализаторы для AI API

### Новые API endpoints:
- `POST /api/ai/chat/` - Основной чат с ИИ
- `POST /api/ai/generate-content/` - Генерация контента
- `GET /api/ai/status/` - Статус AI сервиса
- `GET /api/chat-sessions/` - Управление сессиями чата
- `GET /api/ai-configs/` - Конфигурация ИИ

## ⚙️ Настройка

### 1. Настройте переменные окружения

Отредактируйте файл `.env`:

```bash
# Django Settings
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# AI Settings
OPENAI_API_KEY=your-openai-api-key-here
OPENROUTER_API_KEY=your-openrouter-api-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```

### 2. Получите API ключ OpenRouter

1. Зарегистрируйтесь на [OpenRouter.ai](https://openrouter.ai/)
2. Создайте API ключ в настройках
3. Добавьте ключ в `.env` файл

### 3. Примените миграции

```bash
python3 manage.py migrate
```

## 🎯 Использование

### Frontend Integration

В `NexusDashboard.tsx` уже интегрирован AI чат:

```typescript
const response = await fetch('/api/ai/chat/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    context: {
      genre: 'noir',
      tone: 'dark-noir',
      project_name: 'Мой проект'
    },
    save_to_history: true
  })
});
```

### API Examples

#### Отправка сообщения в чат:

```bash
curl -X POST http://localhost:8000/api/ai/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Помоги создать персонажа для детективной истории",
    "context": {
      "genre": "noir",
      "tone": "dark-noir",
      "project_name": "Мой проект"
    }
  }'
```

#### Генерация контента:

```bash
curl -X POST http://localhost:8000/api/ai/generate-content/ \
  -H "Content-Type: application/json" \
  -d '{
    "content_type": "dialogue",
    "prompt": "Создай диалог между детективом и подозреваемым",
    "context": {
      "genre": "noir",
      "tone": "dark-noir"
    }
  }'
```

#### Проверка статуса:

```bash
curl http://localhost:8000/api/ai/status/
```

## 🔧 Возможности

### ✅ Реализовано:
- **Production-ready AI сервис** с обработкой ошибок
- **История диалогов** с сохранением в БД
- **Контекст проектов** (жанр, тональность, персонажи)
- **Fallback ответы** при недоступности AI
- **Множественные модели** (OpenRouter, OpenAI)
- **Генерация контента** (диалоги, персонажи, квесты)
- **REST API** с полной документацией
- **Интеграция с фронтендом**

### 🎨 Особенности:
- **Стилизованные ответы** в зависимости от тональности проекта
- **Умные промпты** для разных типов контента
- **Кэширование** и оптимизация запросов
- **Логирование** всех AI запросов
- **Валидация** входных данных

## 🚀 Следующие шаги

1. **Настройте API ключ** OpenRouter в `.env`
2. **Протестируйте** AI чат в интерфейсе
3. **Настройте** кастомные промпты для ваших проектов
4. **Добавьте** аутентификацию для production

## 📊 Мониторинг

- Проверяйте логи Django для AI запросов
- Используйте `/api/ai/status/` для мониторинга
- Следите за использованием токенов в метаданных

## 🔒 Безопасность

- API ключи хранятся в переменных окружения
- Валидация всех входных данных
- Ограничения на размер сообщений
- Fallback режим при ошибках

---

**Готово!** Ваш AI-агент готов к использованию! 🎉
