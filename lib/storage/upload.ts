import { createClient } from "@/lib/supabase/client";

export type StorageBucket = "outfit-photos" | "item-photos";

/** 이미지를 장변 기준으로 축소하고 WebP Blob으로 변환한다 */
export async function resizeAndConvertToWebp(
  file: File,
  maxDimension = 1280,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    maxDimension / Math.max(bitmap.width, bitmap.height),
  );
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("이미지를 처리할 수 없습니다");
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("이미지 변환에 실패했습니다"));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      0.85,
    );
  });
}

export interface UploadImageParams {
  bucket: StorageBucket;
  userId: string;
  file: Blob;
}

export interface UploadImageResult {
  path: string;
  publicUrl: string;
}

/** Storage 버킷의 `{userId}/{uuid}.webp` 경로에 이미지를 업로드하고 공개 URL을 반환한다 */
export async function uploadImage({
  bucket,
  userId,
  file,
}: UploadImageParams): Promise<UploadImageResult> {
  const supabase = createClient();
  const path = `${userId}/${crypto.randomUUID()}.webp`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: "image/webp",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return { path, publicUrl };
}

export interface DeleteImageParams {
  bucket: StorageBucket;
  path: string;
}

/** Storage에서 이미지를 삭제한다(고아 파일 정리 목적의 베스트 에포트 호출이라 실패해도 던지지 않는다) */
export async function deleteImage({
  bucket,
  path,
}: DeleteImageParams): Promise<void> {
  const supabase = createClient();
  await supabase.storage.from(bucket).remove([path]);
}

/** Storage 공개 URL에서 해당 버킷 하위의 객체 경로를 추출한다(형식이 다르면 null) */
export function getStoragePathFromPublicUrl(
  bucket: StorageBucket,
  publicUrl: string,
): string | null {
  const marker = `/object/public/${bucket}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) {
    return null;
  }
  return publicUrl.slice(index + marker.length);
}
