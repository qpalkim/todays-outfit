"use server";

import { clothingItemSchema } from "@/lib/validations/clothing-item";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/action";
import type { ClothingItem } from "@/types/clothing";

/**
 * 옷 아이템 등록 Server Action 골격 — 입력 검증과 인증 확인까지 처리한다.
 * 실제 Storage 업로드 → clothing_items insert는 Task 012에서 완성한다.
 */
export async function createClothingItem(
  input: unknown,
): Promise<ActionResult<ClothingItem>> {
  const parsed = clothingItemSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "입력값을 확인해주세요",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const supabase = await createClient();
  const { data: claims, error: authError } = await supabase.auth.getClaims();
  if (authError || !claims?.claims) {
    return { success: false, error: "로그인이 필요합니다" };
  }

  return { success: false, error: "아직 구현되지 않았습니다" };
}
