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
