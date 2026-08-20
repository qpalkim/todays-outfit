import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  CLOTHING_CATEGORIES,
  type ClothingCategory,
} from "@/lib/constants/category";
import type { ClothingItem } from "@/types/clothing";

export interface ItemWearCount {
  item: ClothingItem;
  count: number;
}

/** 로그인 사용자의 아이템별 착용 횟수를 착용 많은 순으로 집계한다 */
export async function getItemWearCounts(
  userId: string,
): Promise<ItemWearCount[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("outfit_items")
    .select("clothing_items!inner(*)")
    .eq("clothing_items.user_id", userId);

  if (error || !data) {
    return [];
  }

  const counts = new Map<string, ItemWearCount>();
  for (const row of data) {
    const item = row.clothing_items as unknown as ClothingItem;
    const existing = counts.get(item.id);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(item.id, { item, count: 1 });
    }
  }

  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}

/** 카테고리별 착용 횟수를 집계한다(착용 기록이 없는 카테고리는 0으로 채운다) */
export async function getCategoryDistribution(
  userId: string,
): Promise<Record<ClothingCategory, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("outfit_items")
    .select("clothing_items!inner(category, user_id)")
    .eq("clothing_items.user_id", userId);

  const distribution = Object.fromEntries(
    CLOTHING_CATEGORIES.map((category) => [category, 0]),
  ) as Record<ClothingCategory, number>;

  if (error || !data) {
    return distribution;
  }

  for (const row of data) {
    const { category } = row.clothing_items as unknown as {
      category: ClothingCategory;
    };
    distribution[category] += 1;
  }

  return distribution;
}
