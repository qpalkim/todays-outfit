"use server";

import { revalidatePath } from "next/cache";

import { clothingItemSchema } from "@/lib/validations/clothing-item";
import { createClient } from "@/lib/supabase/server";
import { mapSupabaseErrorToMessage } from "@/lib/errors";
import type { ActionResult } from "@/types/action";
import type { ClothingItem } from "@/types/clothing";

/** 옷 아이템을 등록한다 — 사진은 이미 ImageUploader가 Storage에 업로드를 마친 상태로, existing_photo_url을 그대로 photo_url에 저장한다 */
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

  if (!parsed.data.existing_photo_url) {
    return { success: false, error: "사진을 먼저 업로드해주세요" };
  }

  const { data, error } = await supabase
    .from("clothing_items")
    .insert({
      user_id: claims.claims.sub,
      name: parsed.data.name,
      category: parsed.data.category,
      photo_url: parsed.data.existing_photo_url,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: mapSupabaseErrorToMessage(error) };
  }

  revalidatePath("/closet");
  return { success: true, data: data as ClothingItem };
}
