import { z } from "zod";

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const imageFileSchema = z
  .file()
  .max(MAX_IMAGE_SIZE_BYTES, { error: "이미지 용량은 5MB 이하여야 합니다" })
  .mime([...ACCEPTED_IMAGE_TYPES], {
    error: "jpg, png, webp 형식의 이미지만 업로드할 수 있습니다",
  });
