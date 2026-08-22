"use client";

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

interface ClothingItemFormProps {
  mode: "create" | "edit";
  userId: string;
  initialValues?: ClothingItem;
  /** 실제 저장을 수행하는 Server Action — create에는 createClothingItem, edit에는 updateClothingItem(id, ...)을 바인딩해 전달한다 */
  onSubmitAction: (
    values: ClothingItemInput,
  ) => Promise<ActionResult<ClothingItem>>;
}

/** 옷 아이템 등록/수정 겸용 폼 — 실제 저장 로직은 onSubmitAction으로 주입받는다 */
export function ClothingItemForm({
  mode,
  userId,
  initialValues,
  onSubmitAction,
}: ClothingItemFormProps) {
  const router = useRouter();

  const form = useForm<ClothingItemInput>({
    resolver: zodResolver(clothingItemSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      category: initialValues?.category,
      photo_file: null,
      existing_photo_url: initialValues?.photo_url ?? undefined,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: ClothingItemInput) {
    let result;
    try {
      result = await onSubmitAction(values);
    } catch {
      toast.error("네트워크 연결을 확인해주세요");
      return;
    }

    if (!result.success) {
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
          <label className="text-sm font-medium">사진(선택)</label>
          <ImageUploader
            bucket="item-photos"
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

        <Button type="submit" disabled={isSubmitting}>
          {mode === "create" ? "등록하기" : "저장하기"}
        </Button>
      </form>
    </Form>
  );
}
