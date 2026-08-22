import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getOutfitByDate } from "@/lib/queries/outfits";
import { formatRecordDate } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/common/item-card";
import { OutfitDetailHeader } from "@/app/outfits/[date]/back-header";

export default async function OutfitDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    redirect("/auth/login");
  }

  const outfit = await getOutfitByDate(data.claims.sub, date);

  return (
    <div className="flex flex-col gap-4">
      <OutfitDetailHeader title={formatRecordDate(date)} />

      <div className="flex flex-col gap-4 p-4 pt-0">
        {outfit ? (
          <>
            <div className="overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element -- Storage 공개 URL은 next/image remotePatterns 미등록 상태(Task 022에서 전환 예정) */}
              <img
                src={outfit.photo_url}
                alt="착장 사진"
                className="aspect-square w-full object-cover"
              />
            </div>
            {outfit.memo && (
              <p className="text-sm text-muted-foreground">{outfit.memo}</p>
            )}
            {outfit.items.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {outfit.items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item.clothing_item}
                    variant="default"
                  />
                ))}
              </div>
            )}
            <Button asChild variant="outline">
              <Link href={`/outfits/new?date=${date}`}>수정하기</Link>
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-10 text-center">
            <p className="text-sm font-medium">
              {formatRecordDate(date)} 기록이 없어요
            </p>
            <Button asChild>
              <Link href={`/outfits/new?date=${date}`}>이 날짜로 기록하기</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
