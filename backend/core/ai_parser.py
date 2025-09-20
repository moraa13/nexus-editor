"""
AI Parser for game prompts - Enhanced version
"""
import re
from typing import Dict, List, Tuple

# Контекст для "памяти" парсера
_parser_context = {
    'previous_genre': None,
    'previous_setting': None,
    'previous_tone': None,
    'conversation_history': []
}

def parse_game_prompt(message: str) -> Tuple[str, Dict]:
    """
    Умный парсер игровых промптов с пониманием контекста
    
    Args:
        message: Сообщение пользователя
        
    Returns:
        tuple: (reply, parsed_data)
    """
    global _parser_context
    
    # Добавляем в историю
    _parser_context['conversation_history'].append(message)
    if len(_parser_context['conversation_history']) > 5:
        _parser_context['conversation_history'].pop(0)
    
    msg = message.lower().strip()
    data = {}
    
    # Проверяем, является ли сообщение приветствием или простым вопросом
    if _is_greeting_or_simple_question(msg):
        return _handle_greeting_or_simple_question(message, msg)
    
    # Проверяем, является ли сообщение коротким (менее 10 символов)
    if len(msg) < 10:
        return _handle_short_message(message, msg)
    
    # Анализируем жанр
    genre = _detect_genre(msg)
    if genre:
        data['genre'] = genre
        _parser_context['previous_genre'] = genre
    
    # Анализируем сеттинг
    setting = _detect_setting(msg)
    if setting:
        data['setting'] = setting
        _parser_context['previous_setting'] = setting
    
    # Анализируем тон
    tone = _detect_tone(msg)
    if tone:
        data['tone'] = tone
        _parser_context['previous_tone'] = tone
    
    # Анализируем персонажей
    characters = _detect_characters(msg)
    if characters:
        data['characters'] = characters
    
    # Анализируем сюжетные элементы
    plot_elements = _detect_plot_elements(msg)
    if plot_elements:
        data['plot_elements'] = plot_elements
    
    # Генерируем ответ
    reply = _generate_contextual_reply(message, data, _parser_context)
    
    return reply, data

def _is_greeting_or_simple_question(msg: str) -> bool:
    """Проверяет, является ли сообщение приветствием или простым вопросом"""
    greetings = ['привет', 'ку', 'хай', 'здравствуй', 'добро пожаловать']
    questions = ['как дела', 'что нового', 'как поживаешь', 'всё хорошо']
    
    return any(greeting in msg for greeting in greetings) or any(question in msg for question in questions)

def _handle_greeting_or_simple_question(original_message: str, msg: str) -> Tuple[str, Dict]:
    """Обрабатывает приветствия и простые вопросы"""
    greetings_responses = [
        "Привет! Расскажи мне о своей игре - какой жанр, сеттинг, атмосфера?",
        "Здравствуй! Давай создадим что-то интересное. Опиши свою идею игры.",
        "Привет! Я готов помочь с созданием игры. Что у тебя на уме?",
        "Ку! Давай поговорим о твоей игровой идее. С чего начнём?"
    ]
    
    questions_responses = [
        "Всё отлично! А как дела с твоей игрой? Расскажи о концепции.",
        "Хорошо, спасибо! А что насчёт твоей игровой идеи?",
        "Отлично! Давай сосредоточимся на игре. Какой жанр планируешь?",
        "Всё супер! Теперь расскажи о своей игре."
    ]
    
    import random
    
    if any(greeting in msg for greeting in ['привет', 'ку', 'хай', 'здравствуй']):
        reply = random.choice(greetings_responses)
    else:
        reply = random.choice(questions_responses)
    
    return reply, {}

def _handle_short_message(original_message: str, msg: str) -> Tuple[str, Dict]:
    """Обрабатывает короткие сообщения"""
    short_responses = [
        "Интересно! Расскажи подробнее о своей идее.",
        "Понял. А что именно ты хочешь создать?",
        "Хорошо. Давай развивать эту мысль дальше.",
        "Ясно. Опиши свою игровую концепцию подробнее."
    ]
    
    import random
    reply = random.choice(short_responses)
    return reply, {}

def _detect_genre(msg: str) -> str:
    """Определяет жанр игры"""
    genre_patterns = {
        'Horror': [
            'ужас', 'хоррор', 'страх', 'монстр', 'зомби', 'призрак', 'кошмар',
            'психологический хоррор', 'инопланетяне', 'паранойя', 'жутко'
        ],
        'Noir': [
            'нуар', 'детектив', 'расследование', 'триллер', 'криминал',
            'нуарный', 'детективная', 'сыщик', 'преступление'
        ],
        'Fantasy': [
            'фэнтези', 'магия', 'дракон', 'эльф', 'волшебство', 'заклинание',
            'фантастика', 'космос', 'звёзды', 'галактика'
        ],
        'Cyberpunk': [
            'киберпанк', 'киборг', 'неон', 'хакер', 'матрица', 'робот',
            'технология', 'будущее', 'дистопия'
        ],
        'Comedy': [
            'комедия', 'юмор', 'смешно', 'шутка', 'весело', 'прикол'
        ],
        'Drama': [
            'драма', 'трагедия', 'эмоции', 'чувства', 'серьёзно'
        ]
    }
    
    for genre, patterns in genre_patterns.items():
        if any(pattern in msg for pattern in patterns):
            return genre
    
    return None

