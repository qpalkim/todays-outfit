"use client";

import {
  CLOTHING_CATEGORIES,
  CLOTHING_CATEGORY_EMOJIS,
  CLOTHING_CATEGORY_LABELS,
  type ClothingCategory,
} from "@/lib/constants/category";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type CategoryFilterValue = ClothingCategory | "all";

interface CategoryTabsProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
  className?: string;
}

/** 탭 6칸이 좁은 화면에서도 스크롤 없이 한 번에 들어오도록 기본보다 좁힌 트리거 스타일 */
const TRIGGER_CLASS = "gap-1 px-1.5 text-xs";

/**
 * 목록 화면용 카테고리 필터 탭(전체 + 상의/하의/신발/아우터/기타).
 * flex-1(동일하게 "늘어나기")만으로는 라벨 길이가 제각각이라 탭 사이 여백이
 * 고르지 않게 보였다("전체"는 넉넉하고 "아우터"는 빡빡함) — 6칸을 완전히
 * 같은 너비로 고정하는 grid로 바꿔 균등한 간격을 보장한다.
 * iPhone SE 등 375px급 화면에서는 기본 트리거 패딩/폰트 크기로 6칸의
 * 최소 콘텐츠 폭 합이 화면보다 넓어져 오른쪽 탭이 스크롤 없이는 안 보였다
 * (스크롤은 여전히 폴백으로 남겨두되, 흔한 모바일 폭에서 스크롤 없이 다
 * 보이도록 패딩·폰트를 좁혔다).
 */
export function CategoryTabs({ value, onChange, className }: CategoryTabsProps) {
  return (
    <div className="scrollbar-hide -mx-4 overflow-x-auto px-4">
      <Tabs
        value={value}
        onValueChange={(next) => onChange(next as CategoryFilterValue)}
        className={cn("w-full", className)}
      >
        <TabsList className="grid w-full grid-cols-[repeat(6,minmax(max-content,1fr))]">
          <TabsTrigger value="all" className={TRIGGER_CLASS}>
            전체
          </TabsTrigger>
          {CLOTHING_CATEGORIES.map((category) => (
            <TabsTrigger key={category} value={category} className={TRIGGER_CLASS}>
              {CLOTHING_CATEGORY_EMOJIS[category]} {CLOTHING_CATEGORY_LABELS[category]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
