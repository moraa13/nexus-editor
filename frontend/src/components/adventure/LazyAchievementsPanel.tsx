import { lazy, Suspense } from 'react';

// Lazy load the AchievementsPanel component
const AchievementsPanel = lazy(() => import('./AchievementsPanel'));

interface LazyAchievementsPanelProps {
  projectId?: string;
}

export default function LazyAchievementsPanel({ projectId }: LazyAchievementsPanelProps) {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex flex-col bg-gray-900">
        {/* Header skeleton */}
        <div className="p-4 border-b border-gray-700">
          <div className="h-6 bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
        </div>

        {/* Progress overview skeleton */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded w-12 animate-pulse"></div>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden animate-pulse"></div>
        </div>

        {/* Filter tabs skeleton */}
        <div className="flex border-b border-gray-700">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-1 px-4 py-3">
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Achievements grid skeleton */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-20 h-20 bg-gray-700 rounded-xl mb-2 mx-auto"></div>
                <div className="h-4 bg-gray-700 rounded mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <AchievementsPanel projectId={projectId} />
    </Suspense>
  );
}
