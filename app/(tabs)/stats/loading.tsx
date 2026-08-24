import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <Skeleton className="h-6 w-16" />

      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border/60 bg-card p-4 shadow-md"
          >
            <Skeleton className="mb-1 h-8 w-12" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-28" />
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl bg-card px-3 py-2.5 shadow-sm"
            >
              <Skeleton className="size-11 shrink-0 rounded-md" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
