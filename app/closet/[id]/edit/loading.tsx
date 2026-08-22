import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="mx-4 h-6 w-32" />
      <div className="p-4 pt-0">
        <LoadingSkeleton variant="form" />
      </div>
      <div className="px-4 pb-4">
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
    </div>
  );
}
