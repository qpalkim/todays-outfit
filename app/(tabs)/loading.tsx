import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-40" />
      </div>
      <LoadingSkeleton variant="card" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <div className="flex items-center justify-between">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="size-2.5 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
