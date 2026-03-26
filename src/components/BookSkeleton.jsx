export default function BookSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <div className="aspect-[4/5] skeleton-shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-4 skeleton-shimmer rounded-lg w-full" />
        <div className="h-3 skeleton-shimmer rounded-lg w-2/3" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-5 skeleton-shimmer rounded-lg w-16" />
          <div className="h-4 skeleton-shimmer rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}
