import React from 'react';

// Single skeleton product card matching the Card layout
export function SkeletonCard() {
  return (
    <div className="w-full bg-white rounded overflow-hidden">
      {/* Image area */}
      <div className="skeleton w-full aspect-[3/4]" />
      {/* Info area */}
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-3/5 rounded" />
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="skeleton h-3 w-2/5 rounded" />
      </div>
    </div>
  );
}

// Skeleton grid — pass count to render N skeletons
export function SkeletonGrid({ count = 10, cols = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' }) {
  return (
    <div className={`grid ${cols} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Skeleton for 4-col grids (BestSeller layout)
export function SkeletonGrid4({ count = 8 }) {
  return <SkeletonGrid count={count} cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4" />;
}

// LazyImage — renders a blurred placeholder then fades in real image
export function LazyImage({ src, alt, className }) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div className="relative w-full h-full bg-gray-100">
      {/* Placeholder shimmer */}
      {!loaded && <div className="skeleton absolute inset-0 w-full h-full" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

export default SkeletonCard;
