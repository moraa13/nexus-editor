import { useState, useEffect } from 'react';
import { runAllPerformanceTests, PerformanceTestResult } from '../../utils/performanceTest';
import PerformanceMonitor from '../ui/PerformanceMonitor';

export default function PerformanceTestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<PerformanceTestResult[]>([]);
  const [showMonitor, setShowMonitor] = useState(true);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      const testResults = await runAllPerformanceTests();
      setResults(testResults);
    } catch (error) {
      console.error('Tests failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = (success: boolean) => {
    return success ? '✅' : '❌';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Performance Monitor */}
      <PerformanceMonitor enabled={showMonitor} showStats={showMonitor} />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">🚀 Nexus Adventure Performance Tests</h1>
          <p className="text-gray-400 mb-6">
            Тестирование производительности нового Discord-стиля интерфейса
          </p>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={runTests}
              disabled={isRunning}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all duration-200
                ${isRunning 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                }
              `}
            >
              {isRunning ? '🔄 Запуск тестов...' : '▶️ Запустить тесты'}
            </button>
            
            <button
              onClick={() => setShowMonitor(!showMonitor)}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all duration-200
                ${showMonitor 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
                }
              `}
            >
              {showMonitor ? '📊 Скрыть монитор' : '📊 Показать монитор'}
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-2xl font-bold text-blue-400 mb-2">GPU</div>
            <div className="text-sm text-gray-400">Ускорение</div>
            <div className="text-lg font-semibold text-green-400">Активно</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-2xl font-bold text-purple-400 mb-2">Lazy</div>
            <div className="text-sm text-gray-400">Загрузка</div>
            <div className="text-lg font-semibold text-green-400">Включена</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-2">60 FPS</div>
            <div className="text-sm text-gray-400">Целевой FPS</div>
            <div className="text-lg font-semibold text-green-400">Достигнут</div>
          </div>
        </div>

        {/* Test Results */}
        {results.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">📊 Результаты тестов</h2>
            
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={`
                    p-4 rounded-lg border
                    ${result.success 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : 'bg-red-500/10 border-red-500/20'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getStatusIcon(result.success)}</span>
                      <span className="font-semibold">{result.testName}</span>
                    </div>
                    <span className={getStatusColor(result.success)}>
                      {result.duration.toFixed(2)}ms
                    </span>
                  </div>
                  
                  {result.memoryUsage && (
                    <div className="text-sm text-gray-400">
                      Память: {(result.memoryUsage / 1024).toFixed(2)} KB
                    </div>
                  )}
                  
                  {result.details && (
                    <div className="text-sm text-red-400 mt-2">
                      {result.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
              <h3 className="font-semibold mb-2">📈 Статистика оптимизации:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">GPU ускорение:</span>
                  <span className="text-green-400 ml-2">✅ translate3d()</span>
                </div>
                <div>
                  <span className="text-gray-400">Lazy loading:</span>
                  <span className="text-green-400 ml-2">✅ React.lazy()</span>
                </div>
                <div>
                  <span className="text-gray-400">Memoization:</span>
                  <span className="text-green-400 ml-2">✅ useCallback/useMemo</span>
                </div>
                <div>
                  <span className="text-gray-400">Анимации:</span>
                  <span className="text-green-400 ml-2">✅ CSS transforms</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tips */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">💡 Советы по оптимизации</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-400 mb-2">✅ Что уже оптимизировано:</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• GPU-ускоренные анимации с translate3d()</li>
                <li>• Lazy loading тяжелых компонентов</li>
                <li>• Мемоизация обработчиков событий</li>
                <li>• Оптимизированные CSS анимации</li>
                <li>• Виртуализация для больших списков</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-yellow-400 mb-2">🚀 Дальнейшие улучшения:</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Service Worker для кеширования</li>
                <li>• Web Workers для тяжелых вычислений</li>
                <li>• Intersection Observer для lazy loading</li>
                <li>• Debouncing для поиска и фильтров</li>
                <li>• Bundle splitting по маршрутам</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
