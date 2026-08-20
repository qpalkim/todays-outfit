"use server";

import { outfitSchema } from "@/lib/validations/outfit";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/action";
import type { Outfit } from "@/types/outfit";

/**
 * 착장 기록 생성 Server Action 골격 — 입력 검증과 인증 확인까지 처리한다.
 * 실제 Storage 업로드 → outfits insert → outfit_items bulk insert는 Task 014에서 완성한다.
 */
export async function createOutfit(input: unknown): Promise<ActionResult<Outfit>> {
  const parsed = outfitSchema.safeParse(input);
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
