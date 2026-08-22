import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";

export default function Loading() {
  return (
    <div className="p-4">
      <Skeleton className="mb-4 h-6 w-16" />
      <div className="mb-4 flex gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-12 rounded-md" />
        ))}
      </div>
      <LoadingSkeleton variant="grid" count={9} />
    </div>
  );
}
