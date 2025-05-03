
import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean | string;
}

export function Skeleton({ 
  className = "", 
  width, 
  height, 
  rounded = false 
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  
  if (width) {
    style.width = typeof width === 'number' ? `${width}px` : width;
  }
  
  if (height) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }
  
  const roundedClass = rounded === true 
    ? 'rounded-full' 
    : typeof rounded === 'string' 
      ? `rounded-${rounded}` 
      : '';
  
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse shimmer ${roundedClass} ${className}`}
      style={style}
    />
  );
}

export function TextSkeleton({ lines = 1, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={14} className="rounded" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-4 dark:border-gray-700">
      <div className="flex justify-between">
        <Skeleton width={150} height={24} className="rounded" />
        <Skeleton width={70} height={24} className="rounded" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton width={100} height={16} className="rounded" />
            <Skeleton height={16} className="rounded flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
