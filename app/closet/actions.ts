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
  revalidatePath("/stats");
  return { success: true, data: data as ClothingItem };
}

/**
 * 옷 아이템을 수정한다 — 사진 교체 시 이전 Storage 파일 정리는 ImageUploader가
 * 브라우저에서 이미 처리하므로 이 Server Action은 DB 갱신만 수행한다.
 */
export async function updateClothingItem(
  id: string,
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
    .update({
      name: parsed.data.name,
      category: parsed.data.category,
      photo_url: parsed.data.existing_photo_url,
    })
    .eq("id", id)
    .eq("user_id", claims.claims.sub)
    .select()
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error
        ? mapSupabaseErrorToMessage(error)
        : "수정할 아이템을 찾을 수 없습니다",
    };
  }

  revalidatePath("/closet");
  revalidatePath(`/closet/${id}/edit`);
  revalidatePath("/stats");
  return { success: true, data: data as ClothingItem };
}

/**
 * 옷 아이템을 삭제한다 — outfit_items는 ON DELETE CASCADE로 자동 정리되며,
 * Storage 파일 삭제는 브라우저 클라이언트에서 이 Action 성공 이후 수행해야 한다.
 */
export async function deleteClothingItem(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: claims, error: authError } = await supabase.auth.getClaims();
  if (authError || !claims?.claims) {
    return { success: false, error: "로그인이 필요합니다" };
  }

  const { error, count } = await supabase
    .from("clothing_items")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", claims.claims.sub);

  if (error) {
    return { success: false, error: mapSupabaseErrorToMessage(error) };
  }

  if (!count) {
    return { success: false, error: "삭제할 아이템을 찾을 수 없습니다" };
  }

  revalidatePath("/closet");
  revalidatePath("/stats");
  return { success: true, data: undefined };
}
