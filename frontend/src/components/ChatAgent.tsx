import { useState, useEffect, useRef } from 'react';
// import { toast } from '../ui/SimpleToast'; // TODO: Implement toast notifications
import type { ProjectSettings } from '../types/project';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatAgentProps {
  currentProject: ProjectSettings | null;
  onProjectRequired: () => void;
}

export default function ChatAgent({ currentProject, onProjectRequired }: ChatAgentProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Добавляем приветственное сообщение
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: 'Привет! Я ваш ИИ-помощник для создания игр в стиле Disco Elysium. Сначала создайте проект, чтобы начать работу.',
        timestamp: new Date()
      }]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Проверяем, есть ли проект
    if (!currentProject) {
      console.error('Сначала создайте проект для использования чата');
      onProjectRequired();
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Здесь будет вызов к backend API для генерации ответа
      const response = await fetch('http://localhost:8000/api/chat/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          projectId: currentProject.id,
          context: {
            genre: currentProject.gameSetting?.genre || 'noir',
            tone: currentProject.gameTone?.mood || 'dark-noir',
            project_name: currentProject.name || '',
            setting: currentProject.gameSetting?.setting || '',
            character: currentProject.character || {}
          }
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при генерации ответа');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'Извините, не удалось сгенерировать ответ.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      console.error('Ошибка при отправке сообщения');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте еще раз.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#36393F] text-white">
      {/* Header */}
      <div className="p-4 border-b border-[#40444B] bg-[#2F3136]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#5865F2] rounded-full flex items-center justify-center">
            <span className="text-sm">🤖</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">ИИ-Помощник</h2>
            <p className="text-sm text-[#B9BBBE]">
              {currentProject ? `Проект: ${currentProject.name}` : 'Создайте проект для начала работы'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-[#5865F2] text-white'
                  : 'bg-[#40444B] text-[#DCDDDE]'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className="text-xs opacity-60 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#40444B] text-[#DCDDDE] px-4 py-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#B9BBBE] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#B9BBBE] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-[#B9BBBE] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#40444B] bg-[#2F3136]">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={currentProject ? "Введите сообщение..." : "Создайте проект для начала чата"}
            disabled={!currentProject || isLoading}
            className="flex-1 px-4 py-3 bg-[#40444B] border border-[#4F545C] rounded-lg text-white placeholder-[#72767D] focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent disabled:opacity-50 transition-all duration-200"
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentProject || isLoading || !inputMessage.trim()}
            className="px-6 py-3 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Отправить'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
