import { lazy, Suspense } from 'react';

// Lazy load the InventoryPanel component
const InventoryPanel = lazy(() => import('./InventoryPanel'));

interface LazyInventoryPanelProps {
  projectId?: string;
  selectedCharacterId?: string;
  onCharacterSelect?: (characterId: string) => void;
}

export default function LazyInventoryPanel({ 
  projectId, 
  selectedCharacterId,
  onCharacterSelect 
}: LazyInventoryPanelProps) {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex flex-col bg-gray-900">
        {/* Header skeleton */}
        <div className="p-4 border-b border-gray-700">
          <div className="h-6 bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse"></div>
        </div>

        {/* Tab navigation skeleton */}
        <div className="flex border-b border-gray-700">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-1 px-4 py-3">
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-8 bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <InventoryPanel
        projectId={projectId}
        selectedCharacterId={selectedCharacterId}
        onCharacterSelect={onCharacterSelect}
      />
    </Suspense>
  );
}
