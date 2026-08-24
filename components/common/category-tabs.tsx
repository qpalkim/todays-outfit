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

/**
 * 목록 화면용 카테고리 필터 탭(전체 + 상의/하의/신발/아우터/기타).
 * 탭 6개가 좁은 모바일 화면 폭을 넘어설 수 있어 가로 스크롤 컨테이너로 감싼다
 * (TabsList에 w-full을 주지 않아 콘텐츠 폭만큼만 차지하고, 넘치는 부분은 스크롤로 처리).
 */
export function CategoryTabs({ value, onChange, className }: CategoryTabsProps) {
  return (
    <div className="scrollbar-hide -mx-4 overflow-x-auto px-4">
      <Tabs
        value={value}
        onValueChange={(next) => onChange(next as CategoryFilterValue)}
        className={cn("w-fit", className)}
      >
        <TabsList>
          <TabsTrigger value="all" className="shrink-0">
            전체
          </TabsTrigger>
          {CLOTHING_CATEGORIES.map((category) => (
            <TabsTrigger key={category} value={category} className="shrink-0">
              {CLOTHING_CATEGORY_EMOJIS[category]} {CLOTHING_CATEGORY_LABELS[category]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
