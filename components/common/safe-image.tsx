"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
}

/** Storage 이미지 로드 실패 시 플레이스홀더 아이콘으로 대체하는 이미지 */
export function SafeImage({ src, alt, className }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted",
          className,
        )}
      >
        <ImageIcon className="size-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- Storage 공개 URL은 next/image remotePatterns 미등록 상태(Task 022에서 전환 예정)
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
