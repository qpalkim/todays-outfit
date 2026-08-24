"use client";

import { Check, ImageIcon } from "lucide-react";

import type { ClothingItem } from "@/types/clothing";
import {
  CLOTHING_CATEGORY_EMOJIS,
  CLOTHING_CATEGORY_LABELS,
} from "@/lib/constants/category";
import { SafeImage } from "@/components/common/safe-image";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  item: ClothingItem;
  variant?: "default" | "selected" | "editable";
  /** 그리드형 카드(기본) 또는 가로형 목록 행 — 목록형은 좁은 시트 등 가로 공간이 제한적인 곳에 사용 */
  layout?: "grid" | "list";
  onClick?: () => void;
  className?: string;
}

/** 옷장 아이템 썸네일 카드 — 목록 조회, 다중 선택, 편집 진입에 공통 사용 */
export function ItemCard({
  item,
  variant = "default",
  layout = "grid",
  onClick,
  className,
}: ItemCardProps) {
  const isSelected = variant === "selected";
  const categoryLabel = `${CLOTHING_CATEGORY_EMOJIS[item.category]} ${CLOTHING_CATEGORY_LABELS[item.category]}`;

  const thumbnail = item.photo_url ? (
    <SafeImage
      src={item.photo_url}
      alt={item.name}
      sizes={layout === "list" ? "48px" : "(max-width: 448px) 30vw, 150px"}
    />
  ) : (
    <div className="flex size-full items-center justify-center">
      <ImageIcon className="size-6 text-muted-foreground" strokeWidth={1.5} />
    </div>
  );

  if (layout === "list") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border p-2 text-left transition-colors",
          isSelected ? "border-primary bg-accent" : "border-border",
          className,
        )}
      >
        <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
          {thumbnail}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-sm font-medium">{item.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {categoryLabel}
          </p>
        </div>
        {isSelected && (
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3" strokeWidth={1.5} />
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-11 cursor-pointer flex-col gap-1 rounded-md border p-1 text-left transition-colors",
        isSelected ? "border-primary ring-2 ring-primary" : "border-border",
        className,
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-muted">
        {thumbnail}
        {isSelected && (
          <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3" strokeWidth={1.5} />
          </span>
        )}
      </div>
      <p className="truncate text-xs font-medium">{item.name}</p>
      <p className="truncate text-[11px] text-muted-foreground">
        {categoryLabel}
      </p>
    </button>
  );
}
