"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, RotateCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { imageFileSchema } from "@/lib/validations/image";
import {
  deleteImage,
  getStoragePathFromPublicUrl,
  resizeAndConvertToWebp,
  uploadImage,
  type StorageBucket,
} from "@/lib/storage/upload";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  /** 업로드 대상 Storage 버킷 */
  bucket: StorageBucket;
  /** 현재 로그인 사용자 id — 업로드 경로(`{userId}/{uuid}.webp`) 구성에 사용 */
  userId: string;
  /** 현재 저장된 이미지의 공개 URL(없으면 null) */
  value: string | null;
  /** 업로드 성공/삭제 시 공개 URL(또는 null)을 전달 */
  onChange: (url: string | null) => void;
  disabled?: boolean;
  className?: string;
  /** 상위 폼의 <label htmlFor>와 연결하기 위한 숨김 파일 입력의 id */
  id?: string;
}

/** 파일 선택 → 미리보기 → 리사이즈/WebP 변환 → Storage 업로드까지 처리하는 이미지 업로더 */
export function ImageUploader({
  bucket,
  userId,
  value,
  onChange,
  disabled = false,
  className,
  id,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  // 컴포넌트가 언마운트될 때 브라우저 메모리에 남은 로컬 미리보기 URL을 해제한다
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  /** 선택된 파일을 검증하고 리사이즈·업로드까지 수행한다 */
  async function processFile(file: File) {
    const parsed = imageFileSchema.safeParse(file);
    if (!parsed.success) {
      setErrorMessage(
        parsed.error.issues[0]?.message ?? "이미지 파일을 확인해주세요",
      );
      return;
    }

    setErrorMessage(null);
    setPendingFile(file);

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const localPreview = URL.createObjectURL(file);
    objectUrlRef.current = localPreview;
    setPreviewUrl(localPreview);

    await uploadFile(file);
  }

  /** Storage 업로드를 실행하고 성공 시 이전 이미지를 정리한다 */
  async function uploadFile(file: File) {
    setIsUploading(true);
    setProgress(0);
    setErrorMessage(null);

    // Supabase Storage JS 클라이언트는 바이트 단위 업로드 진행률을 제공하지 않아
    // 실제 진행 중임을 보여주는 근사치 애니메이션으로 대체한다.
    const progressTimer = setInterval(() => {
      setProgress((current) => (current < 90 ? current + 10 : current));
    }, 150);

    try {
      const previousUrl = value;
      const webpBlob = await resizeAndConvertToWebp(file);
      const result = await uploadImage({ bucket, userId, file: webpBlob });

      setProgress(100);
      onChange(result.publicUrl);

      if (previousUrl && previousUrl !== result.publicUrl) {
        const previousPath = getStoragePathFromPublicUrl(bucket, previousUrl);
        if (previousPath) {
          void deleteImage({ bucket, path: previousPath });
        }
      }
    } catch {
      setErrorMessage("업로드에 실패했습니다. 다시 시도해주세요");
    } finally {
      clearInterval(progressTimer);
      setIsUploading(false);
    }
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      void processFile(file);
    }
  }

  function handleRetry() {
    if (pendingFile) {
      void uploadFile(pendingFile);
    }
  }

  async function handleRemove() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewUrl(null);
    setPendingFile(null);
    setErrorMessage(null);
    onChange(null);

    if (value) {
      const path = getStoragePathFromPublicUrl(bucket, value);
      if (path) {
        void deleteImage({ bucket, path });
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileInputChange}
        disabled={disabled || isUploading}
      />

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-md border">
          {/* eslint-disable-next-line @next/next/no-img-element -- blob: 로컬 미리보기 URL이라 next/image로 최적화할 수 없음 */}
          <img
            src={previewUrl}
            alt="업로드한 이미지 미리보기"
            className="aspect-square w-full object-cover"
          />
          {!isUploading && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
              disabled={disabled}
              aria-label="이미지 삭제"
            >
              <X className="size-4" strokeWidth={1.5} />
            </Button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isUploading}
          className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ImageIcon className="size-8" strokeWidth={1.5} />
          사진 선택
        </button>
      )}

      {isUploading && <Progress value={progress} />}

      {errorMessage && (
        <div className="flex items-center justify-between gap-2 text-sm text-destructive">
          <span>{errorMessage}</span>
          {pendingFile && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRetry}
            >
              <RotateCcw className="size-4" strokeWidth={1.5} />
              재시도
            </Button>
          )}
        </div>
      )}

      {previewUrl && !isUploading && !errorMessage && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          사진 교체
        </Button>
      )}
    </div>
  );
}
