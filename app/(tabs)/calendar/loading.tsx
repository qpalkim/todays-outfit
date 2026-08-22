import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-6 w-16" />
      <LoadingSkeleton variant="calendar" />
    </div>
  );
}
