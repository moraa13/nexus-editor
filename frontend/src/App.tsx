import { useState, useEffect } from "react";
import AdventureLayout from "./components/adventure/AdventureLayout";
import LandingPage from "./components/LandingPage";
import StartupWizard from "./components/StartupWizard";
import NexusDashboard from "./components/NexusDashboard";
import ServiceWorkerProvider, { PerformanceTracker } from "./components/ui/ServiceWorkerProvider";
import WorkerProvider from "./components/ui/WorkerManager";
import type { ProjectSettings } from "./types/project";

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'startup' | 'editor' | 'dashboard'>('dashboard');
  const [currentProject, setCurrentProject] = useState<ProjectSettings | null>(null);

  useEffect(() => {
    // Check if we should show the editor directly
    const path = window.location.pathname;
    if (path === '/editor' || path.startsWith('/editor/')) {
      setCurrentView('editor');
    }
  }, []);

  const handleNavigateToStartup = () => {
    setCurrentView('startup');
    window.history.pushState({}, '', '/startup');
  };

  const handleNavigateToEditor = () => {
    setCurrentView('editor');
    window.history.pushState({}, '', '/editor');
  };

  const handleNavigateToLanding = () => {
    setCurrentView('landing');
    setCurrentProject(null);
    window.history.pushState({}, '', '/');
  };

  const handleProjectCreated = (projectData: any) => {
    // Преобразуем данные из StartupWizard в формат ProjectSettings
    const project: ProjectSettings = {
      id: Date.now().toString(),
      name: projectData.name,
      gameSetting: {
        genre: projectData.genre,
        setting: projectData.setting,
        description: projectData.description
      },
      gameTone: {
        mood: projectData.tone,
        descriptionStyle: 'detailed'
      },
      character: null,
      events: [],
      branches: []
    };
    
    setCurrentProject(project);
    setCurrentView('editor');
    window.history.pushState({}, '', '/editor');
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

  if (currentView === 'startup') {
    return (
      <ServiceWorkerProvider>
        <WorkerProvider>
          <PerformanceTracker />
          <StartupWizard onComplete={handleProjectCreated} />
        </WorkerProvider>
      </ServiceWorkerProvider>
    );
  }

  if (currentView === 'editor') {
    return (
      <ServiceWorkerProvider>
        <WorkerProvider>
          <PerformanceTracker />
          <AdventureLayout 
            onNavigateToLanding={handleNavigateToLanding}
            initialProject={currentProject}
          />
        </WorkerProvider>
      </ServiceWorkerProvider>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <ServiceWorkerProvider>
        <WorkerProvider>
          <PerformanceTracker />
          <NexusDashboard 
            onNavigateToEditor={handleNavigateToStartup}
            currentProject={currentProject}
          />
        </WorkerProvider>
      </ServiceWorkerProvider>
    );
  }

  return <LandingPage onNavigateToEditor={handleNavigateToStartup} />;
}

