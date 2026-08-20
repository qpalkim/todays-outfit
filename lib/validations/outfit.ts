import { z } from "zod";

import { imageFileSchema } from "@/lib/validations/image";

export const outfitSchema = z
  .object({
    record_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { error: "날짜 형식이 올바르지 않습니다" }),
    photo_file: imageFileSchema.nullable(),
    existing_photo_url: z.url().optional(),
    memo: z
      .string()
      .trim()
      .max(200, { error: "메모는 최대 200자까지 입력 가능합니다" })
      .optional(),
    clothing_item_ids: z.array(z.uuid()).default([]),
  })
  .refine((data) => data.photo_file !== null || !!data.existing_photo_url, {
    error: "대표 사진을 선택해주세요",
    path: ["photo_file"],
  });

export type OutfitInput = z.infer<typeof outfitSchema>;
