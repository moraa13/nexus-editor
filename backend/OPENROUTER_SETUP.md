# Настройка OpenRouter API

## Проблема
Агенты возвращают fallback сообщения вместо реальных ответов ИИ.

## Причина
API ключ OpenRouter недействителен или истек.

## Решение

### 1. Получите новый API ключ
1. Перейдите на [OpenRouter.ai](https://openrouter.ai/)
2. Зарегистрируйтесь или войдите в аккаунт
3. Перейдите в раздел "Keys" 
4. Создайте новый API ключ

### 2. Обновите .env файл
```bash
# В файле nexus/backend/.env
OPENROUTER_API_KEY=ваш_новый_ключ_здесь
```

### 3. Перезапустите Django сервер
```bash
cd nexus/backend
python3 manage.py runserver 0.0.0.0:8000
```

### 4. Проверьте работу
```bash
curl -X POST http://localhost:8000/api/ai/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Привет"}'
```

## Альтернативные модели
Если у вас нет доступа к OpenRouter, можно использовать другие модели:

### OpenAI
```bash
OPENAI_API_KEY=ваш_ключ_openai
```

### Anthropic
```bash
ANTHROPIC_API_KEY=ваш_ключ_anthropic
```

## Тестирование
Используйте скрипт для проверки:
```bash
python3 test_openrouter_debug.py
```

## Статус
- ✅ Система агентов работает
- ✅ База данных настроена
- ✅ API endpoints готовы
- ❌ Требуется действующий API ключ OpenRouter
