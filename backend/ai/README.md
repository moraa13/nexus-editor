# AI Chat System - Enhanced Version

## 🚀 Overview

Это улучшенная версия вашего AI endpoint с дополнительными возможностями и production-ready функциональностью.

## 📁 Structure

```
ai/
├── __init__.py
├── apps.py
├── urls.py
├── views.py
└── README.md
```

## 🔌 API Endpoints

### 1. AI Chat - `/api/ai/chat/`

**POST** - Основной endpoint для чата с ИИ

#### Request:
```json
{
    "message": "Помоги создать персонажа для детективной истории",
    "context": {
        "genre": "noir",
        "tone": "dark-noir",
        "project_name": "Мой проект"
    }
}
```

#### Response:
```json
{
    "reply": "Отличная идея! Давайте создадим персонажа с глубиной...",
    "success": true,
    "model": "gpt-3.5-turbo",
    "context_used": {
        "genre": "noir",
        "tone": "dark-noir",
        "project_name": "Мой проект"
    },
    "tokens_used": 150,
    "created_at": "2024-01-01T12:00:00Z"
}
```

### 2. Content Generation - `/api/ai/generate-content/`

**POST** - Генерация специфического контента

#### Request:
```json
{
    "content_type": "dialogue",
    "prompt": "Создай диалог между детективом и подозреваемым",
    "context": {
        "genre": "noir",
        "tone": "dark-noir"
    }
}
```

#### Response:
```json
{
    "content": "Сгенерированный контент...",
    "content_type": "dialogue",
    "success": true,
    "model": "gpt-3.5-turbo",
    "tokens_used": 200
}
```

### 3. AI Status - `/api/ai/status/`

**GET** - Статус AI сервиса

#### Response:
```json
{
    "available": true,
    "model": "gpt-3.5-turbo",
    "api_configured": true,
    "fallback_mode": false,
    "service": "OpenAI"
}
```

## ⚙️ Configuration

### Environment Variables

Добавьте в `.env` файл:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here
```

### Settings

В `settings.py` уже добавлено:
```python
INSTALLED_APPS = [
    # ... other apps
    'ai',
]
```

## 🎯 Features

### ✅ Enhanced Features:

1. **Context-Aware Responses**
   - Учитывает жанр, тональность и название проекта
   - Адаптирует стиль ответов под контекст

2. **Error Handling**
   - Graceful fallback при недоступности API
   - Детальные сообщения об ошибках
   - Rate limiting handling

3. **Multiple Content Types**
   - Диалоги
   - Персонажи
   - Квесты
   - Сцены

4. **Production Ready**
   - Логирование всех запросов
   - Валидация входных данных
   - Токен usage tracking

5. **Disco Elysium Style**
   - Философские и глубокие ответы
   - Моральные дилеммы
   - Атмосферные описания

## 🔧 Usage Examples

### Basic Chat:
```bash
curl -X POST http://localhost:8000/api/ai/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Помоги создать персонажа",
    "context": {
      "genre": "noir",
      "tone": "dark-noir",
      "project_name": "Мой проект"
    }
  }'
```

### Content Generation:
```bash
curl -X POST http://localhost:8000/api/ai/generate-content/ \
  -H "Content-Type: application/json" \
  -d '{
    "content_type": "dialogue",
    "prompt": "Создай диалог между детективом и подозреваемым"
  }'
```

### Check Status:
```bash
curl http://localhost:8000/api/ai/status/
```

## 🎨 Style Customization

Система автоматически адаптирует стиль ответов на основе `tone` в контексте:

- **dark-noir**: Мрачно, иронично, философски
- **philosophical**: Глубоко, размышляя о смысле
- **satirical**: Саркастично, остроумно
- **melancholic**: Меланхолично, ностальгически
- **energetic**: Энергично, динамично
- **mystical**: Загадочно, с мистикой
- **cyberpunk**: Технологично, антиутопично

## 🚀 Integration with Frontend

Ваш `NexusDashboard.tsx` уже интегрирован с этим API:

```typescript
const response = await fetch('/api/ai/chat/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    context: {
      genre: currentProject?.gameSetting?.genre || 'noir',
      tone: currentProject?.gameTone?.mood || 'dark-noir',
      project_name: currentProject?.name || 'Новый проект'
    }
  })
});
```

## 🔒 Security & Best Practices

1. **API Key Security**: Храните ключи в переменных окружения
2. **Input Validation**: Все входные данные валидируются
3. **Error Handling**: Graceful degradation при ошибках
4. **Rate Limiting**: Обработка лимитов OpenAI
5. **Logging**: Полное логирование для мониторинга

## 📊 Monitoring

- Проверяйте логи Django для AI запросов
- Используйте `/api/ai/status/` для мониторинга
- Следите за использованием токенов

---

**Готово!** Ваш AI endpoint готов к использованию! 🎉
