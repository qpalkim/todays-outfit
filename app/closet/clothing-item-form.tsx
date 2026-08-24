"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import type { ClothingItem } from "@/types/clothing";
import type { ActionResult } from "@/types/action";
import {
  clothingItemSchema,
  type ClothingItemInput,
} from "@/lib/validations/clothing-item";
import { deleteImage, getStoragePathFromPublicUrl } from "@/lib/storage/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CategorySelect } from "@/components/common/category-select";
import { ImageUploader } from "@/components/common/image-uploader";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

interface ClothingItemFormProps {
  mode: "create" | "edit";
  userId: string;
  initialValues?: ClothingItem;
  /** 실제 저장을 수행하는 Server Action — create에는 createClothingItem, edit에는 updateClothingItem(id, ...)을 바인딩해 전달한다 */
  onSubmitAction: (
    values: ClothingItemInput,
  ) => Promise<ActionResult<ClothingItem>>;
  /** edit 모드에서 저장 버튼 옆에 나란히 보여줄 삭제 버튼(DeleteItemDialog) */
  deleteSlot?: React.ReactNode;
}

/** 옷 아이템 등록/수정 겸용 폼 — 실제 저장 로직은 onSubmitAction으로 주입받는다 */
export function ClothingItemForm({
  mode,
  userId,
  initialValues,
  onSubmitAction,
  deleteSlot,
}: ClothingItemFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  /** 수정 모드 진입 시 원래 저장돼 있던 사진 — 저장 실패해도 절대 지우면 안 된다 */
  const initialPhotoUrl = initialValues?.photo_url ?? null;
  /** 이번 세션에 새로 업로드했지만 아직 저장이 확정되지 않은 사진 URL(저장 실패 시 정리 대상) */
  const pendingUploadUrlRef = useRef<string | null>(null);

  const form = useForm<ClothingItemInput>({
    resolver: zodResolver(clothingItemSchema),
    mode: "onChange",
    defaultValues: {
      name: initialValues?.name ?? "",
      category: initialValues?.category,
      photo_file: null,
      existing_photo_url: initialValues?.photo_url ?? undefined,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  useUnsavedChangesWarning(form.formState.isDirty && !isSubmitting);

  /**
   * 이번 세션에 새로 업로드했지만 DB에 저장되지 못한 사진을 Storage에서 정리하고
   * 폼을 원래 사진으로 되돌린다(저장 실패 시에만 호출되는 베스트에포트 롤백).
   */
  function cleanupPendingUpload() {
    const pendingUrl = pendingUploadUrlRef.current;
    if (!pendingUrl) {
      return;
    }

    const path = getStoragePathFromPublicUrl("item-photos", pendingUrl);
    if (path) {
      void deleteImage({ bucket: "item-photos", path });
    }

    pendingUploadUrlRef.current = null;
    form.setValue("existing_photo_url", initialPhotoUrl ?? undefined);
  }

  async function onSubmit(values: ClothingItemInput) {
    let result;
    try {
      result = await onSubmitAction(values);
    } catch {
      cleanupPendingUpload();
      toast.error("네트워크 연결을 확인해주세요");
      return;
    }

    if (!result.success) {
      cleanupPendingUpload();
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof ClothingItemInput, {
            message: messages[0],
          });
        }
      }
      toast.error(result.error);
      return;
    }

    pendingUploadUrlRef.current = null;
    toast.success(mode === "create" ? "아이템을 등록했어요" : "아이템을 수정했어요");
    router.push("/closet");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="item-photo" className="text-sm font-medium">
            사진(선택)
          </label>
          <ImageUploader
            id="item-photo"
            bucket="item-photos"
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
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input
                  placeholder="예: 나이키 화이트 반팔티"
                  disabled={isSubmitting}
                  inputMode="text"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>카테고리</FormLabel>
              <CategorySelect
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="submit"
            className="flex-1"
            disabled={
              isSubmitting ||
              !form.formState.isValid ||
              (isEditMode && !form.formState.isDirty)
            }
          >
            {mode === "create" ? "등록하기" : "저장하기"}
          </Button>
          {deleteSlot}
        </div>
      </form>
    </Form>
  );
}
