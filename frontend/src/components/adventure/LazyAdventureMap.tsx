import { lazy, Suspense } from 'react';

// Lazy load the heavy AdventureMap component
const AdventureMap = lazy(() => import('./AdventureMap'));

interface LazyAdventureMapProps {
  projectId?: string;
  onNodeSelect?: (nodeId: string) => void;
}

export default function LazyAdventureMap({ projectId, onNodeSelect }: LazyAdventureMapProps) {
  return (
    <Suspense fallback={
      <div className="relative w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 overflow-hidden">
        {/* Loading skeleton */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mb-4 animate-pulse">
              🗺️
            </div>
            <div className="text-white text-lg font-semibold">Loading Adventure Map...</div>
            <div className="text-gray-400 text-sm">Preparing your story world</div>
            
            {/* Loading dots animation */}
            <div className="flex justify-center mt-4 space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <AdventureMap projectId={projectId} onNodeSelect={onNodeSelect} />
    </Suspense>
  );
}
