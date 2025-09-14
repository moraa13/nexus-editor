import React from 'react';

interface LandingPageProps {
  onNavigateToEditor?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToEditor }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 animate-pulse"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            NEXUS
            <span className="block text-4xl md:text-5xl mt-2">EDITOR</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light leading-relaxed">
            Создавай интерактивные истории и ИИ-диалоги<br />
            <span className="text-blue-400 font-medium">в стиле Disco Elysium</span><br />
            прямо в браузере
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onNavigateToEditor}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              ▶ ЗАПУСТИТЬ РЕДАКТОР
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-medium py-4 px-8 rounded-lg transition-all duration-300"
            >
              УЗНАТЬ БОЛЬШЕ
            </button>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-2000"></div>
      </section>

      {/* How it Works */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            КАК РАБОТАЕТ NEXUS?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 p-8 rounded-lg hover:border-blue-500/60 transition-all duration-300 hover:scale-105">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-400">1. СОЗДАЙ ПЕРСОНАЖА</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Задай имя, характеристики и навыки. Каждый выбор влияет на сюжет и открывает новые возможности.
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 p-8 rounded-lg hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-purple-400">2. ПОСТРОЙ СЮЖЕТ</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Добавляй сцены, ветки выбора и скрипты событий в визуальном редакторе узлов.
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 p-8 rounded-lg hover:border-cyan-500/60 transition-all duration-300 hover:scale-105">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">3. ПОДКЛЮЧИ ИИ</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Используй ChatGPT для генерации уникальных диалогов и мыслей героев.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              ЧТО УМЕЕТ NEXUS
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "🧠", title: "ГЕНЕРАЦИЯ ДИАЛОГОВ", desc: "ИИ создаёт реплики, внутренние голоса, мысли и уникальные реакции персонажей.", color: "blue" },
              { icon: "🎲", title: "СКИЛЛ-ЧЕКИ", desc: "Механика бросков кубов как в настолках: d20, статы, влияние контекста.", color: "purple" },
              { icon: "🎭", title: "ПЕРСОНАЖИ С ХАРИЗМОЙ", desc: "Создай живых героев со своими слабостями, секретами и взглядами.", color: "cyan" },
              { icon: "📐", title: "ВИЗУАЛЬНЫЙ РЕДАКТОР", desc: "Работай с узлами, связями и действиями как в Godot или Unreal.", color: "pink" },
              { icon: "🔌", title: "API & ИНТЕГРАЦИИ", desc: "Поддержка сохранений, импорт-экспорт, внешние плагины.", color: "green" },
              { icon: "🌐", title: "ВСЁ В БРАУЗЕРЕ", desc: "Не требует установки, работает на любом устройстве.", color: "yellow" }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg hover:border-blue-500/60 transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">{feature.icon}</span>
                  <h4 className={`text-xl font-bold text-${feature.color}-400`}>{feature.title}</h4>
                </div>
                <p className="text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ГОТОВ НАЧАТЬ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 font-light">
            Создай свой первый сюжет за 5 минут
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onNavigateToEditor}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              ▶ НАЧАТЬ СЕЙЧАС
            </button>
            <a 
              href="https://github.com/moraa13/nexus-editor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border border-gray-600 text-gray-300 hover:text-white hover:border-white font-medium py-4 px-8 rounded-lg transition-all duration-300"
            >
              📁 GITHUB
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-gray-800 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            NEXUS EDITOR
          </div>
          <p className="text-gray-400 mb-6">
            Создавай интерактивные истории с ИИ
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <a href="https://github.com/moraa13/nexus-editor" className="hover:text-blue-400 transition">GitHub</a>
            <a href="#" className="hover:text-blue-400 transition">Документация</a>
            <a href="#" className="hover:text-blue-400 transition">Поддержка</a>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-xs text-gray-600">
            © 2025 Nexus Editor. Open-source проект.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
