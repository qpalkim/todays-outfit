"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import type { ClothingItem } from "@/types/clothing";
import type { OutfitWithItems } from "@/types/outfit";
import { outfitSchema } from "@/lib/validations/outfit";

/**
 * clothing_item_ids가 `.default([])`를 사용해 zod의 input/output 타입이 갈리므로,
 * RHF 필드 값은 파싱 전 타입인 z.input을 기준으로 삼는다(zodResolver 요구사항).
 */
type OutfitFormFields = z.input<typeof outfitSchema>;
import { formatRecordDate } from "@/lib/utils/date";
import { createOutfit } from "@/app/outfits/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/common/image-uploader";
import { ItemPicker } from "@/components/common/item-picker";

interface OutfitFormProps {
  userId: string;
  recordDate: string;
  clothingItems: ClothingItem[];
  existingOutfit: OutfitWithItems | null;
}

/** 오늘의 착장 기록 폼 — 같은 날짜에 기존 기록이 있으면 수정 모드로 프리필된다 */
export function OutfitForm({
  userId,
  recordDate,
  clothingItems,
  existingOutfit,
}: OutfitFormProps) {
  const router = useRouter();

  const form = useForm<OutfitFormFields>({
    resolver: zodResolver(outfitSchema),
    defaultValues: {
      record_date: recordDate,
      photo_file: null,
      existing_photo_url: existingOutfit?.photo_url,
      memo: existingOutfit?.memo ?? "",
      clothing_item_ids:
        existingOutfit?.items.map((item) => item.clothing_item_id) ?? [],
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const photoError = form.formState.errors.photo_file?.message;
  const selectedIds = form.watch("clothing_item_ids") ?? [];

  async function onSubmit(values: OutfitFormFields) {
    let result;
    try {
      result = await createOutfit(values);
    } catch {
      toast.error("네트워크 연결을 확인해주세요");
      return;
    }

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof OutfitFormFields, {
            message: messages[0],
          });
        }
      }
      toast.error(result.error);
      return;
    }

    toast.success(
      existingOutfit ? "착장 기록을 수정했어요" : "오늘의 착장을 기록했어요",
    );
    router.push("/");
    router.refresh();
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 p-4"
    >
      <p className="text-sm text-muted-foreground">
        {formatRecordDate(recordDate)}
      </p>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">대표 사진</label>
        <ImageUploader
          bucket="outfit-photos"
          userId={userId}
          value={form.watch("existing_photo_url") ?? null}
          onChange={(url) => {
            form.setValue("existing_photo_url", url ?? undefined, {
              shouldValidate: true,
            });
            form.setValue("photo_file", null);
          }}
          disabled={isSubmitting}
        />
        {photoError && (
          <p className="text-sm text-destructive">{photoError}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">아이템 선택(선택)</label>
        {clothingItems.length === 0 ? (
          <div className="flex flex-col items-start gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            아직 등록한 옷이 없어요.
            <Button asChild variant="outline" size="sm">
              <Link href="/closet/new">아이템 먼저 등록하기</Link>
            </Button>
          </div>
        ) : (
          <ItemPicker
            items={clothingItems}
            initialSelectedIds={selectedIds}
            onConfirm={(ids) => form.setValue("clothing_item_ids", ids)}
            trigger={
              <Button type="button" variant="outline">
                아이템 선택({selectedIds.length}개)
              </Button>
            }
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="memo" className="text-sm font-medium">
          메모(선택)
        </label>
        <Textarea
          id="memo"
          placeholder="오늘의 착장에 대한 메모를 남겨보세요"
          disabled={isSubmitting}
          {...form.register("memo")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {existingOutfit ? "수정하기" : "저장하기"}
      </Button>
    </form>
  );
}
