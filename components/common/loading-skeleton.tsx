import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  variant: "list" | "card" | "calendar";
  count?: number;
}

/** 목록/카드/캘린더 화면의 로딩 상태를 표현하는 스켈레톤 조합 */
export function LoadingSkeleton({ variant, count = 6 }: LoadingSkeletonProps) {
  if (variant === "card") {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="aspect-square w-full rounded-md" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  if (variant === "calendar") {
    return (
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, index) => (
          <Skeleton key={index} className="aspect-square w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-16 w-full rounded-md" />
      ))}
    </div>
  );
}
