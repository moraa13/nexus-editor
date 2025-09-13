import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from './SimpleToast';

interface ServiceWorkerContextType {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  register: () => Promise<void>;
  unregister: () => Promise<void>;
  update: () => void;
}

const ServiceWorkerContext = createContext<ServiceWorkerContextType | null>(null);

export function useServiceWorker() {
  const context = useContext(ServiceWorkerContext);
  if (!context) {
    throw new Error('useServiceWorker must be used within ServiceWorkerProvider');
  }
  return context;
}

interface ServiceWorkerProviderProps {
  children: React.ReactNode;
}

export default function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Check if Service Worker is supported
  useEffect(() => {
    setIsSupported('serviceWorker' in navigator);
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored!');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.info('You are offline. Some features may be limited.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register Service Worker
  const register = async () => {
    if (!isSupported) {
      console.warn('Service Worker not supported');
      return;
    }

    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      setRegistration(reg);
      setIsRegistered(true);

      // Handle updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
              toast.info('New version available! Refresh to update.');
            }
          });
        }
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      console.log('✅ Service Worker registered successfully');
      toast.success('App is ready for offline use!');

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      toast.error('Failed to enable offline features');
    }
  };

  // Unregister Service Worker
  const unregister = async () => {
    if (registration) {
      await registration.unregister();
      setRegistration(null);
      setIsRegistered(false);
      console.log('🗑️ Service Worker unregistered');
    }
  };

  // Update Service Worker
  const update = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  // Auto-register on mount
  useEffect(() => {
    if (isSupported && !isRegistered) {
      register();
    }
  }, [isSupported, isRegistered]);

  const contextValue: ServiceWorkerContextType = {
    isSupported,
    isRegistered,
    isOnline,
    updateAvailable,
    register,
    unregister,
    update
  };

  return (
    <ServiceWorkerContext.Provider value={contextValue}>
      {children}
      
      {/* Update notification */}
      {updateAvailable && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h4 className="font-semibold">Update Available</h4>
                <p className="text-sm opacity-90">A new version is ready to install</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={update}
                className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100 transition-colors"
              >
                Update Now
              </button>
              <button
                onClick={() => setUpdateAvailable(false)}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <div className="bg-orange-500 text-white p-3 rounded-lg shadow-lg flex items-center gap-3">
            <span className="text-xl">📡</span>
            <span className="text-sm">You are offline</span>
          </div>
        </div>
      )}
    </ServiceWorkerContext.Provider>
  );
}

// Performance monitoring component
export function PerformanceTracker() {
  const { isOnline } = useServiceWorker();

  useEffect(() => {
    if (!isOnline) return;

    // Track performance metrics
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          
          // Send metrics to service worker
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'PERFORMANCE_METRICS',
              metrics: {
                loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
                domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
                firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
                firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0,
                timestamp: Date.now()
              }
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ['navigation', 'paint'] });

    return () => {
      observer.disconnect();
    };
  }, [isOnline]);

  return null;
}
