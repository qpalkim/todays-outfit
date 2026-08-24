"use server";

import { revalidatePath } from "next/cache";

import { outfitSchema } from "@/lib/validations/outfit";
import { createClient } from "@/lib/supabase/server";
import { getOutfitByDate } from "@/lib/queries/outfits";
import { mapSupabaseErrorToMessage } from "@/lib/errors";
import type { ActionResult } from "@/types/action";
import type { Outfit } from "@/types/outfit";

/**
 * 착장 기록을 저장한다. 같은 날짜(user_id, record_date)에 기존 기록이 있으면
 * 수정 모드로 전환해 outfits를 update하고 outfit_items를 전체 재연결한다.
 */
export async function createOutfit(
  input: unknown,
): Promise<ActionResult<Outfit>> {
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

  if (!parsed.data.existing_photo_url) {
    return { success: false, error: "대표 사진을 먼저 업로드해주세요" };
  }

  const userId = claims.claims.sub;
  const existing = await getOutfitByDate(userId, parsed.data.record_date);

  let outfit: Outfit;

  if (existing) {
    const { data, error } = await supabase
      .from("outfits")
      .update({
        photo_url: parsed.data.existing_photo_url,
        memo: parsed.data.memo || null,
      })
      .eq("id", existing.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error || !data) {
      return { success: false, error: mapSupabaseErrorToMessage(error) };
    }
    outfit = data;

    const { error: deleteError } = await supabase
      .from("outfit_items")
      .delete()
      .eq("outfit_id", outfit.id);

    if (deleteError) {
      return {
        success: false,
        error: mapSupabaseErrorToMessage(deleteError),
      };
    }
  } else {
    const { data, error } = await supabase
      .from("outfits")
      .insert({
        user_id: userId,
        record_date: parsed.data.record_date,
        photo_url: parsed.data.existing_photo_url,
        memo: parsed.data.memo || null,
      })
      .select()
      .single();

    if (error || !data) {
      return { success: false, error: mapSupabaseErrorToMessage(error) };
    }
    outfit = data;
  }

  if (parsed.data.clothing_item_ids.length > 0) {
    const { error: insertItemsError } = await supabase
      .from("outfit_items")
      .insert(
        parsed.data.clothing_item_ids.map((clothingItemId) => ({
          outfit_id: outfit.id,
          clothing_item_id: clothingItemId,
        })),
      );

    if (insertItemsError) {
      return {
        success: false,
        error: mapSupabaseErrorToMessage(insertItemsError),
      };
    }
  }

  revalidatePath("/");
  revalidatePath("/calendar");
  revalidatePath("/stats");
  revalidatePath("/outfits/new");
  revalidatePath(`/outfits/${parsed.data.record_date}`);

  return { success: true, data: outfit };
}

/**
 * 착장 기록을 삭제한다 — outfit_items는 ON DELETE CASCADE로 자동 정리되며,
 * Storage 사진 삭제는 브라우저 클라이언트에서 이 Action 성공 이후 수행해야 한다.
 */
export async function deleteOutfit(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: claims, error: authError } = await supabase.auth.getClaims();
  if (authError || !claims?.claims) {
    return { success: false, error: "로그인이 필요합니다" };
  }

  const { error, count } = await supabase
    .from("outfits")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", claims.claims.sub);

  if (error) {
    return { success: false, error: mapSupabaseErrorToMessage(error) };
  }

  if (!count) {
    return { success: false, error: "삭제할 기록을 찾을 수 없습니다" };
  }

  revalidatePath("/");
  revalidatePath("/calendar");
  revalidatePath("/stats");
  revalidatePath("/outfits/new");
  return { success: true, data: undefined };
}
