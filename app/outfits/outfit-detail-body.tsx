import Link from "next/link";
import { Calendar as CalendarIcon } from "lucide-react";

import type { OutfitWithItems } from "@/types/outfit";
import { formatRecordDate } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/common/item-card";
import { SafeImage } from "@/components/common/safe-image";
import { DeleteOutfitDialog } from "@/app/outfits/[date]/delete-outfit-dialog";

interface OutfitDetailBodyProps {
  outfit: OutfitWithItems | null;
  date: string;
}

/** 착장 상세 본문 — 사진/메모/연결 아이템 또는 미기록 안내를 렌더링한다(데이터 조회는 호출부 책임) */
export function OutfitDetailBody({ outfit, date }: OutfitDetailBodyProps) {
  if (!outfit) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 py-10 text-center">
        <CalendarIcon className="size-10 text-muted-foreground" strokeWidth={1.5} />
        <p className="text-sm font-medium">
          {formatRecordDate(date)} 기록이 없어요
        </p>
        <p className="text-sm text-muted-foreground">
          이 날짜에 입은 옷을 사진으로 남겨보세요
        </p>
        <Button asChild>
          <Link href={`/outfits/new?date=${date}`}>이 날짜로 기록하기</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="relative aspect-square w-full overflow-hidden rounded-md">
        <SafeImage
          src={outfit.photo_url}
          alt="착장 사진"
          sizes="(max-width: 448px) 100vw, 448px"
        />
      </div>
      {outfit.memo && (
        <p className="text-sm text-muted-foreground">{outfit.memo}</p>
      )}
      {outfit.items.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {outfit.items.map((item) => (
            <ItemCard key={item.id} item={item.clothing_item} variant="default" />
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/outfits/new?date=${date}`}>수정하기</Link>
        </Button>
        <DeleteOutfitDialog outfitId={outfit.id} photoUrl={outfit.photo_url} />
      </div>
    </>
  );
}
