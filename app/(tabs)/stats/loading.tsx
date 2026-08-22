import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <Skeleton className="h-6 w-16" />

      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-[72px] rounded-md" />
        <Skeleton className="h-[72px] rounded-md" />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-full rounded-md" />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-28" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