def _detect_setting(msg: str) -> str:
    """Определяет сеттинг игры"""
    setting_patterns = {
        'Urban': [
            'город', 'улица', 'мегаполис', 'панельки', 'постсоветский',
            'городок', 'метрополия', 'урбан', 'бетон'
        ],
        'Space': [
            'космос', 'space', 'звёзды', 'галактика', 'планета', 'корабль',
            'инопланетяне', 'орбита'
        ],
        'Nature': [
            'лес', 'природа', 'деревня', 'поле', 'горы', 'река', 'озеро'
        ],
        'Dungeon': [
            'подземелье', 'dungeon', 'пещера', 'лабиринт', 'тюрьма'
        ],
        'Post-Apocalyptic': [
            'постапокалипсис', 'апокалипсис', 'конец света', 'выживание'
        ]
    }
    
    for setting, patterns in setting_patterns.items():
        if any(pattern in msg for pattern in patterns):
            return setting
    
    return None

def _detect_tone(msg: str) -> str:
    """Определяет тон игры"""
    tone_patterns = {
        'Dark': [
            'мрачно', 'тоска', 'депрессия', 'грустно', 'печально',
            'мрачный', 'депрессивно', 'камерно'
        ],
        'Light': [
            'надежда', 'юмор', 'светло', 'позитивно', 'весело',
            'оптимистично', 'радостно'
        ],
        'Mysterious': [
            'загадка', 'тайна', 'мистика', 'неизвестно', 'странно'
        ],
        'Intense': [
            'напряжение', 'интенсивно', 'динамично', 'быстро', 'экшн'
        ]
    }
    
    for tone, patterns in tone_patterns.items():
        if any(pattern in msg for pattern in patterns):
            return tone
    
    return None

def _detect_characters(msg: str) -> List[str]:
    """Определяет персонажей"""
    characters = []
    
    character_patterns = {
        'detective': ['детектив', 'сыщик', 'следователь', 'инспектор'],
        'hero': ['герой', 'главный персонаж', 'протагонист'],
        'villain': ['злодей', 'антагонист', 'преступник', 'враг'],
        'npc': ['персонаж', 'npc', 'житель', 'прохожий']
    }
    
    for char_type, patterns in character_patterns.items():
        if any(pattern in msg for pattern in patterns):
            characters.append(char_type)
    
    return characters if characters else None

def _detect_plot_elements(msg: str) -> List[str]:
    """Определяет сюжетные элементы"""
    elements = []
    
    plot_patterns = {
        'mystery': ['тайна', 'загадка', 'расследование', 'неизвестно'],
        'quest': ['квест', 'задание', 'миссия', 'поиск'],
        'conflict': ['конфликт', 'борьба', 'война', 'сражение'],
        'romance': ['романтика', 'любовь', 'отношения']
    }
    
    for element, patterns in plot_patterns.items():
        if any(pattern in msg for pattern in patterns):
            elements.append(element)
    
    return elements if elements else None

def _generate_contextual_reply(original_message: str, data: Dict, context: Dict) -> str:
    """Генерирует контекстуальный ответ"""
    
    # Если ничего не найдено
    if not data:
        return "Интересно... расскажи больше, чтобы я мог понять идею игры."
    
    # Формируем описание найденных элементов
    elements = []
    for key, value in data.items():
        if key == 'characters' and isinstance(value, list):
            elements.append(f"персонажи: {', '.join(value)}")
        elif key == 'plot_elements' and isinstance(value, list):
            elements.append(f"сюжет: {', '.join(value)}")
        else:
            elements.append(f"{key} — {value}")
    
    summary = ", ".join(elements)
    
    # Генерируем ответы в зависимости от контекста
    if len(context['conversation_history']) == 1:
        # Первое сообщение
        replies = [
            f"Отлично! Записал: {summary}. Что ещё можешь рассказать об игре?",
            f"Понял! Вижу: {summary}. Расскажи больше деталей.",
            f"Интересно! Заметил: {summary}. Какие ещё есть идеи?",
            f"Записал: {summary}. Давай развивать концепцию дальше."
        ]
    else:
        # Последующие сообщения
        replies = [
            f"Дополняю: {summary}. Что ещё?",
            f"Добавляю к концепции: {summary}. Продолжай!",
            f"Обновляю: {summary}. Есть ещё идеи?",
            f"Расширяю: {summary}. Что дальше?"
        ]
    
    import random
    return random.choice(replies)
