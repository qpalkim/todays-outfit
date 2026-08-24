"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import type { ClothingItem } from "@/types/clothing";
import type { OutfitWithItems } from "@/types/outfit";
import { outfitSchema } from "@/lib/validations/outfit";
import { deleteImage, getStoragePathFromPublicUrl } from "@/lib/storage/upload";

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
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

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
  const isEditMode = !!existingOutfit;

  /** 수정 모드 진입 시 원래 저장돼 있던 사진 — 저장 실패해도 절대 지우면 안 된다 */
  const initialPhotoUrl = existingOutfit?.photo_url ?? null;
  /** 이번 세션에 새로 업로드했지만 아직 저장이 확정되지 않은 사진 URL(저장 실패 시 정리 대상) */
  const pendingUploadUrlRef = useRef<string | null>(null);

  function buildDefaultValues(): OutfitFormFields {
    return {
      record_date: recordDate,
      photo_file: null,
      existing_photo_url: existingOutfit?.photo_url,
      memo: existingOutfit?.memo ?? "",
      clothing_item_ids:
        existingOutfit?.items.map((item) => item.clothing_item_id) ?? [],
    };
  }

  const form = useForm<OutfitFormFields>({
    resolver: zodResolver(outfitSchema),
    mode: "onChange",
    defaultValues: buildDefaultValues(),
  });

  const isSubmitting = form.formState.isSubmitting;
  const photoError = form.formState.errors.photo_file?.message;
  const memoError = form.formState.errors.memo?.message;
  const selectedIds = form.watch("clothing_item_ids") ?? [];

  useUnsavedChangesWarning(form.formState.isDirty && !isSubmitting);

  // 같은 라우트를 재방문(캐시된 클라이언트 라우트 재사용 등)해도 서버가 새로 내려준
  // recordDate/existingOutfit을 폼이 확실히 반영하도록 값이 바뀌면 다시 초기화한다
  useEffect(() => {
    pendingUploadUrlRef.current = null;
    form.reset(buildDefaultValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordDate, existingOutfit]);

  /**
   * 이번 세션에 새로 업로드했지만 DB에 저장되지 못한 사진을 Storage에서 정리하고
   * 폼을 원래 사진으로 되돌린다(저장 실패 시에만 호출되는 베스트에포트 롤백).
   */
  function cleanupPendingUpload() {
    const pendingUrl = pendingUploadUrlRef.current;
    if (!pendingUrl) {
      return;
    }

    const path = getStoragePathFromPublicUrl("outfit-photos", pendingUrl);
    if (path) {
      void deleteImage({ bucket: "outfit-photos", path });
    }

    pendingUploadUrlRef.current = null;
    form.setValue("existing_photo_url", initialPhotoUrl ?? undefined);
  }

  async function onSubmit(values: OutfitFormFields) {
    let result;
    try {
      result = await createOutfit(values);
    } catch {
      cleanupPendingUpload();
      toast.error("네트워크 연결을 확인해주세요");
      return;
    }

    if (!result.success) {
      cleanupPendingUpload();
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

    pendingUploadUrlRef.current = null;
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
        <label htmlFor="outfit-photo" className="text-sm font-medium">
          대표 사진
        </label>
        <ImageUploader
          id="outfit-photo"
          bucket="outfit-photos"
          userId={userId}
          value={form.watch("existing_photo_url") ?? null}
          onChange={(url) => {
            pendingUploadUrlRef.current =
              url && url !== initialPhotoUrl ? url : null;
            form.setValue("existing_photo_url", url ?? undefined, {
              shouldValidate: true,
              shouldDirty: true,
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
        <span className="text-sm font-medium">아이템 선택(선택)</span>
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
            onConfirm={(ids) =>
              form.setValue("clothing_item_ids", ids, { shouldDirty: true })
            }
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
          inputMode="text"
          autoComplete="off"
          {...form.register("memo")}
        />
        {memoError && <p className="text-sm text-destructive">{memoError}</p>}
      </div>

      <Button
        type="submit"
        disabled={
          isSubmitting ||
          !form.formState.isValid ||
          (isEditMode && !form.formState.isDirty)
        }
      >
        {existingOutfit ? "수정하기" : "저장하기"}
      </Button>
    </form>
  );
}
