import { redirect } from "next/navigation";
import { ImageIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getItemWearCounts, getCategoryDistribution } from "@/lib/queries/stats";
import { getOutfitCount } from "@/lib/queries/outfits";
import { getClothingItemCount } from "@/lib/queries/clothing-items";
import {
  CLOTHING_CATEGORIES,
  CLOTHING_CATEGORY_EMOJIS,
  CLOTHING_CATEGORY_LABELS,
  type ClothingCategory,
} from "@/lib/constants/category";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/common/empty-state";
import { SafeImage } from "@/components/common/safe-image";
import { Mascot } from "@/components/common/mascot";

const TOP_RANKING_LIMIT = 5;

/**
 * 정수 카운트 배열을 반올림 오차 없이 합이 정확히 100이 되는 백분율 배열로 변환한다
 * (최대 나머지법 — 각 값을 내림한 뒤, 소수부가 큰 항목부터 1씩 배분)
 */
function toPercentages(counts: number[]): number[] {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total === 0) {
    return counts.map(() => 0);
  }

  const raw = counts.map((count) => (count / total) * 100);
  const floored = raw.map(Math.floor);
  const remainder = 100 - floored.reduce((sum, value) => sum + value, 0);

  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  const result = [...floored];
  for (let i = 0; i < remainder; i++) {
    result[order[i].index] += 1;
  }
  return result;
}

export default async function StatsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    redirect("/auth/login");
  }

  const userId = data.claims.sub;

  const [itemWearCounts, categoryDistribution, outfitCount, clothingItemCount] =
    await Promise.all([
      getItemWearCounts(userId),
      getCategoryDistribution(userId),
      getOutfitCount(userId),
      getClothingItemCount(userId),
    ]);

  const categoryPercentages = toPercentages(
    CLOTHING_CATEGORIES.map((category) => categoryDistribution[category]),
  );
  const categoryPercentageMap = Object.fromEntries(
    CLOTHING_CATEGORIES.map((category, index) => [
      category,
      categoryPercentages[index],
    ]),
  ) as Record<ClothingCategory, number>;

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-xl font-semibold font-point">통계</h1>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-md">
          <p className="text-2xl font-semibold font-point">{outfitCount}</p>
          <p className="text-sm text-muted-foreground">총 기록 일수</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-md">
          <p className="text-2xl font-semibold font-point">{clothingItemCount}</p>
          <p className="text-sm text-muted-foreground">등록 아이템 수</p>
        </div>
      </div>

      {itemWearCounts.length === 0 ? (
        <EmptyState
          title="아직 통계를 낼 기록이 없어요"
          description="오늘의 착장을 기록하면 통계를 볼 수 있어요"
          icon={<Mascot size={72} />}
        />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">카테고리별 착용 비중</p>
            {CLOTHING_CATEGORIES.map((category) => (
              <div key={category} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    {CLOTHING_CATEGORY_EMOJIS[category]}{" "}
                    {CLOTHING_CATEGORY_LABELS[category]}
                  </span>
                  <span className="text-muted-foreground">
                    {categoryPercentageMap[category]}%
                  </span>
                </div>
                <Progress value={categoryPercentageMap[category]} />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">아이템별 착용 순위</p>
            <div className="flex flex-col gap-2.5">
              {itemWearCounts.slice(0, TOP_RANKING_LIMIT).map(({ item, count }, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl bg-card px-3 py-2.5 shadow-sm"
                >
                  <span className="w-5 shrink-0 text-center text-sm font-medium text-muted-foreground font-point">
                    {index + 1}
                  </span>
                  <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                    {item.photo_url ? (
                      <SafeImage
                        src={item.photo_url}
                        alt={item.name}
                        sizes="44px"
                      />
                    ) : (
                      <ImageIcon className="size-4 text-muted-foreground" strokeWidth={1.5} />
                    )}
                  </div>
                  <p className="flex-1 truncate text-sm">{item.name}</p>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {count}회
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
