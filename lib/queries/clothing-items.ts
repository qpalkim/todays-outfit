import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { ClothingCategory } from "@/lib/constants/category";
import type { ClothingItem } from "@/types/clothing";

/** 로그인 사용자의 옷장 아이템을 최신순으로 조회한다(category 지정 시 해당 카테고리만) */
export async function getClothingItems(
  userId: string,
  category?: ClothingCategory,
): Promise<ClothingItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("clothing_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error || !data) {
    return [];
  }

  return data as ClothingItem[];
}

/** 특정 아이템을 id로 조회한다(본인 소유가 아니면 null) */
export async function getClothingItemById(
  id: string,
  userId: string,
): Promise<ClothingItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clothing_items")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as ClothingItem;
}

/** 특정 아이템이 연결된 착장 기록 개수를 반환한다(본인 소유 착장만 집계) */
export async function getOutfitCountUsingItem(
  itemId: string,
  userId: string,
): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("outfit_items")
    .select("id, outfits!inner(user_id)", { count: "exact", head: true })
    .eq("clothing_item_id", itemId)
    .eq("outfits.user_id", userId);

  if (error || count === null) {
    return 0;
  }

  return count;
}

/** 로그인 사용자가 등록한 옷 아이템 총 개수를 반환한다 */
export async function getClothingItemCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("clothing_items")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error || count === null) {
    return 0;
  }

  return count;
}
