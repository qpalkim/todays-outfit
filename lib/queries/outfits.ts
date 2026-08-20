import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { ClothingItem } from "@/types/clothing";
import type { OutfitWithItems } from "@/types/outfit";

/** 특정 날짜의 착장 기록을 연결된 아이템과 함께 조회한다(기록이 없으면 null) */
export async function getOutfitByDate(
  userId: string,
  recordDate: string,
): Promise<OutfitWithItems | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("outfits")
    .select(
      "*, outfit_items(id, outfit_id, clothing_item_id, clothing_items(*))",
    )
    .eq("user_id", userId)
    .eq("record_date", recordDate)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const { outfit_items, ...outfit } = data;

  return {
    ...outfit,
    items: (outfit_items ?? [])
      .filter((outfitItem) => outfitItem.clothing_items !== null)
      .map((outfitItem) => {
        const { clothing_items, ...rest } = outfitItem;
        return { ...rest, clothing_item: clothing_items as ClothingItem };
      }),
  };
}

/** 특정 연·월(month는 1~12)에 기록이 존재하는 record_date 목록을 반환한다 */
export async function getOutfitDatesInMonth(
  userId: string,
  year: number,
  month: number,
): Promise<string[]> {
  const supabase = await createClient();
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = new Date(year, month, 1);
  const endDate = `${nextMonth.getFullYear()}-${String(
    nextMonth.getMonth() + 1,
  ).padStart(2, "0")}-01`;

  const { data, error } = await supabase
    .from("outfits")
    .select("record_date")
    .eq("user_id", userId)
    .gte("record_date", startDate)
    .lt("record_date", endDate);

  if (error || !data) {
    return [];
  }

  return data.map((row) => row.record_date);
}
