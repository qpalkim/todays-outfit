import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <Skeleton className="h-6 w-12" />

      <div className="flex flex-col gap-2 rounded-lg border p-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-[72px] rounded-md" />
        <Skeleton className="h-[72px] rounded-md" />
      </div>

      <Skeleton className="h-10 w-24 rounded-md" />

      <Skeleton className="h-16 w-full rounded-md" />
    </div>
  );
}
