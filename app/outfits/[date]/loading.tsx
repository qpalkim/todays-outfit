import { Skeleton } from "@/components/ui/skeleton";

/**
 * 기록 있음(사진+아이템 그리드+버튼 2개)/기록 없음(빈 상태+버튼 1개) 두 레이아웃 중
 * 어느 쪽이 나올지 서버가 로딩 시점엔 알 수 없어, 두 경우 모두 시프트가 작은 중립 형태로 절충한다
 */
export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 p-4">
        <Skeleton className="size-9 rounded-md" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="flex flex-col gap-4 p-4 pt-0">
        <Skeleton className="aspect-square w-full rounded-md" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}
