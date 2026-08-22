import Link from "next/link";
import { redirect } from "next/navigation";
import { Camera } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getOutfitByDate, getRecentOutfitDates } from "@/lib/queries/outfits";
import { getTodayInKst } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/common/safe-image";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

/** KST 기준 today를 포함한 최근 7일의 record_date 문자열을 과거→오늘 순으로 반환한다 */
function buildLast7Days(today: string): string[] {
  const [year, month, day] = today.split("-").map(Number);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() - (6 - index));
    return date.toISOString().slice(0, 10);
  });
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    redirect("/auth/login");
  }

  const { claims } = data;

  const today = getTodayInKst();
  const [todayOutfit, recentDates] = await Promise.all([
    getOutfitByDate(claims.sub, today),
    getRecentOutfitDates(claims.sub, 7),
  ]);

  const recordedDateSet = new Set(recentDates);
  const last7Days = buildLast7Days(today);

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <p className="text-sm text-muted-foreground">안녕하세요</p>
        <h1 className="truncate text-xl font-semibold">
          {claims.email ?? "오늘 뭐 입었지?"}
        </h1>
      </div>

      {todayOutfit ? (
        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <p className="text-sm font-medium text-primary">
            오늘의 착장을 기록했어요
          </p>
          <div className="relative aspect-square w-full overflow-hidden rounded-md">
            <SafeImage
              src={todayOutfit.photo_url}
              alt="오늘의 착장 사진"
              sizes="(max-width: 448px) 100vw, 448px"
            />
          </div>
          {todayOutfit.items.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {todayOutfit.items
                .map((item) => item.clothing_item.name)
                .join(", ")}
            </p>
          )}
          <Button asChild variant="outline">
            <Link href={`/outfits/${today}`}>수정하기</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-10 text-center">
          <Camera className="size-10 text-muted-foreground" />
          <p className="text-sm font-medium">
            아직 오늘의 착장을 기록하지 않았어요
          </p>
          <p className="text-sm text-muted-foreground">
            오늘 입은 옷을 사진으로 남겨보세요
          </p>
          <Button asChild>
            <Link href="/outfits/new">오늘의 착장 기록하기</Link>
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">최근 7일 기록</p>
        <div className="flex items-center justify-between">
          {last7Days.map((date) => (
            <div key={date} className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "size-2.5 rounded-full",
                  recordedDateSet.has(date) ? "bg-primary" : "bg-muted",
                )}
              />
              <span className="text-[11px] text-muted-foreground">
                {WEEKDAY_LABELS[new Date(`${date}T00:00:00Z`).getUTCDay()]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
