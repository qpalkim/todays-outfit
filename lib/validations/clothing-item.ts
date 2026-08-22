import { z } from "zod";

import { CLOTHING_CATEGORIES } from "@/lib/constants/category";
import { imageFileSchema } from "@/lib/validations/image";

export const clothingItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "이름을 입력해주세요" })
    .max(30, { error: "이름은 최대 30자까지 입력 가능합니다" }),
  category: z.enum(CLOTHING_CATEGORIES, {
    error: "카테고리를 선택해주세요",
  }),
  photo_file: imageFileSchema.nullable(),
  existing_photo_url: z.url().optional(),
});

export type ClothingItemInput = z.infer<typeof clothingItemSchema>;
