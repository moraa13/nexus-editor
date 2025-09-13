# Система ветвления диалогов Nexus Editor

## 🌿 Обзор

Система ветвления диалогов позволяет создавать сложные интерактивные диалоги с множественными путями развития, проверками навыков и условными переходами в стиле Disco Elysium.

## 🏗️ Архитектура

### Backend (Django)

#### Модели
- **Post** - Посты диалога с поддержкой ветвления
- **DialogueOption** - Опции ответов с привязкой к skill checks
- **Dialogue** - Диалоги с подсчетом статистики ветвления

#### Новые поля Post
```python
has_options = models.BooleanField(default=False)
is_branching_point = models.BooleanField(default=False)
post_type = models.CharField(choices=[...])  # statement, question, action, narration
color = models.CharField(max_length=7, default="#6B7280")
icon = models.CharField(max_length=50, default="💬")
```

#### Новые поля DialogueOption
```python
option_type = models.CharField(choices=[...])  # response, choice, skill_check, condition
next_dialogue = models.ForeignKey(Dialogue, ...)  # Связь с другим диалогом
next_post = models.ForeignKey(Post, ...)  # Связь с конкретным постом
required_skill = models.CharField(max_length=30)
required_skill_value = models.IntegerField()
condition_text = models.TextField()
condition_met = models.BooleanField(default=True)
color = models.CharField(max_length=7, default="#3B82F6")
icon = models.CharField(max_length=50, default="💬")
metadata = models.JSONField(default=dict)
```

### Frontend (React + TypeScript)

#### Компоненты
- **DialogueNodeEditor** - Редактор узлов диалога с опциями
- **Canvas** - Визуальный редактор с поддержкой ветвления
- **Editor** - Главный редактор с интеграцией всех компонентов

#### Типы
```typescript
interface Post {
  has_options: boolean;
  is_branching_point: boolean;
  post_type: 'statement' | 'question' | 'action' | 'narration';
  color: string;
  icon: string;
  available_options?: DialogueOption[];
}

interface DialogueOption {
  option_type: 'response' | 'choice' | 'skill_check' | 'condition';
  next_dialogue?: UUID;
  next_post?: UUID;
  required_skill?: string;
  required_skill_value?: number;
  condition_text?: string;
  condition_met: boolean;
  color: string;
  icon: string;
  metadata?: Record<string, any>;
  is_accessible?: boolean;
}
```

## 🚀 API Endpoints

### Новые endpoints
- `GET /api/dialogues/{id}/tree/` - Получить дерево диалога
- `POST /api/dialogues/branch/` - Создать новую ветку
- `POST /api/dialogues/option/` - Создать опцию диалога

### Примеры использования

#### Получение дерева диалога
```javascript
const response = await getDialogueTree(dialogueId, characterId);
// Возвращает: { dialogue: Dialogue, tree_structure: DialogueTree }
```

#### Создание опции
```javascript
const option = await createDialogueOption({
  dialogue_id: "uuid",
  text: "Попытаться убедить",
  option_type: "skill_check",
  post_id: "uuid",
  color: "#10B981",
  icon: "🎲"
});
```

#### Создание ветки
```javascript
const branch = await createDialogueBranch({
  parent_dialogue_id: "uuid",
  option_id: "uuid", 
  title: "Успешное убеждение"
});
```

## 🎨 UI/UX

### Визуальные элементы
- **Цветовое кодирование** - Каждый тип опции имеет свой цвет
- **Иконки** - Визуальные индикаторы типов постов и опций
- **Интерактивные карточки** - Плавные анимации в стиле Notus React
- **Ветвление** - Визуальные связи между узлами

### Типы узлов в Canvas
- **Post Node** - Посты диалога с информацией о ветвлении
- **Option Node** - Опции ответов с цветовым кодированием
- **Branch Node** - Точки ветвления к другим диалогам
- **Character Node** - Персонажи (существующий тип)

## 🔧 Использование

### 1. Создание диалога с ветвлением

1. Откройте **Dialogue Nodes** в редакторе
2. Выберите диалог из списка
3. Добавьте посты с помощью **+ Add Post**
4. Для постов с опциями нажмите **+ Add Option**
5. Настройте тип опции, цвет и иконку

### 2. Создание веток

1. Создайте опцию диалога
2. Нажмите **🌿 Add Branch**
3. Введите название новой ветки
4. Выберите опцию, которая ведет к ветке

### 3. Визуализация в Canvas

1. Переключитесь на вкладку **Canvas**
2. Выберите диалог из сайдбара
3. Увидите визуальное дерево с узлами и связями
4. Используйте **Dialogue Nodes** для редактирования

## 🎯 Типы опций

### Response (Ответ)
- Обычный ответ игрока
- Цвет: `#3B82F6` (синий)
- Иконка: `💬`

### Choice (Выбор)
- Выбор действия
- Цвет: `#10B981` (зеленый)  
- Иконка: `🎯`

### Skill Check (Проверка навыка)
- Требует проверку навыка
- Цвет: `#F59E0B` (оранжевый)
- Иконка: `🎲`

### Condition (Условие)
- Условный переход
- Цвет: `#8B5CF6` (фиолетовый)
- Иконка: `🔗`

## 🔍 Проверка доступности

Система автоматически проверяет доступность опций на основе:
- `is_available` - Общая доступность опции
- `condition_met` - Выполнение условий
- `required_skill` + `required_skill_value` - Требования к навыкам персонажа

## 📊 Статистика

Диалоги показывают статистику:
- Количество постов
- Количество опций
- Количество точек ветвления

## 🚀 Запуск

### Backend
```bash
cd backend
python3 manage.py runserver
```

### Frontend  
```bash
cd frontend
npm run dev
```

## 🔮 Будущие улучшения

- [ ] Визуальный редактор условий
- [ ] Импорт/экспорт деревьев диалогов
- [ ] Система тестирования диалогов
- [ ] Аналитика прохождения диалогов
- [ ] Шаблоны диалогов
- [ ] Коллаборативное редактирование

## 📝 Примеры

### Простой диалог с ветвлением
```
NPC: "Привет! Как дела?"
├─ Игрок: "Отлично!" → Продолжение диалога
├─ Игрок: "Плохо..." → Ветка поддержки  
└─ Игрок: "Не твое дело!" → Ветка конфликта
```

### Диалог с проверкой навыка
```
NPC: "Можешь помочь мне с этой задачей?"
├─ Игрок: "Конечно!" (Logic 4+) → Успешная помощь
├─ Игрок: "Попробую..." (Logic 2+) → Частичный успех
└─ Игрок: "Не уверен..." → Отказ
```

Система ветвления диалогов готова к использованию! 🎉
