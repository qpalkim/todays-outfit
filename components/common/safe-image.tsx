"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

/** 이미지 로딩 중 보여줄 옅은 회색 placeholder — 원격 이미지는 next/image가 blurDataURL을 자동 생성하지 못해 고정 데이터 URI를 사용한다 */
const SHIMMER_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMmYyZjIiIC8+PC9zdmc+";

interface SafeImageProps {
  src: string;
  alt: string;
  /** 뷰포트 대비 실제 렌더링 크기 힌트 — 그리드 썸네일은 좁게, 대표 사진은 넓게 지정 */
  sizes?: string;
}

/**
 * Storage 이미지 로드 실패 시 플레이스홀더 아이콘으로 대체하는 이미지.
 * next/image의 fill 모드를 사용하므로 부모 요소가 `relative`와 명시적 크기(aspect-square 등)를 가져야 한다.
 */
export function SafeImage({ src, alt, sizes }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <ImageIcon className="size-6 text-muted-foreground" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "33vw"}
      placeholder="blur"
      blurDataURL={SHIMMER_DATA_URL}
      className="object-cover"
      onError={() => setHasError(true)}
    />
  );
}
