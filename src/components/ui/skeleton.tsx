import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export function Skeleton({ className, width, height, rounded = false }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton-item",
        rounded ? "rounded-full" : "rounded-lg",
        className
      )}
      style={{
        width: width || '100%',
        height: height || '1rem'
      }}
    />
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4 px-2 sm:px-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="p-3 sm:p-4 rounded-2xl border-2 border-pink-200/50 bg-white/60 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Rank circle */}
            <Skeleton 
              width="48px" 
              height="48px" 
              rounded 
              className="shrink-0"
            />
            
            {/* Avatar */}
            <Skeleton 
              width="56px" 
              height="56px" 
              rounded 
              className="shrink-0"
            />
            
            {/* Content */}
            <div className="flex-1 space-y-2">
              <Skeleton height="20px" width="60%" />
              <Skeleton height="16px" width="40%" />
              <div className="flex gap-2 mt-2">
                <Skeleton height="24px" width="60px" className="rounded-full" />
                <Skeleton height="24px" width="60px" className="rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}