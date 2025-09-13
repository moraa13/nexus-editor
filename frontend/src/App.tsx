import AdventureLayout from "./components/adventure/AdventureLayout";
import ServiceWorkerProvider, { PerformanceTracker } from "./components/ui/ServiceWorkerProvider";
import WorkerProvider from "./components/ui/WorkerManager";

export default function App() {
  return (
    <ServiceWorkerProvider>
      <WorkerProvider>
        <PerformanceTracker />
        <AdventureLayout />
      </WorkerProvider>
    </ServiceWorkerProvider>
  );
}

