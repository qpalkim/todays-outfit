import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 p-4">
        <Skeleton className="size-9 rounded-md" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="flex flex-col gap-4 p-4 pt-0">
        <LoadingSkeleton variant="card" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="aspect-square w-full rounded-sm" />
          ))}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}
