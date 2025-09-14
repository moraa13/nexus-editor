# Nexus Editor - Development Log

## 🎯 Project Overview

Nexus Editor - это веб-приложение для создания интерактивных историй и диалогов в стиле Disco Elysium с использованием ИИ. Позволяет создавать персонажей, строить ветвящиеся диалоги, создавать квесты и экспортировать проекты в различные форматы.

## 🏗️ Architecture

### Backend (Django + DRF)
```
nexus/backend/
├── core/                    # Основные модели и API
│   ├── models.py           # Унифицированная модель Character, Quest, Dialogue
│   ├── serializers.py      # DRF сериализаторы
│   ├── views.py           # ViewSets и API endpoints
│   └── urls.py            # URL маршруты
├── dialogue/               # Диалоговая система
│   ├── models.py          # DialogueNode, DialogueEdge, SkillCheck
│   ├── serializers.py     # Сериализаторы для диалогов
│   └── views.py           # API для диалогов
└── nexus_backend/         # Django настройки
    ├── settings.py        # Конфигурация
    └── urls.py           # Главные URL маршруты
```

### Frontend (React + TypeScript + Vite)
```
nexus/frontend/src/
├── components/
│   ├── adventure/         # Основные компоненты редактора
│   │   ├── AdventureLayout.tsx
│   │   ├── AdventureLayoutRefactored.tsx
│   │   └── CharacterPanel.tsx
│   ├── character/         # Создание и редактирование персонажей
│   │   └── CharacterCreator.tsx
│   ├── dialogue/          # Диалоговая система
│   │   ├── DialogueCanvas.tsx
│   │   ├── DialogueConstructor.tsx
│   │   └── DialogueManager.tsx
│   ├── LandingPage.tsx    # Главная страница
│   └── ui/               # UI компоненты
├── stores/               # Zustand state management
│   └── adventureStore.ts # Глобальное состояние
├── types/               # TypeScript типы
│   ├── character.ts
│   ├── discoElysium.ts
│   └── project.ts
├── hooks/               # React хуки
├── services/            # API сервисы
└── utils/              # Утилиты
```

## 🛠️ Tech Stack

### Backend
- **Django 5.2.6** - Web framework
- **Django REST Framework 3.15.2** - API
- **PostgreSQL** - Database (опционально)
- **SQLite** - Development database
- **Gunicorn** - WSGI server
- **WhiteNoise** - Static files

### Frontend
- **React 19.1.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 7.1.2** - Build tool
- **Tailwind CSS 4.1.13** - Styling
- **Zustand** - State management
- **ReactFlow 11.11.4** - Node-based editor
- **Axios** - HTTP client
- **Lucide React** - Icons

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📋 Recent Changes

### v0.2.0 - Landing Page & UI Improvements (2025-01-14)

#### ✨ New Features
- **Landing Page**: Создан красивый лендинг с sci-fi дизайном
- **Routing System**: Добавлена навигация между лендингом и редактором
- **Zustand Store**: Интегрировано управление состоянием
- **Character Model Unification**: Объединены модели Character из core и dialogue

#### 🎨 UI/UX Improvements
- **Smooth Sliders**: Исправлены ползунки в создании персонажа
- **Custom Slider Styles**: Добавлены анимации и эффекты для ползунков
- **Navigation**: Кнопка "Назад к лендингу" в редакторе
- **Responsive Design**: Улучшена адаптивность интерфейса

#### 🐛 Bug Fixes
- **TypeError Fix**: Исправлена ошибка с undefined в AdventureLayout
- **Import Fix**: Исправлен импорт QuestObjective в Django сериализаторе
- **SVG Data URL**: Исправлена синтаксическая ошибка в LandingPage

#### 🔧 Technical Improvements
- **State Management**: Zustand store для управления состоянием
- **Type Safety**: Улучшена типизация TypeScript
- **Performance**: Оптимизированы анимации и переходы
- **Code Organization**: Рефакторинг компонентов

### v0.1.0 - Initial Release (2025-01-13)

#### 🎮 Core Features
- **Character Creation**: Система создания персонажей с Disco Elysium механиками
- **Dialogue System**: Визуальный редактор диалогов с узлами
- **Quest System**: Создание и управление квестами
- **AI Integration**: Интеграция с ChatGPT для генерации контента
- **Export System**: Экспорт проектов в различные форматы

## 🎯 TODO Tasks

### High Priority
- [ ] **API Integration**: Подключить Zustand store к Django API
- [ ] **Character CRUD**: Полная интеграция создания/редактирования персонажей
- [ ] **Dialogue Editor**: Улучшить визуальный редактор диалогов
- [ ] **Save System**: Система сохранения проектов
- [ ] **User Authentication**: Система авторизации пользователей

### Medium Priority
- [ ] **Quest Editor**: Визуальный редактор квестов
- [ ] **Scene Management**: Управление сценами и локациями
- [ ] **Export Templates**: Расширить систему экспорта
- [ ] **Performance Optimization**: Оптимизация производительности
- [ ] **Mobile Support**: Адаптация для мобильных устройств

### Low Priority
- [ ] **Collaboration**: Многопользовательское редактирование
- [ ] **Version Control**: Система версий проектов
- [ ] **Plugin System**: Система плагинов
- [ ] **Analytics**: Аналитика использования
- [ ] **Documentation**: Полная документация API

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Основные действия
- **Secondary**: Purple (#8B5CF6) - Вторичные элементы
- **Accent**: Cyan (#06B6D4) - Акценты
- **Background**: Dark Gray (#111827) - Основной фон
- **Surface**: Gray (#1F2937) - Поверхности
- **Text**: White (#FFFFFF) - Основной текст
- **Muted**: Gray (#6B7280) - Приглушенный текст

### Typography
- **Primary Font**: System UI, Avenir, Helvetica, Arial
- **Monospace**: Orbitron (для sci-fi элементов)
- **Sans-serif**: Rajdhani (для заголовков)

### Components
- **Cards**: Скругленные углы, тени, градиенты
- **Buttons**: Градиентные фоны, hover эффекты
- **Sliders**: Кастомные стили с анимациями
- **Modals**: Backdrop blur, анимации появления

## 🔗 Links

### Design References
- **Disco Elysium**: Основной источник вдохновения для механик
- **Sci-fi Aesthetics**: Тёмная тема с неоновыми акцентами
- **Node-based Editors**: Godot, Unreal Engine, Blender

### Development Resources
- **Django Documentation**: https://docs.djangoproject.com/
- **React Documentation**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Zustand**: https://zustand-demo.pmnd.rs/
- **ReactFlow**: https://reactflow.dev/

## 📊 Project Status

- **Backend**: 80% complete
- **Frontend**: 70% complete
- **UI/UX**: 85% complete
- **Testing**: 20% complete
- **Documentation**: 60% complete

## 🚀 Getting Started

### Backend Setup
```bash
cd nexus/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver
```

### Frontend Setup
```bash
cd nexus/frontend
npm install
npm run dev
```

### Access
- **Frontend**: http://localhost:5181/
- **Backend API**: http://localhost:8000/
- **Admin Panel**: http://localhost:8000/admin/

---

*Last updated: 2025-01-14*
*Version: 0.2.0*
