import { useState, useEffect, useRef } from 'react';

interface PerformanceStats {
  fps: number;
  memory: number;
  renderTime: number;
  componentCount: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  showStats?: boolean;
}

export default function PerformanceMonitor({ 
  enabled = false, 
  showStats = false 
}: PerformanceMonitorProps) {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    memory: 0,
    renderTime: 0,
    componentCount: 0
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    const measurePerformance = () => {
      const now = performance.now();
      frameCountRef.current++;

      // Calculate FPS every second
      if (now - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        
        // Get memory usage if available
        const memory = (performance as any).memory 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
          : 0;

        // Count React components (rough estimate)
        const componentCount = document.querySelectorAll('[data-react-component]').length;

        setStats({
          fps,
          memory,
          renderTime: 0, // Would need more sophisticated measurement
          componentCount
        });

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationIdRef.current = requestAnimationFrame(measurePerformance);
    };

    animationIdRef.current = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [enabled]);

  if (!enabled || !showStats) return null;

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMemoryColor = (memory: number) => {
    if (memory < 50) return 'text-green-400';
    if (memory < 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed top-4 right-4 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 text-xs text-white z-50">
      <div className="font-semibold mb-2">Performance Monitor</div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span>FPS:</span>
          <span className={getFPSColor(stats.fps)}>{stats.fps}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Memory:</span>
          <span className={getMemoryColor(stats.memory)}>{stats.memory}MB</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Components:</span>
          <span className="text-gray-300">{stats.componentCount}</span>
        </div>
      </div>

      {/* Performance indicators */}
      <div className="mt-2 flex gap-1">
        <div className={`w-2 h-2 rounded-full ${stats.fps >= 55 ? 'bg-green-400' : stats.fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'}`} title="FPS" />
        <div className={`w-2 h-2 rounded-full ${stats.memory < 50 ? 'bg-green-400' : stats.memory < 100 ? 'bg-yellow-400' : 'bg-red-400'}`} title="Memory" />
      </div>
    </div>
  );
}

// Hook for measuring component render performance
export function useRenderPerformance(componentName: string) {
  const renderStartRef = useRef<number>();
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderStartRef.current = performance.now();
    renderCountRef.current++;

    return () => {
      if (renderStartRef.current) {
        const renderTime = performance.now() - renderStartRef.current;
        if (renderTime > 16) { // Log slow renders (>16ms)
          console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
        }
      }
    };
  });

  return {
    renderCount: renderCountRef.current
  };
}
