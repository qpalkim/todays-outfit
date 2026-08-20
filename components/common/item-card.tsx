"use client";

import { Check } from "lucide-react";

import type { ClothingItem } from "@/types/clothing";
import { CLOTHING_CATEGORY_LABELS } from "@/lib/constants/category";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  item: ClothingItem;
  variant?: "default" | "selected" | "editable";
  onClick?: () => void;
  className?: string;
}

/** 옷장 아이템 썸네일 카드 — 목록 조회, 다중 선택, 편집 진입에 공통 사용 */
export function ItemCard({
  item,
  variant = "default",
  onClick,
  className,
}: ItemCardProps) {
  const isSelected = variant === "selected";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-11 flex-col gap-1 rounded-md border p-1 text-left transition-colors",
        isSelected ? "border-primary ring-2 ring-primary" : "border-border",
        className,
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element -- Storage 공개 URL은 next/image remotePatterns 미등록 상태(Task 022에서 전환 예정) */}
        <img
          src={item.photo_url}
          alt={item.name}
          className="size-full object-cover"
        />
        {isSelected && (
          <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3" />
          </span>
        )}
      </div>
      <p className="truncate text-xs font-medium">{item.name}</p>
      <p className="truncate text-[11px] text-muted-foreground">
        {CLOTHING_CATEGORY_LABELS[item.category]}
      </p>
    </button>
  );
}
