import Link from "next/link";
import { BarChart3, Calendar, Camera, Shirt } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getOutfitByDate, getRecentOutfitDates } from "@/lib/queries/outfits";
import { getTodayInKst } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/common/safe-image";
import { Mascot } from "@/components/common/mascot";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const CORE_FEATURES = [
  {
    icon: Camera,
    label: "오늘의 착장 기록",
    desc: "매일 입은 옷을 사진으로 남겨요",
  },
  {
    icon: Shirt,
    label: "옷장 관리",
    desc: "가진 옷을 카테고리별로 정리해요",
  },
  {
    icon: Calendar,
    label: "지난 기록 보기",
    desc: "캘린더로 과거 착장을 확인해요",
  },
  {
    icon: BarChart3,
    label: "통계",
    desc: "자주 입은 옷과 카테고리를 살펴봐요",
  },
] as const;

/** KST 기준 today를 포함한 최근 7일의 record_date 문자열을 과거→오늘 순으로 반환한다 */
function buildLast7Days(today: string): string[] {
  const [year, month, day] = today.split("-").map(Number);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() - (6 - index));
    return date.toISOString().slice(0, 10);
  });
}

/** 서비스 소개 섹션 — 로그인 여부와 무관하게 공통으로 보여준다 */
function CoreFeatureSection() {
  return (
    <div className="rounded-2xl bg-accent/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Mascot size={36} />
        <p className="text-sm font-semibold font-point">
          오늘 뭐 입었지?는 이런 걸 도와줘요
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {CORE_FEATURES.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex flex-col gap-1.5 rounded-xl bg-card p-3 shadow-sm"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-accent">
              <Icon className="size-4 text-accent-foreground" strokeWidth={1.5} />
            </span>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 비로그인 사용자에게 보여주는 공개 홈 화면 — 서비스 소개와 로그인 유도만 담는다 */
function PublicHome() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <Mascot size={80} />
        <div>
          <h1 className="text-xl font-semibold font-point">오늘 뭐 입었지?</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            매일의 착장을 기록하는 개인 옷장 로그
          </p>
        </div>
      </div>

      <CoreFeatureSection />

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 py-10 text-center">
        <p className="text-sm font-medium">로그인하고 바로 시작해보세요</p>
        <p className="text-sm text-muted-foreground">
          오늘 입은 옷을 기록하려면 먼저 로그인이 필요해요
        </p>
        <Button asChild>
          <Link href="/auth/login">로그인하고 기록하기</Link>
        </Button>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    return <PublicHome />;
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
        <h1 className="truncate text-xl font-semibold font-point">
          {claims.email ?? "오늘 뭐 입었지?"}
        </h1>
      </div>

      <CoreFeatureSection />

      {todayOutfit ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-md">
          <p className="text-sm font-medium text-accent-foreground">
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
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 py-10 text-center">
          <Mascot size={80} />
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
          {last7Days.map((date) => {
            const [year, month] = date.split("-");
            return (
              <Link
                key={date}
                href={`/calendar?year=${year}&month=${Number(month)}&date=${date}`}
                className="flex flex-col items-center gap-1"
              >
                <span
                  className={cn(
                    "size-2.5 rounded-full",
                    recordedDateSet.has(date) ? "bg-primary" : "bg-muted",
                  )}
                />
                <span className="text-[11px] text-muted-foreground">
                  {WEEKDAY_LABELS[new Date(`${date}T00:00:00Z`).getUTCDay()]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
