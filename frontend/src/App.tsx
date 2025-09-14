import { useState, useEffect } from "react";
import AdventureLayout from "./components/adventure/AdventureLayout";
import LandingPage from "./components/LandingPage";
import ServiceWorkerProvider, { PerformanceTracker } from "./components/ui/ServiceWorkerProvider";
import WorkerProvider from "./components/ui/WorkerManager";

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'editor'>('landing');

  useEffect(() => {
    // Check if we should show the editor directly
    const path = window.location.pathname;
    if (path === '/editor' || path.startsWith('/editor/')) {
      setCurrentView('editor');
    }
  }, []);

  const handleNavigateToEditor = () => {
    setCurrentView('editor');
    window.history.pushState({}, '', '/editor');
  };

  const handleNavigateToLanding = () => {
    setCurrentView('landing');
    window.history.pushState({}, '', '/');
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/editor' || path.startsWith('/editor/')) {
        setCurrentView('editor');
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentView === 'editor') {
    return (
      <ServiceWorkerProvider>
        <WorkerProvider>
          <PerformanceTracker />
          <AdventureLayout onNavigateToLanding={handleNavigateToLanding} />
        </WorkerProvider>
      </ServiceWorkerProvider>
    );
  }

  return <LandingPage onNavigateToEditor={handleNavigateToEditor} />;
}

